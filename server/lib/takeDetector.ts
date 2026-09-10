import {
  SpeechSegment,
  TakeItem,
  TakeGroup,
  DeadAirInterval,
  DetectionResult,
  EditSettings,
} from "../../shared/videoEditorTypes";

/**
 * Default edit settings
 */
export const DEFAULT_EDIT_SETTINGS: EditSettings = {
  audioBleedEnabled: true,
  audioBleedDurationMs: 150,
  leadInPaddingMs: 80,
  leadOutPaddingMs: 120,
  aspectRatio: "9:16",
  resolution: "1080p",
  fps: 30,
};

/**
 * Parse timestamp string "[MM:SS.s - MM:SS.s] Text" or "MM:SS.s" to seconds
 */
export function parseTimestampToSeconds(ts: string): number {
  const parts = ts.trim().split(":");
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    return mins * 60 + secs;
  } else if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const mins = parseFloat(parts[1]);
    const secs = parseFloat(parts[2]);
    return hours * 3600 + mins * 60 + secs;
  }
  return parseFloat(ts) || 0;
}

/**
 * Format seconds to MM:SS.s
 */
export function formatSecondsToTimestamp(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  const paddedMins = mins.toString().padStart(2, "0");
  const paddedSecs = remSecs.toFixed(1).padStart(4, "0");
  return `${paddedMins}:${paddedSecs}`;
}

/**
 * Parse transcript text into structured SpeechSegments
 */
export function parseTranscriptText(text: string, clipName = "clip_1", clipIndex = 0): SpeechSegment[] {
  const lines = text.split("\n");
  const segments: SpeechSegment[] = [];
  let segIdx = 0;

  // Pattern: [00:32.2 - 00:47.1] Text content...
  const timestampRegex = /^\s*\[([\d:.]+)\s*-\s*([\d:.]+)\]\s*(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(timestampRegex);
    if (match) {
      const start = parseTimestampToSeconds(match[1]);
      const end = parseTimestampToSeconds(match[2]);
      const content = match[3].trim();
      if (content) {
        segIdx++;
        segments.push({
          id: `${clipName}_seg_${segIdx}`,
          start,
          end,
          text: content,
          clipIndex,
          clipName,
        });
      }
    } else {
      // Fallback for lines without timestamps: estimate sequential timing
      segIdx++;
      segments.push({
        id: `${clipName}_seg_${segIdx}`,
        start: (segIdx - 1) * 3,
        end: segIdx * 3,
        text: line,
        clipIndex,
        clipName,
      });
    }
  }

  return segments;
}

/**
 * Normalize text for semantic/token comparison
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tokenize normalized text into keywords (removing common tiny fillers)
 */
export function getKeywords(str: string): Set<string> {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "so", "to", "in", "on", "at", "by", "for",
    "with", "about", "against", "between", "into", "through", "during", "before", "after",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does",
    "did", "will", "would", "shall", "should", "may", "might", "must", "can", "could",
    "i", "you", "he", "she", "it", "we", "they", "them", "their", "this", "that", "these",
    "those", "um", "uh", "like", "you know"
  ]);

  const tokens = normalizeText(str).split(" ");
  const result = new Set<string>();
  for (const t of tokens) {
    if (t.length > 1 && !stopWords.has(t)) {
      result.add(t);
    }
  }
  return result;
}

/**
 * Calculate Jaccard keyword similarity between two text snippets
 */
export function calculateSimilarity(textA: string, textB: string): number {
  const kwA = getKeywords(textA);
  const kwB = getKeywords(textB);

  if (kwA.size === 0 && kwB.size === 0) {
    return normalizeText(textA) === normalizeText(textB) ? 1.0 : 0.0;
  }

  const arrA = Array.from(kwA);
  const arrB = Array.from(kwB);
  const union = new Set(arrA.concat(arrB));
  let intersection = 0;
  for (let i = 0; i < arrA.length; i++) {
    const w = arrA[i];
    if (kwB.has(w)) intersection++;
  }

  const jaccard = intersection / union.size;

  // Check prefix / substring relationship
  const normA = normalizeText(textA);
  const normB = normalizeText(textB);
  let prefixBonus = 0;
  if (normA.length > 10 && normB.length > 10) {
    if (normA.startsWith(normB) || normB.startsWith(normA)) {
      prefixBonus = 0.35;
    } else {
      // Longest common substring ratio
      const minLen = Math.min(normA.length, normB.length);
      if (normA.includes(normB.slice(0, Math.floor(minLen * 0.6))) || normB.includes(normA.slice(0, Math.floor(minLen * 0.6)))) {
        prefixBonus = 0.25;
      }
    }
  }

  return Math.min(1.0, jaccard + prefixBonus);
}

/**
 * Check whether a segment is a stub or false start
 */
export function isFalseStartOrStub(text: string): boolean {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);

  // Single short word or connector like "And", "To", "I", "But", "Lotion", "I would", "The", "I'm", "would"
  if (words.length <= 2) {
    const stubWords = new Set([
      "and", "but", "to", "i", "so", "lotion", "the", "a", "i would", "and then", "i'm", "im", "would"
    ]);
    if (stubWords.has(trimmed.toLowerCase())) return true;
  }

  // Trailing cutoff symbols or incomplete indicators
  if (trimmed.endsWith("...") || trimmed.endsWith("--") || trimmed.endsWith("-") || trimmed.endsWith("ten...") || trimmed.endsWith("p--")) {
    return true;
  }

  // Ends with trailing conjunctions/prepositions
  const trailingIncomplete = /(?:and|but|so|to|if|that's|in a new|giving|celebrate the new|for a|the l-)\.?$/i;
  if (trailingIncomplete.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Main Take Detector and Grouping Engine
 */
export function detectTakesAndGroups(
  segments: SpeechSegment[],
  options?: {
    totalDuration?: number;
    leadInPaddingMs?: number;
    leadOutPaddingMs?: number;
    similarityThreshold?: number;
  }
): DetectionResult {
  const leadIn = (options?.leadInPaddingMs ?? 80) / 1000;
  const leadOut = (options?.leadOutPaddingMs ?? 120) / 1000;
  const similarityThreshold = options?.similarityThreshold ?? 0.35;

  if (segments.length === 0) {
    return {
      clipCount: 0,
      clipNames: [],
      totalRawDuration: 0,
      totalEditedDuration: 0,
      deadAirRemovedSeconds: 0,
      savingsPercent: 0,
      takeGroups: [],
      deadAirIntervals: [],
      allTakes: [],
    };
  }

  const clipNames = Array.from(new Set(segments.map(s => s.clipName || "clip_1")));

  // Step 1: Pre-merge isolated micro-fragments that belong to the immediately following segment
  // e.g. [00:32.2 - 00:47.1] "And" immediately before "then when they complain..."
  const cleanedSegments: SpeechSegment[] = [];
  for (let i = 0; i < segments.length; i++) {
    const curr = segments[i];
    const words = curr.text.trim().split(/\s+/);
    const rawDuration = curr.end - curr.start;

    // If it's a known stub/connector (1-2 words) that spans a long gap or precedes a full sentence, discard it
    if (isFalseStartOrStub(curr.text) && (words.length <= 2 || rawDuration > 3.0)) {
      if (i + 1 < segments.length) {
        continue;
      }
    }

    // Segment timing normalization: if Whisper stretched a short phrase across a massive pause
    // (e.g. > 4s for 3 words), the spoken speech actually occurred in the first few seconds.
    const wordCount = words.length;
    const estimatedMaxSpeechSec = Math.max(1.8, wordCount * 0.75 + 1.2);
    let adjustedStart = curr.start;
    let adjustedEnd = curr.end;

    if (rawDuration > estimatedMaxSpeechSec * 2 && wordCount < 10) {
      adjustedEnd = adjustedStart + estimatedMaxSpeechSec;
    }

    cleanedSegments.push({
      ...curr,
      start: Number(adjustedStart.toFixed(2)),
      end: Number(adjustedEnd.toFixed(2)),
    });
  }

  // Step 2: Cluster segments into TakeGroups using sequential semantic comparison
  const groups: TakeGroup[] = [];
  let currentGroupTakes: SpeechSegment[] = [];
  let groupIdx = 1;

  function finalizeGroup(groupSegments: SpeechSegment[]) {
    if (groupSegments.length === 0) return;

    const gId = `group_${groupIdx}`;
    const takes: TakeItem[] = [];

    // Find the longest or cleanest take to generate the topic summary
    let longestText = "";
    for (const seg of groupSegments) {
      if (seg.text.length > longestText.length) {
        longestText = seg.text;
      }
    }

    // Clean topic: first 8-10 words
    const topicWords = longestText.replace(/["']/g, "").split(/\s+/).slice(0, 8).join(" ");
    const topic = topicWords.length > 50 ? `${topicWords.slice(0, 50)}...` : `${topicWords}...`;

    // Build take items
    for (let t = 0; t < groupSegments.length; t++) {
      const s = groupSegments[t];
      const isStub = isFalseStartOrStub(s.text);
      const isComplete = !isStub && s.text.trim().split(/\s+/).length >= 3;
      const paddedStart = Math.max(0, s.start - leadIn);
      const paddedEnd = s.end + leadOut;

      takes.push({
        id: `${gId}_take_${t + 1}`,
        groupId: gId,
        takeNumber: t + 1,
        clipIndex: s.clipIndex ?? 0,
        clipName: s.clipName ?? "clip_1",
        startTime: s.start,
        endTime: s.end,
        paddedStart,
        paddedEnd,
        duration: Math.max(0.1, Number((paddedEnd - paddedStart).toFixed(2))),
        text: s.text,
        isComplete,
        isSelected: false, // will assign next
        isLastTake: t === groupSegments.length - 1,
      });
    }

    // Apply LAST TAKE RULE:
    // Prefer the last complete take in the group.
    // If all takes are stubs or only 1 take exists, pick the last one.
    let chosenIdx = takes.length - 1;
    for (let k = takes.length - 1; k >= 0; k--) {
      if (takes[k].isComplete) {
        chosenIdx = k;
        break;
      }
    }

    for (let k = 0; k < takes.length; k++) {
      if (k === chosenIdx) {
        takes[k].isSelected = true;
        takes[k].notes = takes.length > 1 ? `Selected: Last complete take (${k + 1} of ${takes.length})` : "Single take";
      } else {
        takes[k].isSelected = false;
        takes[k].notes = takes[k].isComplete ? `Alternative take (${k + 1} of ${takes.length})` : "Dropped: Incomplete / false start";
      }
    }

    groups.push({
      id: gId,
      groupIndex: groupIdx,
      topic,
      takes,
      selectedTakeId: takes[chosenIdx].id,
      hasMultipleTakes: takes.length > 1,
    });

    groupIdx++;
  }

  // Iterate through cleaned segments and group retakes
  for (let i = 0; i < cleanedSegments.length; i++) {
    const seg = cleanedSegments[i];

    if (currentGroupTakes.length === 0) {
      currentGroupTakes.push(seg);
      continue;
    }

    // Compare with the current group's takes
    const lastInGroup = currentGroupTakes[currentGroupTakes.length - 1];
    const firstInGroup = currentGroupTakes[0];

    const simWithLast = calculateSimilarity(seg.text, lastInGroup.text);
    const simWithFirst = calculateSimilarity(seg.text, firstInGroup.text);
    const maxSim = Math.max(simWithLast, simWithFirst);

    // Check if the current segment is a partial start of the next line,
    // or if the previous was a partial start of this line.
    const isPrevStub = isFalseStartOrStub(lastInGroup.text);
    const isCurrStub = isFalseStartOrStub(seg.text);
    const timeGap = seg.start - lastInGroup.end;

    // Grouping conditions:
    // 1. High similarity (e.g. repeated sentence / line)
    // 2. Either is a false start and time gap is within retake horizon (< 60s) with modest similarity (> 0.20)
    // 3. Or direct continuation of an unfinished fragment (e.g. "So the actual daily routine is wash every day." followed by "Lotion every day" if within short gap)
    const shouldGroup =
      maxSim >= similarityThreshold ||
      (isPrevStub && maxSim >= 0.20 && timeGap < 45) ||
      (isCurrStub && maxSim >= 0.20 && timeGap < 45);

    if (shouldGroup) {
      currentGroupTakes.push(seg);
    } else {
      // Group boundary reached
      finalizeGroup(currentGroupTakes);
      currentGroupTakes = [seg];
    }
  }

  // Finalize remaining group
  if (currentGroupTakes.length > 0) {
    finalizeGroup(currentGroupTakes);
  }

  // Step 3: Calculate dead air intervals and duration statistics
  const allTakes: TakeItem[] = [];
  for (const g of groups) {
    allTakes.push(...g.takes);
  }

  const selectedTakes = allTakes.filter(t => t.isSelected);
  const totalRawDuration = options?.totalDuration ?? (segments.length > 0 ? segments[segments.length - 1].end : 0);

  let totalEditedDuration = 0;
  for (const t of selectedTakes) {
    totalEditedDuration += t.duration;
  }
  totalEditedDuration = Number(totalEditedDuration.toFixed(2));

  const deadAirRemovedSeconds = Number(Math.max(0, totalRawDuration - totalEditedDuration).toFixed(2));
  const savingsPercent = totalRawDuration > 0
    ? Number(((deadAirRemovedSeconds / totalRawDuration) * 100).toFixed(1))
    : 0;

  // Identify dead air intervals between selected takes
  const deadAirIntervals: DeadAirInterval[] = [];
  let lastEnd = 0;

  for (const take of selectedTakes) {
    if (take.startTime > lastEnd + 0.3) {
      deadAirIntervals.push({
        startTime: lastEnd,
        endTime: take.startTime,
        duration: Number((take.startTime - lastEnd).toFixed(2)),
        reason: lastEnd === 0 ? "preparation" : (take.startTime - lastEnd > 15 ? "prop_setup" : "silence"),
      });
    }
    lastEnd = take.endTime;
  }

  if (totalRawDuration > lastEnd + 0.3) {
    deadAirIntervals.push({
      startTime: lastEnd,
      endTime: totalRawDuration,
      duration: Number((totalRawDuration - lastEnd).toFixed(2)),
      reason: "silence",
    });
  }

  return {
    clipCount: clipNames.length,
    clipNames,
    totalRawDuration,
    totalEditedDuration,
    deadAirRemovedSeconds,
    savingsPercent,
    takeGroups: groups,
    deadAirIntervals,
    allTakes,
  };
}
