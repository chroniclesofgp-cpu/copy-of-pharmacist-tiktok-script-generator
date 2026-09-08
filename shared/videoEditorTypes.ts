export interface SpeechSegment {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
  clipIndex?: number;
  clipName?: string;
}

export interface TakeItem {
  id: string;
  groupId: string;
  takeNumber: number;
  clipIndex: number;
  clipName: string;
  startTime: number;      // raw start seconds in source
  endTime: number;        // raw end seconds in source
  paddedStart: number;    // with lead-in padding
  paddedEnd: number;      // with lead-out padding
  duration: number;       // padded duration in seconds
  text: string;
  isComplete: boolean;    // false if it looks like a cutoff/false start
  isSelected: boolean;    // true if this take is chosen for the final cut
  isLastTake: boolean;    // true if it's the last take in the group
  notes?: string;         // e.g. "Chosen: Final clean take", "Dropped: Incomplete start"
}

export interface TakeGroup {
  id: string;
  groupIndex: number;
  topic: string;          // brief label / summary of what is being spoken
  takes: TakeItem[];
  selectedTakeId: string | null;
  hasMultipleTakes: boolean;
}

export interface DeadAirInterval {
  startTime: number;
  endTime: number;
  duration: number;
  reason: 'preparation' | 'prop_setup' | 'silence' | 'rejected_take';
}

export interface DetectionResult {
  clipCount: number;
  clipNames: string[];
  totalRawDuration: number;
  totalEditedDuration: number;
  deadAirRemovedSeconds: number;
  savingsPercent: number;
  takeGroups: TakeGroup[];
  deadAirIntervals: DeadAirInterval[];
  allTakes: TakeItem[];
}

export interface EditSettings {
  audioBleedEnabled: boolean;
  audioBleedDurationMs: number; // e.g. 150
  leadInPaddingMs: number;      // e.g. 80
  leadOutPaddingMs: number;     // e.g. 120
  aspectRatio: '9:16' | 'source';
  resolution: '1080p' | '720p';
  fps: 30 | 24 | 60;
}

export interface RenderRequest {
  clipNames: string[];
  selectedTakeIds: string[];
  settings: EditSettings;
}

export interface RenderStatus {
  status: 'idle' | 'rendering' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
  outputFilename?: string;
  fileSizeBytes?: number;
  durationSeconds?: number;
  error?: string;
}

export interface SampleClipMetadata {
  id: string;
  name: string;
  path: string;
  transcriptPath?: string;
  hasTranscript: boolean;
  durationSeconds: number;
  width: number;
  height: number;
  aspectRatio: string;
  fps: number;
  sizeBytes: number;
  description: string;
}
