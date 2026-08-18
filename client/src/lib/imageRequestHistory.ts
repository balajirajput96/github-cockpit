export type ImageRequestEvent = {
  at: string;
  id: string;
  label: string;
  tone: "pending" | "ready" | "error";
};

const MAX_IMAGE_HISTORY = 4;

export function appendImageRequestEvent(history: ImageRequestEvent[], event: ImageRequestEvent): ImageRequestEvent[] {
  return [event, ...history].slice(0, MAX_IMAGE_HISTORY);
}
