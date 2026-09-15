export type RadarQueueSort =
  | "strongest"
  | "newest"
  | "momentum"
  | "sales"
  | "fresh_video"
  | "recent_competition";

type CandidateLike = {
  id: number;
  reviewStatus: string;
  updatedAt?: Date | string | number | null;
  activeCreatorCount?: number | null;
  rawData?: unknown;
  metrics?: unknown;
};

const statusRank: Record<string, number> = {
  approved_for_campaign_planning: 5,
  candidate: 4,
  watchlist: 3,
  human_review: 2,
  avoid: 0,
};

const numberValue = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/[,$%]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const objectValue = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? value as Record<string, unknown> : {};

const updatedTime = (candidate: CandidateLike): number => {
  const value = candidate.updatedAt;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (typeof value === "string") return Date.parse(value) || 0;
  return 0;
};

const totalSales = (candidate: CandidateLike): number =>
  numberValue(objectValue(candidate.rawData).totalSales) ?? 0;

const acceleration = (candidate: CandidateLike): number =>
  numberValue(objectValue(candidate.metrics).accelerationPct) ?? -Infinity;

const strengthRatio = (candidate: CandidateLike): number => {
  const metrics = objectValue(candidate.metrics);
  const met = numberValue(metrics.deterministicSignalsMet) ?? 0;
  const considered = numberValue(metrics.deterministicSignalsConsidered) ?? 0;
  return considered > 0 ? met / considered : 0;
};

const freshVideoCount = (candidate: CandidateLike, now: number): number => {
  const raw = objectValue(candidate.rawData);
  const videos = Array.isArray(raw.rawTopVideos) ? raw.rawTopVideos : [];
  const cutoff = now - 60 * 24 * 60 * 60 * 1000;
  return videos.filter((video) => {
    const item = objectValue(video);
    const date = item.publish_date ?? item.publishDate ?? item.published_at ?? item.publishedAt;
    const timestamp = typeof date === "number" ? date : typeof date === "string" ? Date.parse(date) : NaN;
    return Number.isFinite(timestamp) && timestamp >= cutoff;
  }).length;
};

const recentCreatorCount = (candidate: CandidateLike): number =>
  numberValue(candidate.activeCreatorCount) ?? numberValue(objectValue(candidate.metrics).activeCreatorCount) ?? Number.POSITIVE_INFINITY;

export function sortRadarCandidates<T extends CandidateLike>(candidates: T[], sort: RadarQueueSort, now = Date.now()): T[] {
  return [...candidates].sort((left, right) => {
    const leftAvoid = left.reviewStatus === "avoid" ? 1 : 0;
    const rightAvoid = right.reviewStatus === "avoid" ? 1 : 0;
    if (leftAvoid !== rightAvoid) return leftAvoid - rightAvoid;

    let comparison = 0;
    if (sort === "newest") comparison = updatedTime(right) - updatedTime(left);
    if (sort === "strongest") comparison = (strengthRatio(right) - strengthRatio(left)) || (statusRank[right.reviewStatus] ?? 1) - (statusRank[left.reviewStatus] ?? 1) || (acceleration(right) - acceleration(left)) || (totalSales(right) - totalSales(left));
    if (sort === "momentum") comparison = acceleration(right) - acceleration(left) || (strengthRatio(right) - strengthRatio(left)) || (totalSales(right) - totalSales(left));
    if (sort === "sales") comparison = totalSales(right) - totalSales(left) || (strengthRatio(right) - strengthRatio(left));
    if (sort === "fresh_video") comparison = freshVideoCount(right, now) - freshVideoCount(left, now) || (strengthRatio(right) - strengthRatio(left));
    if (sort === "recent_competition") comparison = recentCreatorCount(left) - recentCreatorCount(right) || (strengthRatio(right) - strengthRatio(left));

    return comparison || updatedTime(right) - updatedTime(left) || right.id - left.id;
  });
}

export { freshVideoCount };
