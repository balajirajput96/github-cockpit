export type ImageLifecycleInput = {
  hasError: boolean;
  imageUrl?: string;
  isPending: boolean;
};

export type ImageLifecycleState = {
  actionLabel: "Create image" | "Creating" | "Retry image";
  label: string;
  tone: "is-idle" | "is-pending" | "is-error" | "is-ready";
};

export function getImageLifecycle({ hasError, imageUrl, isPending }: ImageLifecycleInput): ImageLifecycleState {
  if (isPending) {
    return {
      actionLabel: "Creating",
      label: "Generating server-side visual — this request has a 45-second safety limit.",
      tone: "is-pending",
    };
  }

  if (imageUrl) {
    return {
      actionLabel: "Create image",
      label: "Image ready in protected storage. Open it below or make a new request.",
      tone: "is-ready",
    };
  }

  if (hasError) {
    return {
      actionLabel: "Retry image",
      label: "Image request did not complete. You can safely retry with the same prompt.",
      tone: "is-error",
    };
  }

  return {
    actionLabel: "Create image",
    label: "Ready for an on-demand image request. No browser credential is used.",
    tone: "is-idle",
  };
}
