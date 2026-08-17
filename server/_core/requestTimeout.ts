export type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

export const DEFAULT_PROVIDER_TIMEOUT_MS = 45_000;

export async function fetchWithTimeout(
  url: string,
  init: FetchInit,
  timeoutMs = DEFAULT_PROVIDER_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Provider request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
