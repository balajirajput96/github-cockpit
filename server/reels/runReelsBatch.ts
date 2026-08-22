export interface ReelBatchState {
  lastCompletedReel: string;
  nextReelNumber: number;
  batchFolderId: string;
  status: "idle" | "running" | "completed";
}

export function getInitialBatchState(): ReelBatchState {
  return {
    lastCompletedReel: "0001",
    nextReelNumber: 2,
    batchFolderId: "1585_x-GJem9bYkk31DkGGBwnAI_TXCep", // Batch_001
    status: "idle",
  };
}
