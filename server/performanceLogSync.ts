export type PerformanceLogMetrics = {
  views?: number;
  avgWatchTimeSec?: number;
  avgWatchTimePct?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  follows?: number;
};

export type PerformanceLogSyncInput = {
  videoNumber: number;
  postDate?: string;
  tiktokUrl?: string;
  scriptFile?: string;
  hookType: string;
  product: string;
  ctaId?: string;
  urgencyTrigger?: string;
  filmingDayCheck?: "conditional_cart" | "live_sale_or_bundle" | "historical_sellout_or_restock" | "not_applicable";
  screenshotUrl?: string;
  metrics: PerformanceLogMetrics;
  diagnosis?: string;
  action?: string;
};

const syncMarker = (videoNumber: number) => `PERFORMANCE_SYNC:VIDEO_${videoNumber}`;

function displayNumber(value: number | undefined): string {
  return value == null ? "—" : value.toLocaleString();
}

function displayPercent(value: number | undefined): string {
  return value == null ? "—" : `${value}%`;
}

function displaySeconds(value: number | undefined): string {
  return value == null ? "—" : `${value}s`;
}

export function buildPerformanceLogSyncBlock(input: PerformanceLogSyncInput): string {
  const marker = syncMarker(input.videoNumber);
  const source = input.screenshotUrl
    ? `[Analytics screenshot](${input.screenshotUrl})`
    : "Reviewed manual entry";
  const url = input.tiktokUrl ? `[Open TikTok video](${input.tiktokUrl})` : "Not supplied";

  return [
    `<!-- ${marker} -->`,
    `### App-Synced Analytics — Video ${input.videoNumber}`,
    `**Product:** ${input.product}  `,
    `**Hook:** ${input.hookType}  `,
    `**Post date:** ${input.postDate || "Not supplied"}  `,
    `**TikTok:** ${url}  `,
    `**Script:** ${input.scriptFile || "Not supplied"}  `,
    `**CTA experiment:** ${input.ctaId || "Not recorded"} — ${input.urgencyTrigger || "Not recorded"}  `,
    `**Filming-day check:** ${input.filmingDayCheck || "Not recorded"}  `,
    `**Source:** ${source}`,
    "",
    "| Views | Avg watch | Watch % | Likes | Saves | Shares | Comments | New followers |",
    "|---:|---:|---:|---:|---:|---:|---:|---:|",
    `| ${displayNumber(input.metrics.views)} | ${displaySeconds(input.metrics.avgWatchTimeSec)} | ${displayPercent(input.metrics.avgWatchTimePct)} | ${displayNumber(input.metrics.likes)} | ${displayNumber(input.metrics.saves)} | ${displayNumber(input.metrics.shares)} | ${displayNumber(input.metrics.comments)} | ${displayNumber(input.metrics.follows)} |`,
    input.diagnosis ? `**Diagnostic read:** ${input.diagnosis}` : "",
    input.action ? `**Next action:** ${input.action}` : "",
    `<!-- /${marker} -->`,
  ].filter(Boolean).join("\n");
}

export function upsertPerformanceLogSync(content: string, input: PerformanceLogSyncInput): string {
  const marker = syncMarker(input.videoNumber);
  const block = buildPerformanceLogSyncBlock(input);
  const blockPattern = new RegExp(`<!-- ${marker} -->[\\s\\S]*?<!-- /${marker} -->`);

  if (blockPattern.test(content)) {
    return content.replace(blockPattern, block);
  }

  const sectionHeading = "## App-Synced Analytics";
  if (content.includes(sectionHeading)) {
    return `${content.trimEnd()}\n\n${block}\n`;
  }

  return `${content.trimEnd()}\n\n---\n\n${sectionHeading}\n\nThis section is updated only after a user reviews parsed TikTok analytics in Video Lab.\n\n${block}\n`;
}
