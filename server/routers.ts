import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookie } from "cookie";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { collectAndRecordWorkflowSignals, createDailyEvidenceScheduleRecord, createPr46Review, createWorkflowMonitorScheduleRecord, getDailyEvidence, getLatestPr46Review, getLatestWorkflowSignals, getWorkflowMonitorEvidence } from "./db";
import { createHeartbeatJob } from "./_core/heartbeat";
import { getPublicPortfolio } from "./githubPublic";

const agentIntentSchema = z.enum(["repository", "automation", "media"]);

const agentPlanSchema = z.object({
  title: z.string().min(3).max(90),
  summary: z.string().min(10).max(480),
  steps: z.array(z.object({
    title: z.string().min(3).max(90),
    detail: z.string().min(8).max(280),
    mode: z.enum(["inspect", "draft", "review"]),
  })).min(2).max(5),
  guardrails: z.array(z.string().min(4).max(180)).min(2).max(5),
});

const agentPlanJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          mode: { type: "string", enum: ["inspect", "draft", "review"] },
        },
        required: ["title", "detail", "mode"],
        additionalProperties: false,
      },
    },
    guardrails: { type: "array", items: { type: "string" } },
  },
  required: ["title", "summary", "steps", "guardrails"],
  additionalProperties: false,
} as const;

const plannerContext: Record<z.infer<typeof agentIntentSchema>, string> = {
  repository: "Plan a repository-health or code-review task. Do not claim to run commands, merge pull requests, alter repository settings, or access private data.",
  automation: "Plan a deterministic automation task. Prefer a GitHub Actions workflow or reviewable draft over uncontrolled background execution. Do not schedule or trigger an external workflow yourself.",
  media: "Plan an image or video production task. Images can be created on demand; video output requires a separately configured provider, so provide a bounded shot-plan rather than claiming a rendered video.",
};

const buildPlannerFallback = (
  intent: z.infer<typeof agentIntentSchema>,
  prompt: string,
) => agentPlanSchema.parse({
  title: "Review-safe fallback plan",
  summary: "The planning provider returned unusable structured output, so this deterministic fallback keeps the request bounded, reviewable, and free of external writes.",
  steps: [
    {
      title: "Inspect current evidence",
      detail: `Review the available ${intent} signals relevant to this request: ${prompt.slice(0, 180)}`,
      mode: "inspect",
    },
    {
      title: "Draft the smallest next action",
      detail: "Prepare a concise recommendation or patch proposal without triggering a workflow, merge, comment, or repository setting change.",
      mode: "draft",
    },
    {
      title: "Keep a human review gate",
      detail: "Open the relevant GitHub evidence and use a pull request or explicit owner decision for every consequential change.",
      mode: "review",
    },
  ],
  guardrails: [
    "Do not merge, push, retry workflows, or modify repository settings automatically.",
    "Keep credentials and tokens out of prompts, plans, and browser-visible data.",
    "Use a pull request or explicit owner review for consequential repository changes.",
  ],
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  cockpit: router({
    portfolio: protectedProcedure
      .input(z.object({ forceRefresh: z.boolean().optional() }).optional())
      .query(({ input }) => getPublicPortfolio("balajirajput96", input?.forceRefresh ?? false)),
    evidence: protectedProcedure.query(() => getDailyEvidence()),
    workflowSignals: protectedProcedure.query(() => getLatestWorkflowSignals()),
    refreshWorkflowSignals: adminProcedure.mutation(() => collectAndRecordWorkflowSignals()),
    workflowMonitorEvidence: protectedProcedure.query(() => getWorkflowMonitorEvidence()),
    latestReview: protectedProcedure.query(() => getLatestPr46Review()),
    recordPr46Review: adminProcedure.input(z.object({
      decision: z.literal("reviewed-hold-draft"),
      note: z.string().trim().min(8).max(700),
    })).mutation(({ ctx, input }) => createPr46Review(ctx.user.openId, input.decision, input.note)),
    registerDailyEvidenceSchedule: adminProcedure.mutation(async () => {
      const existing = await getDailyEvidence();
      if (existing?.scheduleCronTaskUid) return existing;
      const job = await createHeartbeatJob({
        name: "daily-cockpit-evidence",
        cron: "0 0 4 * * *",
        path: "/api/scheduled/daily-evidence",
        description: "Record independent 09:30 IST dashboard evidence freshness only; no GitHub writes or report mutation.",
      }, "");
      return createDailyEvidenceScheduleRecord(job.taskUid);
    }),
    registerWorkflowMonitorSchedule: adminProcedure.mutation(async ({ ctx }) => {
      const existing = await getWorkflowMonitorEvidence();
      if (existing?.scheduleCronTaskUid) return existing;
      const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
      const job = await createHeartbeatJob({
        name: "read-only-workflow-signal-monitor",
        cron: "0 0 */6 * * *",
        path: "/api/scheduled/workflow-monitor",
        description: "Collect public GitHub workflow metadata into Signal Ledger only. Never email, publish, merge, rebase, rerun, or alter GitHub settings.",
      }, sessionToken);
      return createWorkflowMonitorScheduleRecord(job.taskUid);
    }),
  }),
  agent: router({
    plan: protectedProcedure
      .input(z.object({
        intent: agentIntentSchema,
        prompt: z.string().trim().min(12).max(1_500),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          maxTokens: 1_400,
          messages: [
            {
              role: "system",
              content: "You are the planning core for a private GitHub agent workspace. Return only the requested strict JSON. Every plan must be safe, concise, and reviewable. Never instruct credential sharing, automatic merges, destructive commands, or unreviewed external posting.",
            },
            {
              role: "user",
              content: `${plannerContext[input.intent]}\n\nUser request:\n${input.prompt}`,
            },
          ],
          outputSchema: {
            name: "hybrid_agent_plan",
            strict: true,
            schema: agentPlanJsonSchema,
          },
        });

        const content = response.choices[0]?.message.content;
        if (typeof content !== "string" || content.trim().length === 0) {
          return buildPlannerFallback(input.intent, input.prompt);
        }

        try {
          return agentPlanSchema.parse(JSON.parse(content));
        } catch {
          return buildPlannerFallback(input.intent, input.prompt);
        }
      }),
    image: protectedProcedure
      .input(z.object({ prompt: z.string().trim().min(12).max(700) }))
      .mutation(async ({ input }) => {
        const result = await generateImage({
          prompt: `Create an original professional visual for a private software-agent workspace. ${input.prompt}. Do not include credentials, secrets, account names, logos, watermarks, or unreadably dense text.`,
        });
        if (!result.url) throw new Error("The image service did not return an image URL");
        return { url: result.url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
