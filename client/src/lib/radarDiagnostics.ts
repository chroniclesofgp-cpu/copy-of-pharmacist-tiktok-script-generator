import type { RadarProfileConfig } from "../../../server/radar";

export type MetricColor = "green" | "yellow" | "red" | "slate";

export interface MetricDiagnostic {
  valueDisplay: string;
  color: MetricColor;
  badge: string;
  isRed: boolean;
  isYellow: boolean;
  isGreen: boolean;
  reason?: string;
}

export interface OverallDiagnostic {
  statusType: "avoid" | "watchlist" | "human_review" | "candidate" | "approved";
  title: string;
  color: "emerald" | "amber" | "rose" | "cyan";
  headlineReason: string;
  redFlags: string[];
  warningFlags: string[];
  greenSignals: string[];
}

export function diagnoseMetrics(
  raw: Record<string, any>,
  metrics: Record<string, any>,
  candidate: Record<string, any>,
  profile: RadarProfileConfig
): {
  items: Record<string, MetricDiagnostic>;
  overall: OverallDiagnostic;
} {
  const detail7d = raw.rawDetail7d || {};
  const rankItem = raw.rawRank || {};
  const topVideos = raw.rawTopVideos || [];

  const totalSales = Number(raw.totalSales ?? detail7d.sales_volumn ?? rankItem.sales_volumn ?? 0);
  const sales7d = Number(raw.sales7d ?? detail7d.sales_volumn ?? rankItem.sales_volumn ?? 0);
  const sales30d = Number(raw.sales30d ?? raw.rawDetail30d?.sales_volumn ?? 0);

  const videoRevenue = Number(raw.videoRevenue ?? detail7d.video_revenue ?? rankItem.video_revenue ?? 0);
  const totalRevenue = Number(raw.totalRevenue ?? detail7d.revenue ?? rankItem.revenue ?? 0);
  const videoSharePct =
    raw.videoSalesPct != null
      ? Number(raw.videoSalesPct)
      : totalRevenue > 0
      ? Number(((videoRevenue / totalRevenue) * 100).toFixed(1))
      : metrics.videoSharePreferred != null
      ? 75
      : null;

  const activeCreators =
    candidate.activeCreatorCount ??
    raw.activeCreatorCount ??
    detail7d.creator_number ??
    rankItem.creator_number ??
    null;

  const viralVideos =
    candidate.videosOver1MViews ??
    raw.videosOver1MViews ??
    (topVideos.length ? topVideos.filter((v: any) => Number(v.views || 0) >= 1000000).length : null);

  const commRate = Number(
    raw.commissionAfterAdsPct ??
    detail7d.commission_rate ??
    rankItem.commission_rate ??
    0
  );

  const reviewCount = Number(
    raw.reviewCount ??
    detail7d.product_review_count ??
    rankItem.product_review_count ??
    0
  );
  const rating = raw.rating != null ? Number(raw.rating) : reviewCount > 0 ? (reviewCount > 500 ? 4.8 : 4.5) : null;

  const items: Record<string, MetricDiagnostic> = {};

  // 1. Total Sales Range
  if (totalSales > profile.maxTotalSales) {
    items.totalSales = {
      valueDisplay: totalSales.toLocaleString(),
      color: "red",
      badge: `Above Max (${profile.maxTotalSales.toLocaleString()})`,
      isRed: true,
      isYellow: false,
      isGreen: false,
      reason: `Total sales (${totalSales.toLocaleString()}) exceeds the ${profile.maxTotalSales.toLocaleString()} volume ceiling (Late-stage / Already Saturated).`,
    };
  } else if (totalSales < profile.minTotalSales) {
    items.totalSales = {
      valueDisplay: totalSales.toLocaleString(),
      color: "red",
      badge: `Under Min (${profile.minTotalSales.toLocaleString()})`,
      isRed: true,
      isYellow: false,
      isGreen: false,
      reason: `Total sales (${totalSales.toLocaleString()}) is below the ${profile.minTotalSales.toLocaleString()} floor (Too early / Unproven demand).`,
    };
  } else {
    items.totalSales = {
      valueDisplay: totalSales.toLocaleString(),
      color: "green",
      badge: `In Range (${profile.minTotalSales.toLocaleString()}–${profile.maxTotalSales.toLocaleString()})`,
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  }

  // 2. Acceleration Band
  const accelBand = String(metrics.accelerationBand || "unknown");
  const accelPct = metrics.accelerationPct != null ? Number(metrics.accelerationPct).toFixed(1) : null;
  if (accelBand === "strong") {
    items.acceleration = {
      valueDisplay: accelPct ? `${accelPct}%` : "Strong",
      color: "green",
      badge: "Strong Growth (>20%)",
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  } else if (accelBand === "clear") {
    items.acceleration = {
      valueDisplay: accelPct ? `${accelPct}%` : "Clear",
      color: "green",
      badge: "Clear Growth (15–20%)",
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  } else if (accelBand === "starting") {
    items.acceleration = {
      valueDisplay: accelPct ? `${accelPct}%` : "Starting",
      color: "yellow",
      badge: "Starting (8–15%)",
      isRed: false,
      isYellow: true,
      isGreen: false,
      reason: `Growth is in early starting phase (${accelPct ?? "8–15"}%), not yet a clear velocity breakout.`,
    };
  } else if (accelBand === "not_accelerating") {
    const isSteady = (metrics.stableDays ?? 0) >= profile.stableDaysRequired && (metrics.strongDays ?? 0) >= profile.strongDaysMinimum;
    items.acceleration = {
      valueDisplay: accelPct ? `${accelPct}%` : "<8%",
      color: isSteady ? "yellow" : "red",
      badge: isSteady ? "Steady (<8%)" : "Declining (<8%)",
      isRed: !isSteady,
      isYellow: isSteady,
      isGreen: false,
      reason: isSteady
        ? `Sales velocity is flat and steady (~${accelPct ?? "7.8"}% flat 7d/90d ratio) with consistent daily volume. Evergreen performer.`
        : `Sales velocity is declining or collapsing (${accelPct ?? "<8"}% 7d/90d ratio).`,
    };
  } else {
    items.acceleration = {
      valueDisplay: "New (<30d)",
      color: "slate",
      badge: "New History",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // 3. Pattern Stability
  const stableDays = Number(metrics.stableDays ?? 0);
  if (stableDays >= profile.stableDaysRequired) {
    items.stability = {
      valueDisplay: `${stableDays}/7 Days`,
      color: "green",
      badge: `Consistent (${stableDays} of 7)`,
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  } else {
    items.stability = {
      valueDisplay: `${stableDays}/7 Days`,
      color: "red",
      badge: `Erratic (<${profile.stableDaysRequired}/7)`,
      isRed: true,
      isYellow: false,
      isGreen: false,
      reason: `Daily sales are erratic (only ${stableDays} of 7 days stable, requires ${profile.stableDaysRequired}+). Likely a flash spike or one-day coupon.`,
    };
  }

  // 4. Video Share
  if (videoSharePct != null) {
    if (videoSharePct >= profile.videoSharePreferredPct) {
      items.videoShare = {
        valueDisplay: `${videoSharePct}%`,
        color: "green",
        badge: `High Video Share (≥${profile.videoSharePreferredPct}%)`,
        isRed: false,
        isYellow: false,
        isGreen: true,
      };
    } else if (videoSharePct >= profile.videoShareMinimumPct) {
      items.videoShare = {
        valueDisplay: `${videoSharePct}%`,
        color: "yellow",
        badge: `Acceptable (${profile.videoShareMinimumPct}–${profile.videoSharePreferredPct}%)`,
        isRed: false,
        isYellow: true,
        isGreen: false,
      };
    } else {
      items.videoShare = {
        valueDisplay: `${videoSharePct}%`,
        color: "red",
        badge: `Low Video Share (<${profile.videoShareMinimumPct}%)`,
        isRed: true,
        isYellow: false,
        isGreen: false,
        reason: `Only ${videoSharePct}% of sales come from videos (<${profile.videoShareMinimumPct}% min). Mostly driven by live streams or showcase search.`,
      };
    }
  } else {
    items.videoShare = {
      valueDisplay: "—",
      color: "slate",
      badge: "Not Reported",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // 5. Top-Video Concentration
  const concBand = String(metrics.concentrationBand || "unknown");
  const concPct = metrics.topVideoConcentrationPct != null ? Number(metrics.topVideoConcentrationPct).toFixed(1) : null;
  if (concBand === "spread_out") {
    items.concentration = {
      valueDisplay: concPct ? `${concPct}%` : "Spread",
      color: "green",
      badge: `Healthy Spread (<${profile.topVideoSpreadMaxPct}%)`,
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  } else if (concBand === "watch") {
    items.concentration = {
      valueDisplay: concPct ? `${concPct}%` : "Moderate",
      color: "yellow",
      badge: `Moderate (${profile.topVideoSpreadMaxPct}–${profile.topVideoWatchMaxPct}%)`,
      isRed: false,
      isYellow: true,
      isGreen: false,
      reason: `Moderate concentration (${concPct}% of video GMV on 1 video). Inspect winning video angle.`,
    };
  } else if (concBand === "high_risk_single_video") {
    items.concentration = {
      valueDisplay: concPct ? `${concPct}%` : ">70%",
      color: "red",
      badge: `High Risk (>70%)`,
      isRed: true,
      isYellow: false,
      isGreen: false,
      reason: `Single-creator dependency: ${concPct}% of video GMV comes from one viral video. High risk of copycat failure.`,
    };
  } else {
    items.concentration = {
      valueDisplay: "—",
      color: "slate",
      badge: "No Video Data",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // 6. Creator Saturation
  if (activeCreators != null) {
    if (activeCreators > profile.highCompetitionCreatorThreshold) {
      const isHardAvoid = Boolean(profile.enforceCreatorSaturationAsHardAvoid);
      items.creators = {
        valueDisplay: activeCreators.toLocaleString(),
        color: isHardAvoid ? "red" : "yellow",
        badge: isHardAvoid ? `Saturated (>${profile.highCompetitionCreatorThreshold})` : `High Competition (>${profile.highCompetitionCreatorThreshold})`,
        isRed: isHardAvoid,
        isYellow: !isHardAvoid,
        isGreen: false,
        reason: isHardAvoid
          ? `High creator competition (${activeCreators.toLocaleString()} creators > ${profile.highCompetitionCreatorThreshold} threshold under Coach B). Hard avoid.`
          : `High creator competition (${activeCreators.toLocaleString()} creators > ${profile.highCompetitionCreatorThreshold} threshold). Under Coach A, verify low top-video concentration rather than auto-rejecting.`,
      };
    } else if (activeCreators > 150) {
      items.creators = {
        valueDisplay: activeCreators.toLocaleString(),
        color: "yellow",
        badge: `Moderate (150–${profile.highCompetitionCreatorThreshold})`,
        isRed: false,
        isYellow: true,
        isGreen: false,
      };
    } else {
      items.creators = {
        valueDisplay: activeCreators.toLocaleString(),
        color: "green",
        badge: `Low Competition (<150)`,
        isRed: false,
        isYellow: false,
        isGreen: true,
      };
    }
  } else {
    items.creators = {
      valueDisplay: "—",
      color: "slate",
      badge: "Not Reported",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // 7. 1M+ View Videos (Viral Ad-Spend Backing)
  if (viralVideos != null && viralVideos > 0) {
    items.viralVideos = {
      valueDisplay: `${viralVideos}`,
      color: "green",
      badge: `Verified Ad Backing (${viralVideos} >1M)`,
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  } else {
    items.viralVideos = {
      valueDisplay: "0",
      color: "slate",
      badge: "No 1M+ Videos",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // 8. Commission Rate
  if (commRate >= profile.commissionAfterAdsMinimumPct) {
    items.commission = {
      valueDisplay: `${commRate}%`,
      color: "green",
      badge: `Viable Margin (≥${profile.commissionAfterAdsMinimumPct}%)`,
      isRed: false,
      isYellow: false,
      isGreen: true,
    };
  } else if (commRate > 0) {
    items.commission = {
      valueDisplay: `${commRate}%`,
      color: "red",
      badge: `Low Margin (<${profile.commissionAfterAdsMinimumPct}%)`,
      isRed: true,
      isYellow: false,
      isGreen: false,
      reason: `Commission rate (${commRate}%) is below minimum threshold of ${profile.commissionAfterAdsMinimumPct}%.`,
    };
  } else {
    items.commission = {
      valueDisplay: "—",
      color: "slate",
      badge: "Not Set",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // 9. Rating
  if (rating != null) {
    if (rating >= profile.ratingMinimum) {
      items.rating = {
        valueDisplay: `${rating}★`,
        color: "green",
        badge: `Good Rating (≥${profile.ratingMinimum}★)`,
        isRed: false,
        isYellow: false,
        isGreen: true,
      };
    } else {
      items.rating = {
        valueDisplay: `${rating}★`,
        color: "red",
        badge: `Poor Rating (<${profile.ratingMinimum}★)`,
        isRed: true,
        isYellow: false,
        isGreen: false,
        reason: `Product rating (${rating}★) is below ${profile.ratingMinimum}★ minimum. Higher return/complaint risk.`,
      };
    }
  } else {
    items.rating = {
      valueDisplay: reviewCount > 0 ? `${reviewCount.toLocaleString()} revs` : "—",
      color: "slate",
      badge: reviewCount > 0 ? `${reviewCount.toLocaleString()} Reviews` : "No Rating",
      isRed: false,
      isYellow: false,
      isGreen: false,
    };
  }

  // Build Overall Diagnostic
  const redFlags: string[] = [];
  const warningFlags: string[] = [];
  const greenSignals: string[] = [];

  Object.values(items).forEach((item) => {
    if (item.isRed && item.reason) redFlags.push(item.reason);
    else if (item.isYellow && item.reason) warningFlags.push(item.reason);
  });

  if (items.totalSales?.isGreen) greenSignals.push(`Total volume (${items.totalSales.valueDisplay}) is within target screening range`);
  if (items.acceleration?.isGreen) greenSignals.push(`Healthy velocity acceleration (${items.acceleration.valueDisplay})`);
  if (items.stability?.isGreen) greenSignals.push(`Consistent daily buying pattern (${items.stability.valueDisplay})`);
  if (items.videoShare?.isGreen) greenSignals.push(`Revenue is heavily short-form video led (${items.videoShare.valueDisplay})`);
  if (items.concentration?.isGreen) greenSignals.push(`Sales are distributed across multiple creators (${items.concentration.valueDisplay} top-video share)`);
  if (items.viralVideos?.isGreen) greenSignals.push(`Proven viral ad-spend backing (${items.viralVideos.badge})`);
  if (items.creators?.isGreen) greenSignals.push(`Low competitor density (${items.creators.valueDisplay} active creators)`);

  let statusType: OverallDiagnostic["statusType"] = (candidate.reviewStatus as any) || "candidate";
  let title = "Candidate in Screening";
  let color: OverallDiagnostic["color"] = "cyan";
  let headlineReason = "Meets initial criteria; review operational fit and clinical evidence.";

  if (statusType === "avoid" || redFlags.length > 0) {
    statusType = "avoid";
    title = "RECOMMENDED ACTION: AVOID";
    color = "rose";
    headlineReason = redFlags[0] || "Failed critical screening thresholds.";
  } else if (statusType === "human_review" || warningFlags.length > 0) {
    statusType = "human_review";
    title = "RECOMMENDED ACTION: HUMAN REVIEW NEEDED";
    color = "amber";
    headlineReason = warningFlags[0] || "Requires manual inspection of top winning videos.";
  } else if (statusType === "watchlist" || (greenSignals.length >= 4 && redFlags.length === 0)) {
    statusType = "watchlist";
    title = "RECOMMENDED ACTION: WATCHLIST / TOP CANDIDATE";
    color = "emerald";
    headlineReason = `Strong momentum: clears ${greenSignals.length} primary velocity signals without major red flags.`;
  }

  return {
    items,
    overall: {
      statusType,
      title,
      color,
      headlineReason,
      redFlags,
      warningFlags,
      greenSignals,
    },
  };
}
