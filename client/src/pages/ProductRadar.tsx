import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, BookMarked, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Eye, FileSpreadsheet, Flame, Globe, HelpCircle, Loader2, LockKeyhole, RefreshCw, ShieldCheck, SlidersHorizontal, Sparkles, Upload, Users, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { buildKalodataProductDetailUrl, DEFAULT_RADAR_PROFILE, type RadarProfileConfig } from "../../../server/radar";
import { buildBrandOpportunityDiagnostics, buildMegaSellerOpportunityDiagnostic, diagnoseMetrics, type MetricColor } from "@/lib/radarDiagnostics";

const statusLabels: Record<string, string> = { candidate: "Candidate", watchlist: "Watchlist", human_review: "Human review", avoid: "Avoid", approved_for_campaign_planning: "Approved for campaign planning" };
const metric = (value: unknown) => typeof value === "number" ? Number(value.toFixed(2)) : "—";

const CATEGORY_SUGGESTIONS: Record<string, Array<{ label: string; keyword: string }>> = {
  // Beauty & Personal Care (601450)
  "601450": [
    { label: "Serums", keyword: "Serum" },
    { label: "Eye Patches / Cream", keyword: "Eye Cream" },
    { label: "Lip Tint / Oil", keyword: "Lip Oil" },
    { label: "Moisturizer / Cream", keyword: "Moisturizer" },
    { label: "Sunscreen / SPF", keyword: "Sunscreen" },
    { label: "Toner Pads", keyword: "Toner" },
    { label: "Cleanser", keyword: "Cleanser" },
    { label: "Balm / Stick", keyword: "Balm" },
    { label: "Collagen", keyword: "Collagen" },
    { label: "Peptides", keyword: "Peptide" },
  ],
  // Dietary Supplements (700646)
  "700646": [
    { label: "Magnesium", keyword: "Magnesium" },
    { label: "Cortisol / Adrenal", keyword: "Cortisol" },
    { label: "Sleep", keyword: "Sleep" },
    { label: "Bloating / Gut", keyword: "Bloating" },
    { label: "Protein Powder", keyword: "Protein" },
    { label: "Creatine", keyword: "Creatine" },
    { label: "Berberine", keyword: "Berberine" },
    { label: "Ashwagandha", keyword: "Ashwagandha" },
    { label: "Electrolytes", keyword: "Electrolytes" },
    { label: "NAD+ / Longevity", keyword: "NAD" },
  ],
  // Health & Healthcare (600001)
  "600001": [
    { label: "Oral Care", keyword: "Oral Care" },
    { label: "Teeth Whitening", keyword: "Whitening" },
    { label: "Pain Relief", keyword: "Pain Relief" },
    { label: "Posture / Support", keyword: "Posture" },
    { label: "Hair Density", keyword: "Hair Density" },
    { label: "Sleep Aid", keyword: "Sleep Aid" },
  ],
  // All Categories ("")
  "": [
    { label: "Skin Care", keyword: "Skin Care" },
    { label: "Supplements", keyword: "Supplements" },
    { label: "Sleep", keyword: "Sleep" },
    { label: "Energy", keyword: "Energy" },
    { label: "Hair Care", keyword: "Hair" },
    { label: "Wellness", keyword: "Wellness" },
  ],
};

export default function ProductRadar() {
  const utils = trpc.useUtils();
  const { data: profileData } = trpc.radar.getProfile.useQuery();
  const { data: kalodataStatus } = trpc.radar.getKalodataStatus.useQuery();
  const { data: presetProfiles } = trpc.radar.getPresets.useQuery();
  const { data: savedProfiles = [] } = trpc.radar.listProfiles.useQuery();
  const { data: candidates = [], isLoading } = trpc.radar.listCandidates.useQuery();
  const { data: productIntelRadar = [] } = trpc.radar.listProductIntelForRadar.useQuery();
  const [profile, setProfile] = useState<RadarProfileConfig>(DEFAULT_RADAR_PROFILE);
  const [profileName, setProfileName] = useState("Coach A Range (2,000–40,000)");
  const [selectedProfileKey, setSelectedProfileKey] = useState("coach_a");
  const [provider, setProvider] = useState("FastMoss CSV");
  const [activeInputTab, setActiveInputTab] = useState<"kalodata" | "single_audit" | "csv">("kalodata");
  const [searchCategory, setSearchCategory] = useState("700646");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [singleAuditQuery, setSingleAuditQuery] = useState("");
  const [showKalodataGuide, setShowKalodataGuide] = useState(true);
  const [searchRegion, setSearchRegion] = useState("US");
  const [searchLimit, setSearchLimit] = useState(5);
  const [sortStrategy, setSortStrategy] = useState<"growth_rate" | "video_revenue" | "sales_volume" | "revenue">("sales_volume");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [refreshingCandidate, setRefreshingCandidate] = useState(false);
  const [showRawSnapshot, setShowRawSnapshot] = useState(false);
  const [queueFilter, setQueueFilter] = useState<"all" | "approved" | "ready" | "handed_off" | "product_intel">("all");

  const visibleCandidates = useMemo(() => {
    if (queueFilter === "approved") return candidates.filter((candidate) => candidate.reviewStatus === "approved_for_campaign_planning");
    if (queueFilter === "ready") return candidates.filter((candidate) => candidate.handoffStatus === "ready_for_campaign_planning");
    if (queueFilter === "handed_off") return candidates.filter((candidate) => candidate.handoffStatus === "handed_off_to_campaign_planning");
    if (queueFilter === "product_intel") return candidates.filter((candidate) => candidate.provider === "Kalodata (Product Intel)");
    return candidates;
  }, [candidates, queueFilter]);

  const saveProfile = trpc.radar.saveProfile.useMutation({ onSuccess: () => setNotice("Screening profile saved.") });
  const recalculateAll = trpc.radar.recalculateCandidatesWithProfile.useMutation({
    onSuccess: (res) => {
      setNotice(`Re-evaluated ${res.count} candidate(s) against "${profileName}".`);
      void utils.radar.listCandidates.invalidate();
    },
  });
  const clearQueue = trpc.radar.clearQueue.useMutation({
    onSuccess: (res) => {
      setNotice(`Cleared ${res.archivedCount} unreviewed candidate(s) from the active queue. You now have a fresh slate.`);
      void utils.radar.listCandidates.invalidate();
    },
    onError: (err) => setNotice(`Failed to clear queue: ${err.message}`),
  });
  const reconcileQueue = trpc.radar.reconcileQueue.useMutation({
    onSuccess: (res) => {
      if (res.action === "preview") {
        setNotice(res.outOfProfile.length ? `${res.outOfProfile.length} active candidate(s) fall outside "${profileName}"; ${res.protectedCount} protected candidate(s) were not eligible for archive.` : `All active candidates fit "${profileName}".`);
      } else {
        setNotice(`Archived ${res.archivedCount} out-of-profile candidate(s). ${res.protectedCount} protected candidate(s) were kept.`);
        void utils.radar.listCandidates.invalidate();
      }
    },
    onError: (error) => setNotice(`Queue cleanup failed: ${error.message}`),
  });
  const importCsv = trpc.radar.importCsv.useMutation({ onSuccess: (result) => { setNotice(`Imported ${result.validRows} candidate rows with ${result.errors.length} validation errors.`); void utils.radar.listCandidates.invalidate(); setUploading(false); }, onError: (error) => { setNotice(error.message); setUploading(false); } });
  const reAuditProductIntel = trpc.radar.reAuditProductIntel.useMutation({
    onSuccess: (result) => {
      setNotice(`Re-audited ${result.processed.length} Product Intel products. ${result.skipped.length} docs had no exact Shop product ID; estimated API calls: ${result.estimatedApiCalls.minimum}–${result.estimatedApiCalls.maximum}.`);
      void utils.radar.listCandidates.invalidate();
    },
    onError: (error) => setNotice(`Product Intel re-audit error: ${error.message}`),
  });
  const searchKalodata = trpc.radar.searchKalodata.useMutation({
    onSuccess: (res) => {
      setNotice(res.message);
      void utils.radar.listCandidates.invalidate();
    },
    onError: (err) => {
      setNotice(`Kalodata error: ${err.message}`);
    },
  });
  const refreshKalodata = trpc.radar.refreshCandidateFromKalodata.useMutation({
    onSuccess: (res) => {
      setNotice(`Candidate refreshed from Kalodata live API at ${new Date(res.fetchedAt).toLocaleTimeString()}.`);
      void utils.radar.listCandidates.invalidate();
      setRefreshingCandidate(false);
    },
    onError: (err) => {
      setNotice(`Kalodata refresh error: ${err.message}`);
      setRefreshingCandidate(false);
    },
  });

  const vetSingleProduct = trpc.radar.vetSingleProduct.useMutation({
    onSuccess: (res) => {
      const matchPrefix = res.matchedBy === "exact_id"
        ? `Audited exact product ID (${res.productId})`
        : res.matchedBy === "short_link"
          ? `Resolved TikTok short link to exact product ID (${res.productId})`
          : `Audited top Kalodata match`;
      setNotice(`${matchPrefix}: "${res.productName}" — Recommended Status: ${res.status.toUpperCase()}. Diagnostic card loaded below.`);
      setSelectedId(res.candidateId);
      void utils.radar.listCandidates.invalidate();
      setSingleAuditQuery("");
    },
    onError: (err) => {
      setNotice(`Product audit error: ${err.message}`);
    },
  });
  const updateReview = trpc.radar.updateReview.useMutation({ onSuccess: () => { setNotice("Review saved. The handoff remains blocked until the evidence gate is approved."); void utils.radar.listCandidates.invalidate(); } });
  const handoff = trpc.radar.handoffToCampaign.useMutation({ onSuccess: () => { setNotice("Campaign-planning handoff completed after the evidence gate."); void utils.radar.listCandidates.invalidate(); }, onError: (error) => setNotice(error.message) });
  const activeProfile = profileData?.config ?? profile;
  const selected = useMemo(() => visibleCandidates.find((candidate) => candidate.id === selectedId) ?? visibleCandidates[0], [visibleCandidates, selectedId]);

  const handleUpload = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    const isExcel = Boolean(file.name.match(/\.xlsx?$/i));
    if (isExcel) {
      reader.onload = () => {
        importCsv.mutate({
          provider: provider || "Kalodata Export",
          fileName: file.name,
          csv: String(reader.result ?? ""),
          profile: activeProfile,
        });
      };
      reader.onerror = () => {
        setNotice("Could not read the Excel file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        importCsv.mutate({
          provider: provider || "Kalodata Export",
          fileName: file.name,
          csv: String(reader.result ?? ""),
          profile: activeProfile,
        });
      };
      reader.onerror = () => {
        setNotice("Could not read the CSV file.");
        setUploading(false);
      };
      reader.readAsText(file);
    }
  };
  const setNumber = (key: keyof RadarProfileConfig, value: string) => setProfile((current) => ({ ...current, [key]: Number(value) }));

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-sans">
      {/* Top Nav matching RxContent standard */}
      <header className="border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 bg-[#0a0f1e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-mono">Product Radar</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:block">Pharmacist Product Selection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            <Link href="/">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                <span className="hidden sm:inline">Rx</span>Content
              </button>
            </Link>
            <Link href="/bof">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span className="hidden sm:inline">Shop</span>Script
              </button>
            </Link>
            <Link href="/vet">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                <span className="hidden sm:inline">Vet</span>Product
              </button>
            </Link>
            <Link href="/videolab">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                <span className="hidden sm:inline">Video</span>Lab
              </button>
            </Link>
            <Link href="/editor">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                <span className="hidden sm:inline">Last-Take </span>Editor
              </button>
            </Link>
            <Link href="/command">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-300 inline-block" />
                <span className="hidden sm:inline">Command</span>Center
              </button>
            </Link>
            <Link href="/autoreports">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                <span className="hidden sm:inline">Auto</span>Reports
              </button>
            </Link>
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span className="hidden sm:inline">Product </span>Radar
            </button>
          </div>
          <Link href="/saved">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1.5 text-xs">
              <BookMarked className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved Scripts</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-10">
        <div className="border-b border-white/10 pb-6">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
            <FileSpreadsheet className="h-4 w-4" /> Product Radar
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Find movement before saturation.</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            CSV-first product screening for the existing pharmacist TikTok workflow. Deterministic sales metrics stay visible and separate from AI-assisted interpretation.
          </p>
        </div>

      {notice && <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{notice}</div>}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <Card className="border-white/10 bg-white/[0.04] text-slate-100"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><SlidersHorizontal className="h-4 w-4 text-cyan-300" /> Screening profile</CardTitle></CardHeader><CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-slate-300">Profile Presets & Saved</Label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-white/10 bg-black/30 px-2 text-xs text-slate-200"
                value={selectedProfileKey}
                onChange={(e) => {
                  const key = e.target.value;
                  setSelectedProfileKey(key);
                  if (presetProfiles && presetProfiles[key]) {
                    setProfile(presetProfiles[key].config);
                    setProfileName(presetProfiles[key].name);
                  } else {
                    const custom = savedProfiles.find((p) => String(p.id) === key);
                    if (custom) {
                      setProfile(custom.config);
                      setProfileName(custom.name);
                    }
                  }
                }}
              >
                <optgroup label="Standard Presets">
                  <option value="coach_a">Coach A Range (2,000–40,000 total sales)</option>
                  <option value="coach_b">Coach B Range (1,000–9,000 total sales)</option>
                </optgroup>
                {savedProfiles.length > 0 && (
                  <optgroup label="Your Saved Profiles">
                    {savedProfiles.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div><Label>Profile name</Label><Input className="mt-1 border-white/10 bg-black/20" value={profileName} onChange={(e) => setProfileName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">{([["minTotalSales", "Min total sales"], ["maxTotalSales", "Max total sales"], ["matureAgeDays", "Mature age days"], ["veryNewAgeDays", "Very new age days"], ["accelerationStartingPct", "Starting %"], ["accelerationClearPct", "Clear %"], ["accelerationStrongPct", "Strong %"], ["stableDaysRequired", "Stable days"], ["stableVariancePct", "Stable variance %"], ["strongDayUnits", "Strong day units"], ["strongDaysMinimum", "Strong days min"], ["latestDayAccelerationMultiplier", "Latest multiplier"], ["videoShareMinimumPct", "Video share min %"], ["topVideoSpreadMaxPct", "Spread max %"], ["topVideoWatchMaxPct", "Watch max %"], ["highCompetitionCreatorThreshold", "Max competitors"], ["videosOver1MViewsThreshold", "Min 1M+ videos"], ["ratingMinimum", "Rating min"], ["commissionAfterAdsMinimumPct", "Commission min %"]] as const).map(([key, label]) => <div key={key}><Label className="text-xs text-slate-400">{label}</Label><Input type="number" step="any" className="mt-1 border-white/10 bg-black/20" value={profile[key]} onChange={(e) => setNumber(key, e.target.value)} /></div>)}</div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white" onClick={() => saveProfile.mutate({ name: profileName, config: profile })}>
                  Save profile
                </Button>
                <Button variant="outline" className="border-white/10 bg-transparent" title="Reset to Coach A default" onClick={() => setProfile(DEFAULT_RADAR_PROFILE)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs"
                disabled={recalculateAll.isPending}
                onClick={() => recalculateAll.mutate({ profile })}
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${recalculateAll.isPending ? "animate-spin" : ""}`} />
                {recalculateAll.isPending ? "Re-scoring..." : "Apply & Rescore All Candidates"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 text-xs"
                  disabled={reconcileQueue.isPending}
                  onClick={() => reconcileQueue.mutate({ profile, action: "preview" })}
                >
                  Preview out-of-range
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 text-xs"
                  disabled={reconcileQueue.isPending}
                  onClick={() => {
                    if (window.confirm(`Archive active candidates outside ${profile.minTotalSales.toLocaleString()}–${profile.maxTotalSales.toLocaleString()}? Raw data will be retained and protected/reviewed candidates will be kept.`)) {
                      reconcileQueue.mutate({ profile, action: "archive" });
                    }
                  }}
                >
                  Archive out-of-range
                </Button>
              </div>
              <p className="text-[10px] leading-4 text-slate-500">Cleanup hides only unprotected candidates outside the selected total-sales range. Raw snapshots remain retained for audit.</p>
            </div>
          </CardContent></Card>

          {/* Data Intake Tabs: Kalodata Live API vs CSV */}
          <Card className="border-white/10 bg-white/[0.04] text-slate-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-cyan-300" /> Data Source
                </CardTitle>
                <div className="flex rounded-lg border border-white/10 bg-black/30 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveInputTab("kalodata")}
                    className={`px-2 py-1 rounded-md transition ${activeInputTab === "kalodata" ? "bg-cyan-500/20 text-cyan-300 font-medium" : "text-slate-400 hover:text-white"}`}
                  >
                    Category Scout
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInputTab("single_audit")}
                    className={`px-2 py-1 rounded-md transition ${activeInputTab === "single_audit" ? "bg-amber-500/20 text-amber-300 font-medium" : "text-slate-400 hover:text-white"}`}
                  >
                    Audit Inbound Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInputTab("csv")}
                    className={`px-2 py-1 rounded-md transition ${activeInputTab === "csv" ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-slate-400 hover:text-white"}`}
                  >
                    CSV
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeInputTab === "kalodata" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">API Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${kalodataStatus?.hasKey ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${kalodataStatus?.hasKey ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {kalodataStatus?.hasKey ? `Connected (${kalodataStatus.maskedKey})` : "Key Missing"}
                    </span>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-300">Category Discovery (Trending)</Label>
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-white/10 bg-black/20 px-2 text-xs text-slate-200"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                    >
                      <option value="700646">Dietary Supplements & Nutrition (Supplements, Minerals, Vitamins)</option>
                      <option value="700645">Health & Healthcare (Wellness, OTC, Medical Devices)</option>
                      <option value="601450">Beauty & Personal Care (Skincare, Actives, Topical Serums)</option>
                      <option value="all">All TikTok Shop Categories (Platform-Wide Trending)</option>
                    </select>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Scouts trending products by category ranking without needing any search keyword.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-300">Symptom, Mechanism, or Keyword (Optional)</Label>
                      {searchKeyword && (
                        <button
                          type="button"
                          onClick={() => setSearchKeyword("")}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300"
                        >
                          Clear (All in Category)
                        </button>
                      )}
                    </div>
                    <Input
                      placeholder="e.g. Magnesium, Cortisol, Liposomal, Eye Cream, Peptides"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="mt-1 h-9 bg-black/20 text-xs text-slate-200"
                    />
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Target High-Yield Sub-Niches:</span>
                        {searchKeyword && (
                          <span className="text-[10px] text-cyan-300 font-mono">
                            active: "{searchKeyword}"
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(CATEGORY_SUGGESTIONS[searchCategory] || CATEGORY_SUGGESTIONS[""]).map((chip) => {
                          const isSelected = searchKeyword.toLowerCase() === chip.keyword.toLowerCase();
                          return (
                            <button
                              key={chip.keyword}
                              type="button"
                              onClick={() => setSearchKeyword(isSelected ? "" : chip.keyword)}
                              className={`px-2 py-0.5 rounded text-[11px] transition border ${
                                isSelected
                                  ? "bg-cyan-500/25 border-cyan-400/50 text-cyan-200 font-medium"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                              }`}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-slate-300">Region</Label>
                      <select
                        className="mt-1 h-8 w-full rounded-md border border-white/10 bg-black/20 px-2 text-xs text-slate-200"
                        value={searchRegion}
                        onChange={(e) => setSearchRegion(e.target.value)}
                      >
                        <option value="US">US TikTok Shop</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-300">Discovery Strategy</Label>
                      <select
                        className="mt-1 h-8 w-full rounded-md border border-white/10 bg-black/20 px-2 text-xs text-slate-200"
                        value={sortStrategy}
                        onChange={(e) => setSortStrategy(e.target.value as any)}
                      >
                        <option value="sales_volume">Sales Volume (Units)</option>
                        <option value="video_revenue">Video-Driven Movers</option>
                        <option value="growth_rate">Breakout Velocity</option>
                        <option value="revenue">Gross Revenue (GMV)</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-300">Max Candidates</Label>
                      <select
                        className="mt-1 h-8 w-full rounded-md border border-white/10 bg-black/20 px-2 text-xs text-slate-200"
                        value={searchLimit}
                        onChange={(e) => setSearchLimit(Number(e.target.value))}
                      >
                        <option value={3}>Top 3</option>
                        <option value={5}>Top 5</option>
                        <option value={10}>Top 10</option>
                        <option value={15}>Top 15</option>
                        <option value={20}>Top 20</option>
                        <option value={25}>Top 25</option>
                      </select>
                    </div>
                  </div>
                  <div className="rounded-md border border-white/5 bg-black/20 p-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Option A Discovery Filter:</span> Querying Kalodata by <strong>{sortStrategy === "sales_volume" ? "Sales Volume (Units)" : sortStrategy === "video_revenue" ? "Short-Form Video Revenue" : sortStrategy === "growth_rate" ? "Breakout Growth Rate" : "Gross Revenue"}</strong>. Candidate pool will be strictly verified against your <strong>{profileName}</strong> volume range using un-extrapolated /product/detail data.
                  </div>
                  <Button
                    type="button"
                    disabled={searchKalodata.isPending || !kalodataStatus?.hasKey}
                    onClick={() => {
                      searchKalodata.mutate({
                        keyword: searchKeyword ? searchKeyword.trim() : undefined,
                        categoryId: searchCategory === "all" ? undefined : searchCategory,
                        region: searchRegion,
                        maxCandidates: searchLimit,
                        sortStrategy,
                        profile: activeProfile,
                        minTotalSales: activeProfile.minTotalSales,
                        maxTotalSales: activeProfile.maxTotalSales,
                      });
                    }}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs h-9"
                  >
                    {searchKalodata.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Scanning Kalodata & Vetting Candidates...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-3.5 w-3.5" />
                        Pull Live from Kalodata
                      </>
                    )}
                  </Button>
                </div>
              ) : activeInputTab === "single_audit" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">API Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${kalodataStatus?.hasKey ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${kalodataStatus?.hasKey ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {kalodataStatus?.hasKey ? `Connected (${kalodataStatus.maskedKey})` : "Key Missing"}
                    </span>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      Inbound Brand Offer Vetting
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Offered a brand deal or product to promote? Paste their product title, TikTok Shop URL, or 19-digit product ID below to immediately generate their green/yellow/red diagnostic card and see if it passes criteria before you respond.
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-300">Product Name, Brand, TikTok Shop Link, or Product ID</Label>
                    <Input
                      placeholder="e.g. BodyHealth Perfect Amino, Saviland, or 1729403645039514131"
                      value={singleAuditQuery}
                      onChange={(e) => setSingleAuditQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && singleAuditQuery.trim()) {
                          vetSingleProduct.mutate({ query: singleAuditQuery.trim(), profile: activeProfile });
                        }
                      }}
                      className="mt-1 h-9 bg-black/20 text-xs text-slate-200"
                    />
                  </div>
                  <div className="rounded-md border border-white/5 bg-black/20 p-2.5 text-[11px] text-slate-400 space-y-1">
                    <div className="font-medium text-slate-300">Supported Inbound Inputs:</div>
                    <div>• <strong>Exact Product Name:</strong> e.g. <code className="text-cyan-300">Yummy Skin Blurring Balm Powder</code></div>
                    <div>• <strong>Brand + Mechanism:</strong> e.g. <code className="text-cyan-300">BodyHealth Perfect Amino</code></div>
                    <div>• <strong>TikTok Shop URL or /t/ short link:</strong> e.g. <code className="text-cyan-300">https://www.tiktok.com/view/product/1729403645039514131</code> or <code className="text-cyan-300">https://www.tiktok.com/t/...</code></div>
                    <div>• <strong>Kalodata / TikTok ID:</strong> e.g. <code className="text-cyan-300">1729403645039514131</code></div>
                  </div>
                  <Button
                    type="button"
                    disabled={vetSingleProduct.isPending || !singleAuditQuery.trim() || !kalodataStatus?.hasKey}
                    onClick={() => {
                      vetSingleProduct.mutate({ query: singleAuditQuery.trim(), profile: activeProfile });
                    }}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-xs h-9 shadow-md shadow-amber-950/40"
                  >
                    {vetSingleProduct.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Auditing Inbound Offer against {profileName}...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-3.5 w-3.5 text-amber-200" />
                        Audit Inbound Offer (Generate Diagnostic Card)
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Collapsible Kalodata Web Export Filter Guide */}
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3">
                    <button
                      type="button"
                      onClick={() => setShowKalodataGuide(!showKalodataGuide)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                        <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
                        Kalodata Web Export Filter Guide
                      </span>
                      <span className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
                        {showKalodataGuide ? (
                          <>Hide Filters <ChevronUp className="h-3.5 w-3.5" /></>
                        ) : (
                          <>View Filters <ChevronDown className="h-3.5 w-3.5" /></>
                        )}
                      </span>
                    </button>

                    {showKalodataGuide && (
                      <div className="mt-2.5 pt-2.5 border-t border-cyan-500/20 space-y-2 text-[11px] text-slate-300">
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          Set these filters on <strong>Kalodata.com</strong> (Product Search) before clicking <strong>Export</strong>:
                        </p>
                        <div className="space-y-1 bg-black/30 rounded-md p-2 border border-white/5 font-mono text-[11px]">
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400 font-sans">Dates:</span>
                            <span className="text-cyan-300">Last 30 Days (or 7 Days)</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400 font-sans">Category:</span>
                            <span className="text-cyan-300">Supplements / Beauty</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400 font-sans">Item Sold:</span>
                            <span className="text-amber-300 font-bold">2,000 ~ 40,000 (Coach A)</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400 font-sans">Is Affiliate:</span>
                            <span className="text-emerald-300 font-bold">Yes</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400 font-sans">Commission:</span>
                            <span className="text-cyan-300">10% ~ 100%</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400 font-sans">Rating:</span>
                            <span className="text-cyan-300">4 ~ 5 Stars</span>
                          </div>
                          <div className="flex justify-between py-0.5">
                            <span className="text-slate-400 font-sans">Creator Count:</span>
                            <span className="text-slate-300">Optional: max 300</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-amber-300/90 bg-amber-950/30 p-1.5 rounded border border-amber-500/20 leading-relaxed">
                          <strong>Important:</strong> On Kalodata's sidebar, click <strong>Item Sold</strong> (units), NOT <strong>Revenue($)</strong>.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-violet-500/30 bg-violet-950/20 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-violet-200">Re-audit Product Intelligence products</p>
                        <p className="mt-1 text-[11px] leading-4 text-slate-400">Runs exact-ID Kalodata audits for the Product Intel documents that contain a TikTok Shop product ID, then places the results in this Radar queue. Reviewed or handed-off candidates keep their existing review status.</p>
                      </div>
                      <BookMarked className="h-4 w-4 shrink-0 text-violet-300" />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500">{productIntelRadar.filter((item) => item.productId).length} exact IDs / {productIntelRadar.length} intel docs · estimated {productIntelRadar.filter((item) => item.productId).length}–{productIntelRadar.filter((item) => item.productId).length * 4} API calls</span>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!kalodataStatus?.hasKey || reAuditProductIntel.isPending || productIntelRadar.filter((item) => item.productId).length === 0}
                        onClick={() => {
                          if (window.confirm(`Re-audit ${productIntelRadar.filter((item) => item.productId).length} Product Intel products with the active ${profileName} profile? This may use approximately ${productIntelRadar.filter((item) => item.productId).length}–${productIntelRadar.filter((item) => item.productId).length * 4} Kalodata API calls.`)) {
                            reAuditProductIntel.mutate({ profile: activeProfile, region: searchRegion });
                          }
                        }}
                        className="bg-violet-600 text-white hover:bg-violet-500 text-xs"
                      >
                        {reAuditProductIntel.isPending ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Re-auditing…</> : <><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-audit in Radar</>}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-400">Provider Label</Label>
                    <Input className="mt-1 border-white/10 bg-black/20 h-8 text-xs" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. Kalodata Export" />
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-300/40 bg-emerald-300/5 px-4 py-4 text-xs text-emerald-100 hover:bg-emerald-300/10 transition">
                    <Upload className="h-4 w-4 text-emerald-400" /> {uploading ? "Importing…" : "Choose Kalodata XLSX or CSV"}
                    <input type="file" accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls" className="hidden" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }} />
                  </label>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Directly supports Kalodata's native export files (both <code>.xlsx</code> and <code>.csv</code>). Automatically maps <code>Item Sold</code>, <code>Product Rating</code>, <code>Commission Rate</code>, <code>Creator Number</code>, and calculates video/live GMV shares.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-300/20 bg-amber-300/5 text-slate-100"><CardContent className="p-4 text-xs leading-5 text-amber-100"><strong>Gate design:</strong> high sales velocity never unlocks script generation by itself. A candidate must be explicitly approved for campaign planning <em>and</em> have an approved evidence/compliance gate.</CardContent></Card>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Candidate queue</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{queueFilter === "all" ? `${candidates.length} active products` : `${visibleCandidates.length} matching products`}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs h-8"
                disabled={reconcileQueue.isPending}
                onClick={() => {
                  reconcileQueue.mutate({ profile, action: "archive" });
                }}
              >
                Archive Out-of-Range ({profile.minTotalSales.toLocaleString()}–{profile.maxTotalSales.toLocaleString()})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs h-8"
                disabled={clearQueue.isPending}
                onClick={() => {
                  if (window.confirm("Archive all unreviewed products in the queue to start fresh? (Approved or reviewed products will remain protected, and raw data is retained).")) {
                    clearQueue.mutate({ onlyUnreviewed: true });
                  }
                }}
              >
                Clear Queue (Start Fresh)
              </Button>
              <select
                aria-label="Filter candidate queue"
                className="h-8 rounded-md border border-white/10 bg-black/30 px-2 text-xs text-slate-200"
                value={queueFilter}
                onChange={(e) => setQueueFilter(e.target.value as typeof queueFilter)}
              >
                <option value="all">All active</option>
                <option value="approved">Approved products</option>
                <option value="ready">Ready for handoff</option>
                <option value="handed_off">Handed off</option>
                <option value="product_intel">Product Intel re-audits</option>
              </select>
            </div>
          </div>
          {!candidates.length ? <Card className="border-white/10 bg-white/[0.04] text-slate-100"><CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"><FileSpreadsheet className="h-10 w-10 text-slate-600" /><p className="font-medium">No product candidates yet.</p><p className="max-w-md text-sm text-slate-500">Import a FastMoss or Kalodata export to calculate the first transparent radar pass.</p></CardContent></Card> : !visibleCandidates.length ? <Card className="border-white/10 bg-white/[0.04] text-slate-100"><CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"><BookMarked className="h-10 w-10 text-slate-600" /><p className="font-medium">No products in this view.</p><p className="max-w-md text-sm text-slate-500">Save a candidate with the matching review or handoff status to see it here.</p></CardContent></Card> : <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><div className="space-y-3">{visibleCandidates.map((candidate) => { const m = candidate.metrics as Record<string, unknown>; return <button key={candidate.id} onClick={() => setSelectedId(candidate.id)} className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === candidate.id ? "border-cyan-300/70 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{candidate.productName}</p><p className="mt-1 text-xs text-slate-500">{candidate.category || "Uncategorized"} · {candidate.provider}</p></div><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">{statusLabels[candidate.reviewStatus] ?? candidate.reviewStatus}</span></div>
            {(() => {
              const diag = diagnoseMetrics(candidate.rawData || {}, (candidate.metrics || {}) as any, candidate, activeProfile);
              return (
                <div className="mt-2">
                  <div className={`text-[11px] font-medium flex items-center gap-1.5 px-2 py-1 rounded border ${
                    diag.overall.statusType === "avoid" ? "bg-rose-500/10 text-rose-300 border-rose-500/30" :
                    diag.overall.statusType === "watchlist" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" :
                    diag.overall.statusType === "human_review" ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
                    "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                  }`}>
                    {diag.overall.statusType === "avoid" && <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />}
                    {diag.overall.statusType === "watchlist" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                    {diag.overall.statusType === "human_review" && <Eye className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    {diag.overall.statusType === "candidate" && <HelpCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                    <span className="truncate">{diag.overall.headlineReason}</span>
                  </div>
                </div>
              );
            })()}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {candidate.activeCreatorCount != null && (
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${m.isHighCompetition ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-white/5 text-slate-300"}`}>
                  <Users className="h-2.5 w-2.5" />
                  {candidate.activeCreatorCount} creators {m.isHighCompetition ? "(Saturated >300)" : ""}
                </span>
              )}
              {candidate.videosOver1MViews != null && candidate.videosOver1MViews > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  <Flame className="h-2.5 w-2.5" />
                  {candidate.videosOver1MViews} video(s) &gt;1M views
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs"><div><p className="text-slate-500">Acceleration</p><p className="mt-1 font-medium text-cyan-200">{String(m.accelerationBand ?? "—")}</p></div><div><p className="text-slate-500">Signals</p><p className="mt-1 font-medium">{String(m.deterministicSignalsMet ?? 0)}/{String(m.deterministicSignalsConsidered ?? 0)}</p></div><div><p className="text-slate-500">Handoff</p><p className="mt-1 font-medium">{candidate.handoffStatus === "not_ready" ? "Blocked" : "Ready"}</p></div></div></button>; })}</div>
            {selected && (
              <CandidateDetail
                candidate={selected}
                profile={activeProfile}
                profileName={profileName}
                onUpdate={(data) => updateReview.mutate({ id: selected.id, ...data })}
                onHandoff={() => handoff.mutate({ id: selected.id })}
                onRefresh={() => {
                  setRefreshingCandidate(true);
                  refreshKalodata.mutate({ id: selected.id });
                }}
                isRefreshing={refreshingCandidate || refreshKalodata.isPending}
                showRawSnapshot={showRawSnapshot}
                setShowRawSnapshot={setShowRawSnapshot}
              />
            )}
          </div>}
        </main>
      </div>
    </div>
    </div>
  );
}

function CandidateDetail({
  candidate,
  profile,
  profileName,
  onUpdate,
  onHandoff,
  onRefresh,
  isRefreshing,
  showRawSnapshot,
  setShowRawSnapshot,
}: {
  candidate: any;
  profile: RadarProfileConfig;
  profileName: string;
  onUpdate: (data: any) => void;
  onHandoff: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  showRawSnapshot: boolean;
  setShowRawSnapshot: (val: boolean) => void;
}) {
  const [status, setStatus] = useState(candidate.reviewStatus);
  const [gate, setGate] = useState(candidate.evidenceGateStatus);
  const [notes, setNotes] = useState(candidate.reviewNotes ?? "");
  const [fit, setFit] = useState<Record<string, string>>(candidate.creatorFit ?? {});
  const raw = candidate.rawData as Record<string, any>;
  const m = candidate.metrics as Record<string, any>;
  const { items, overall } = diagnoseMetrics(raw, m, candidate, profile);
  const brandDiagnostics = buildBrandOpportunityDiagnostics(raw);
  const megaSellerDiagnostic = buildMegaSellerOpportunityDiagnostic(raw, profile);
  const opportunityDiagnostics = megaSellerDiagnostic ? [...brandDiagnostics, megaSellerDiagnostic] : brandDiagnostics;

  const getCardStyle = (color?: MetricColor) => {
    if (color === "red") return "border-rose-500/50 bg-rose-500/10";
    if (color === "yellow") return "border-amber-500/50 bg-amber-500/10";
    if (color === "green") return "border-emerald-500/50 bg-emerald-500/10";
    return "border-white/10 bg-black/20";
  };

  const getBadgeStyle = (color?: MetricColor) => {
    if (color === "red") return "bg-rose-500/20 text-rose-300 border border-rose-500/40";
    if (color === "yellow") return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
    if (color === "green") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
    return "bg-white/5 text-slate-400 border border-white/10";
  };

  return (
    <Card className="border-white/10 bg-white/[0.04] text-slate-100">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${candidate.provider === "Kalodata" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-emerald-500/20 text-emerald-300"}`}>
                {candidate.provider}
              </span>
              {candidate.externalProductId && (
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {candidate.externalProductId}
                </span>
              )}
            </div>
            <CardTitle className="mt-1 text-lg font-semibold">{candidate.productName}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {candidate.provider === "Kalodata" && candidate.externalProductId && (
              <a
                href={buildKalodataProductDetailUrl(candidate.externalProductId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-100 transition px-2 py-1 rounded border border-cyan-400/30 bg-cyan-400/10"
              >
                <ExternalLink className="h-3 w-3" /> Kalodata Deep Dive
              </a>
            )}
            {candidate.productUrl && (
              <a
                href={candidate.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition px-2 py-1 rounded border border-white/10"
              >
                <ExternalLink className="h-3 w-3" /> TikTok Shop
              </a>
            )}
            {candidate.provider === "Kalodata" && candidate.externalProductId && (
              <Button
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                onClick={onRefresh}
                className="border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 text-xs h-8"
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Live"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Prominent Diagnostic Status Banner */}
        <div className={`rounded-xl border p-4 ${
          overall.statusType === "avoid"
            ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
            : overall.statusType === "watchlist"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
            : overall.statusType === "human_review"
            ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
            : "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {overall.statusType === "avoid" && <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />}
              {overall.statusType === "watchlist" && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
              {overall.statusType === "human_review" && <Eye className="h-5 w-5 text-amber-400 shrink-0" />}
              {overall.statusType === "candidate" && <HelpCircle className="h-5 w-5 text-cyan-400 shrink-0" />}
              <span className="font-bold text-sm tracking-wide">{overall.title}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 uppercase text-slate-300">
              Profile: {profileName || "Active Screening Profile"}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium leading-relaxed">
            {overall.headlineReason}
          </p>

          {overall.redFlags.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-rose-500/20 pt-2 text-xs">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Why Avoid? (Failed Thresholds):</p>
              {overall.redFlags.map((flag, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-rose-300">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          )}

          {overall.warningFlags.length > 0 && (
            <div className="mt-2 space-y-1 border-t border-amber-500/20 pt-2 text-xs">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Watch Points:</p>
              {overall.warningFlags.map((flag, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-amber-300">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          )}

          {overall.greenSignals.length > 0 && (
            <div className="mt-2.5 space-y-1 border-t border-emerald-500/20 pt-2 text-xs">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Passing Signals ({overall.greenSignals.length}):</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {overall.greenSignals.map((sig, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    ✓ {sig}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500">Raw data and deterministic metrics</h3>
            <button
              type="button"
              onClick={() => setShowRawSnapshot(!showRawSnapshot)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              {showRawSnapshot ? "Hide Raw Snapshot" : "Inspect Raw Snapshot"}
            </button>
          </div>

          {showRawSnapshot && (
            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-black/40 p-3">
              <div className="flex items-center justify-between text-[11px] text-cyan-300 mb-2">
                <span>Provider Response Snapshot</span>
                <span>Traceable audit record</span>
              </div>
              <pre className="max-h-60 overflow-auto text-[10px] text-slate-300 font-mono whitespace-pre-wrap">
                {JSON.stringify(raw, null, 2)}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total sales", value: items.totalSales?.valueDisplay ?? "—", badge: items.totalSales?.badge, color: items.totalSales?.color },
              { label: "7-day sales", value: Number(raw.sales7d ?? raw.rawDetail7d?.sales_volumn ?? 0).toLocaleString(), badge: "7d Sales Window", color: "slate" as MetricColor },
              { label: "30-day sales", value: Number(raw.sales30d ?? raw.rawDetail30d?.sales_volumn ?? 0).toLocaleString(), badge: "30d Baseline", color: "slate" as MetricColor },
              { label: "Video share", value: items.videoShare?.valueDisplay ?? "—", badge: items.videoShare?.badge, color: items.videoShare?.color },
              { label: "Acceleration", value: items.acceleration?.valueDisplay ?? "—", badge: items.acceleration?.badge, color: items.acceleration?.color },
              { label: "Stable days", value: items.stability?.valueDisplay ?? "—", badge: items.stability?.badge, color: items.stability?.color },
              { label: "Latest multiplier", value: `${metric(m.latestDayMultiplier)}x`, badge: Number(m.latestDayMultiplier) >= profile.latestDayAccelerationMultiplier ? `Surging (≥${profile.latestDayAccelerationMultiplier}x)` : "Normal", color: Number(m.latestDayMultiplier) >= profile.latestDayAccelerationMultiplier ? "green" : "slate" as MetricColor },
              { label: "Top-video concentration", value: items.concentration?.valueDisplay ?? "—", badge: items.concentration?.badge, color: items.concentration?.color },
              { label: "Rating", value: items.rating?.valueDisplay ?? "—", badge: items.rating?.badge, color: items.rating?.color },
              { label: "Commission", value: items.commission?.valueDisplay ?? "—", badge: items.commission?.badge, color: items.commission?.color },
              { label: "Active creators", value: items.creators?.valueDisplay ?? "—", badge: items.creators?.badge, color: items.creators?.color },
              { label: "1M+ view videos", value: items.viralVideos?.valueDisplay ?? "0", badge: items.viralVideos?.badge, color: items.viralVideos?.color },
            ].map((col, idx) => (
              <div key={idx} className={`rounded-lg border p-3 flex flex-col justify-between ${getCardStyle(col.color)}`}>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[11px] font-medium opacity-80">{col.label}</p>
                  {col.badge && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border truncate max-w-[120px] ${getBadgeStyle(col.color)}`}>
                      {col.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-base font-bold text-white tracking-tight">{col.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-400">
            <strong className="text-slate-200">Confidence notes:</strong> {candidate.confidenceNotes || "No confidence notes."}
          </div>
        </section>

        <section className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] text-cyan-200">Brand opportunity diagnostics</h3>
              <p className="mt-1 text-[11px] leading-4 text-slate-400">Advisory signals for creator opportunity and brand behavior. These do not change Candidate/Watchlist/Avoid or unlock campaign planning.</p>
            </div>
            <Video className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {opportunityDiagnostics.map((diagnostic) => (
              <div key={diagnostic.key} className={`rounded-lg border p-3 ${getCardStyle(diagnostic.color)}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-medium text-slate-300">{diagnostic.title}</p>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border text-right ${getBadgeStyle(diagnostic.color)}`}>{diagnostic.badge}</span>
                </div>
                <p className="mt-3 text-base font-bold text-white">{diagnostic.valueDisplay}</p>
                <p className="mt-2 text-[10px] leading-4 text-slate-400">{diagnostic.detail}</p>
              </div>
            ))}
          </div>
        </section>

    <section><h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Operational creator-fit review</h3><div className="grid gap-3 md:grid-cols-2">{[["mechanismCredibility", "Credibility to demonstrate mechanism"], ["audienceRelevance", "Audience relevance"], ["availableFootage", "Available footage"], ["evidenceSupport", "Claims support in product intelligence"]].map(([key, label]) => <div key={key}><Label className="text-xs text-slate-400">{label}</Label><Textarea className="mt-1 min-h-16 border-white/10 bg-black/20" value={fit[key] ?? ""} onChange={(e) => setFit({ ...fit, [key]: e.target.value })} /></div>)}</div></section>
    <section className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-4"><div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-4 w-4 text-violet-200" /><div><h3 className="text-sm font-medium text-violet-100">AI-assisted notes stay separate</h3><p className="mt-1 text-xs leading-5 text-violet-200/70">Video-pattern summaries and creator-fit briefs are advisory only. They do not change the deterministic metrics, status, or evidence gate.</p>{candidate.aiBrief && <p className="mt-2 text-xs text-violet-100">AI brief present: {String(candidate.aiBrief.summary ?? "structured notes")}</p>}</div></div></section>
    <section><h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Review and campaign handoff</h3><p className="mb-3 rounded-md border border-cyan-500/20 bg-cyan-500/5 p-2.5 text-[11px] leading-4 text-slate-400">To approve a product, choose <strong className="text-slate-200">Approved for campaign planning</strong>, complete the evidence/compliance review separately, choose <strong className="text-slate-200">Approved</strong> only when supported, then click <strong className="text-slate-200">Save review</strong>. The handoff button unlocks only after both statuses pass.</p><div className="grid gap-3 md:grid-cols-2"><div><Label className="text-xs text-slate-400">Review status</Label><select className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><Label className="text-xs text-slate-400">Evidence/compliance gate</Label><select className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm" value={gate} onChange={(e) => setGate(e.target.value)}><option value="not_reviewed">Not reviewed</option><option value="needs_product_intel">Needs product intelligence</option><option value="blocked">Blocked</option><option value="approved">Approved</option></select></div></div><Textarea className="mt-3 min-h-20 border-white/10 bg-black/20" placeholder="Review notes, evidence links, or next verification step" value={notes} onChange={(e) => setNotes(e.target.value)} /><div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => onUpdate({ reviewStatus: status, evidenceGateStatus: gate, reviewNotes: notes, creatorFit: fit })}><ShieldCheck className="mr-2 h-4 w-4" /> Save review</Button><Button variant="outline" className="border-emerald-300/30 bg-transparent text-emerald-100" disabled={status !== "approved_for_campaign_planning" || gate !== "approved"} onClick={onHandoff}><CheckCircle2 className="mr-2 h-4 w-4" /> Handoff to campaign planning</Button></div><p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><AlertTriangle className="h-3 w-3" /> Current handoff status: {candidate.handoffStatus}</p></section>
      </CardContent>
    </Card>
  );
}
