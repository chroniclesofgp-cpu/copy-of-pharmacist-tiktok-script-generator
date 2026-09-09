import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, BookMarked, CheckCircle2, ExternalLink, FileSpreadsheet, Globe, LockKeyhole, RefreshCw, ShieldCheck, SlidersHorizontal, Sparkles, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { DEFAULT_RADAR_PROFILE, type RadarProfileConfig } from "../../../server/radar";

const statusLabels: Record<string, string> = { candidate: "Candidate", watchlist: "Watchlist", human_review: "Human review", avoid: "Avoid", approved_for_campaign_planning: "Approved for campaign planning" };
const metric = (value: unknown) => typeof value === "number" ? Number(value.toFixed(2)) : "—";

export default function ProductRadar() {
  const utils = trpc.useUtils();
  const { data: profileData } = trpc.radar.getProfile.useQuery();
  const { data: kalodataStatus } = trpc.radar.getKalodataStatus.useQuery();
  const { data: candidates = [], isLoading } = trpc.radar.listCandidates.useQuery();
  const [profile, setProfile] = useState<RadarProfileConfig>(DEFAULT_RADAR_PROFILE);
  const [profileName, setProfileName] = useState("Default health and skincare screen");
  const [provider, setProvider] = useState("FastMoss CSV");
  const [activeInputTab, setActiveInputTab] = useState<"kalodata" | "csv">("kalodata");
  const [searchKeyword, setSearchKeyword] = useState("Magnesium");
  const [searchRegion, setSearchRegion] = useState("US");
  const [searchLimit, setSearchLimit] = useState(5);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [refreshingCandidate, setRefreshingCandidate] = useState(false);
  const [showRawSnapshot, setShowRawSnapshot] = useState(false);

  const saveProfile = trpc.radar.saveProfile.useMutation({ onSuccess: () => setNotice("Screening profile saved.") });
  const importCsv = trpc.radar.importCsv.useMutation({ onSuccess: (result) => { setNotice(`Imported ${result.validRows} candidate rows with ${result.errors.length} validation errors.`); void utils.radar.listCandidates.invalidate(); setUploading(false); }, onError: (error) => { setNotice(error.message); setUploading(false); } });
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
      setNotice(`Refresh failed: ${err.message}`);
      setRefreshingCandidate(false);
    },
  });
  const updateReview = trpc.radar.updateReview.useMutation({ onSuccess: () => { setNotice("Review saved. The handoff remains blocked until the evidence gate is approved."); void utils.radar.listCandidates.invalidate(); } });
  const handoff = trpc.radar.handoffToCampaign.useMutation({ onSuccess: () => { setNotice("Campaign-planning handoff completed after the evidence gate."); void utils.radar.listCandidates.invalidate(); }, onError: (error) => setNotice(error.message) });
  const activeProfile = profileData?.config ?? profile;
  const selected = useMemo(() => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0], [candidates, selectedId]);

  const handleUpload = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => importCsv.mutate({ provider, fileName: file.name, csv: String(reader.result ?? ""), profile: activeProfile });
    reader.onerror = () => { setNotice("Could not read the CSV file."); setUploading(false); };
    reader.readAsText(file);
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
            <div><Label>Profile name</Label><Input className="mt-1 border-white/10 bg-black/20" value={profileName} onChange={(e) => setProfileName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">{([["minTotalSales", "Min total sales"], ["maxTotalSales", "Max total sales"], ["matureAgeDays", "Mature age days"], ["veryNewAgeDays", "Very new age days"], ["accelerationStartingPct", "Starting %"], ["accelerationClearPct", "Clear %"], ["accelerationStrongPct", "Strong %"], ["stableDaysRequired", "Stable days"], ["stableVariancePct", "Stable variance %"], ["strongDayUnits", "Strong day units"], ["strongDaysMinimum", "Strong days min"], ["latestDayAccelerationMultiplier", "Latest multiplier"], ["videoShareMinimumPct", "Video share min %"], ["topVideoSpreadMaxPct", "Spread max %"], ["topVideoWatchMaxPct", "Watch max %"], ["ratingMinimum", "Rating min"], ["commissionAfterAdsMinimumPct", "Commission min %"]] as const).map(([key, label]) => <div key={key}><Label className="text-xs text-slate-400">{label}</Label><Input type="number" step="any" className="mt-1 border-white/10 bg-black/20" value={profile[key]} onChange={(e) => setNumber(key, e.target.value)} /></div>)}</div>
            <div className="flex gap-2"><Button className="flex-1" onClick={() => saveProfile.mutate({ name: profileName, config: profile })}>Save profile</Button><Button variant="outline" className="border-white/10 bg-transparent" onClick={() => setProfile(DEFAULT_RADAR_PROFILE)}><RefreshCw className="h-4 w-4" /></Button></div>
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
                    className={`px-2.5 py-1 rounded-md transition ${activeInputTab === "kalodata" ? "bg-cyan-500/20 text-cyan-300 font-medium" : "text-slate-400 hover:text-white"}`}
                  >
                    Kalodata API
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInputTab("csv")}
                    className={`px-2.5 py-1 rounded-md transition ${activeInputTab === "csv" ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-slate-400 hover:text-white"}`}
                  >
                    CSV Import
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
                    <Label className="text-xs text-slate-300">Keyword Search</Label>
                    <Input
                      className="mt-1 border-white/10 bg-black/20"
                      placeholder="e.g. Magnesium, Retinol, Berberine"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Magnesium", "Retinol", "Shilajit", "Creatine", "Berberine"].map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => setSearchKeyword(kw)}
                          className="text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-slate-400">Region</Label>
                      <select
                        className="mt-1 h-9 w-full rounded-md border border-white/10 bg-black/20 px-2 text-xs text-slate-200"
                        value={searchRegion}
                        onChange={(e) => setSearchRegion(e.target.value)}
                      >
                        <option value="US">US (United States)</option>
                        <option value="GB">GB (United Kingdom)</option>
                        <option value="TH">TH (Thailand)</option>
                        <option value="VN">VN (Vietnam)</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-400">Max Candidates</Label>
                      <select
                        className="mt-1 h-9 w-full rounded-md border border-white/10 bg-black/20 px-2 text-xs text-slate-200"
                        value={searchLimit}
                        onChange={(e) => setSearchLimit(Number(e.target.value))}
                      >
                        <option value={3}>Top 3</option>
                        <option value={5}>Top 5</option>
                        <option value={10}>Top 10</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
                    disabled={searchKalodata.isPending || !searchKeyword.trim()}
                    onClick={() => searchKalodata.mutate({ keyword: searchKeyword, region: searchRegion, maxCandidates: searchLimit })}
                  >
                    {searchKalodata.isPending ? (
                      <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Pulling Kalodata Live...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> Pull Live from Kalodata</span>
                    )}
                  </Button>
                  <p className="text-[11px] leading-4 text-slate-500">
                    Pulls product ranking, 7d/30d details, and top shoppable videos in a single snapshot. Rate-limited with automatic backoff.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-400">Provider Label</Label>
                    <Input className="mt-1 border-white/10 bg-black/20" value={provider} onChange={(e) => setProvider(e.target.value)} />
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-300/40 bg-emerald-300/5 px-4 py-5 text-sm text-emerald-100 hover:bg-emerald-300/10">
                    <Upload className="h-4 w-4" /> {uploading ? "Importing…" : "Choose CSV"}
                    <input type="file" accept=".csv,text/csv" className="hidden" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }} />
                  </label>
                  <p className="text-xs leading-5 text-slate-500">Required columns: product name, total sales, and 7-day sales. Optional dailySalesJson array.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-300/20 bg-amber-300/5 text-slate-100"><CardContent className="p-4 text-xs leading-5 text-amber-100"><strong>Gate design:</strong> high sales velocity never unlocks script generation by itself. A candidate must be explicitly approved for campaign planning <em>and</em> have an approved evidence/compliance gate.</CardContent></Card>
        </aside>

        <main className="space-y-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Candidate queue</p><h2 className="mt-1 text-xl font-semibold">{candidates.length} imported products</h2></div><div className="text-right text-xs text-slate-500">{isLoading ? "Loading…" : "Scores are deterministic"}</div></div>
          {!candidates.length ? <Card className="border-white/10 bg-white/[0.04] text-slate-100"><CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"><FileSpreadsheet className="h-10 w-10 text-slate-600" /><p className="font-medium">No product candidates yet.</p><p className="max-w-md text-sm text-slate-500">Import a FastMoss or Kalodata export to calculate the first transparent radar pass.</p></CardContent></Card> : <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><div className="space-y-3">{candidates.map((candidate) => { const m = candidate.metrics as Record<string, unknown>; return <button key={candidate.id} onClick={() => setSelectedId(candidate.id)} className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === candidate.id ? "border-cyan-300/70 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{candidate.productName}</p><p className="mt-1 text-xs text-slate-500">{candidate.category || "Uncategorized"} · {candidate.provider}</p></div><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">{statusLabels[candidate.reviewStatus] ?? candidate.reviewStatus}</span></div><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><p className="text-slate-500">Acceleration</p><p className="mt-1 font-medium text-cyan-200">{String(m.accelerationBand ?? "—")}</p></div><div><p className="text-slate-500">Signals</p><p className="mt-1 font-medium">{String(m.deterministicSignalsMet ?? 0)}/{String(m.deterministicSignalsConsidered ?? 0)}</p></div><div><p className="text-slate-500">Handoff</p><p className="mt-1 font-medium">{candidate.handoffStatus === "not_ready" ? "Blocked" : "Ready"}</p></div></div></button>; })}</div>
            {selected && (
              <CandidateDetail
                candidate={selected}
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
  onUpdate,
  onHandoff,
  onRefresh,
  isRefreshing,
  showRawSnapshot,
  setShowRawSnapshot,
}: {
  candidate: any;
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
              ["Total sales", raw.totalSales ?? raw.rawDetail7d?.sales_volumn ?? "—"],
              ["7-day sales", raw.sales7d ?? raw.rawDetail7d?.sales_volumn ?? "—"],
              ["30-day sales", raw.sales30d ?? raw.rawDetail30d?.sales_volumn ?? "—"],
              ["Video share", raw.videoSalesPct != null ? `${raw.videoSalesPct}%` : "—"],
              ["Acceleration", m.accelerationPct != null ? `${metric(m.accelerationPct)}%` : "—"],
              ["Band", m.accelerationBand],
              ["Stable days", m.stableDays],
              ["Latest multiplier", metric(m.latestDayMultiplier)],
              ["Top-video concentration", m.topVideoConcentrationPct != null ? `${m.topVideoConcentrationPct}%` : "—"],
              ["Concentration", m.concentrationBand],
              ["Rating", raw.rating ?? "—"],
              ["Commission", raw.commissionAfterAdsPct != null ? `${raw.commissionAfterAdsPct}%` : "—"],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-medium">{String(value)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-400">
            <strong className="text-slate-200">Confidence notes:</strong> {candidate.confidenceNotes || "No confidence notes."}
          </div>
        </section>

    <section><h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Operational creator-fit review</h3><div className="grid gap-3 md:grid-cols-2">{[["mechanismCredibility", "Credibility to demonstrate mechanism"], ["audienceRelevance", "Audience relevance"], ["availableFootage", "Available footage"], ["evidenceSupport", "Claims support in product intelligence"]].map(([key, label]) => <div key={key}><Label className="text-xs text-slate-400">{label}</Label><Textarea className="mt-1 min-h-16 border-white/10 bg-black/20" value={fit[key] ?? ""} onChange={(e) => setFit({ ...fit, [key]: e.target.value })} /></div>)}</div></section>
    <section className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-4"><div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-4 w-4 text-violet-200" /><div><h3 className="text-sm font-medium text-violet-100">AI-assisted notes stay separate</h3><p className="mt-1 text-xs leading-5 text-violet-200/70">Video-pattern summaries and creator-fit briefs are advisory only. They do not change the deterministic metrics, status, or evidence gate.</p>{candidate.aiBrief && <p className="mt-2 text-xs text-violet-100">AI brief present: {String(candidate.aiBrief.summary ?? "structured notes")}</p>}</div></div></section>
    <section><h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Review and campaign handoff</h3><div className="grid gap-3 md:grid-cols-2"><div><Label className="text-xs text-slate-400">Review status</Label><select className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><Label className="text-xs text-slate-400">Evidence/compliance gate</Label><select className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm" value={gate} onChange={(e) => setGate(e.target.value)}><option value="not_reviewed">Not reviewed</option><option value="needs_product_intel">Needs product intelligence</option><option value="blocked">Blocked</option><option value="approved">Approved</option></select></div></div><Textarea className="mt-3 min-h-20 border-white/10 bg-black/20" placeholder="Review notes, evidence links, or next verification step" value={notes} onChange={(e) => setNotes(e.target.value)} /><div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => onUpdate({ reviewStatus: status, evidenceGateStatus: gate, reviewNotes: notes, creatorFit: fit })}><ShieldCheck className="mr-2 h-4 w-4" /> Save review</Button><Button variant="outline" className="border-emerald-300/30 bg-transparent text-emerald-100" disabled={status !== "approved_for_campaign_planning" || gate !== "approved"} onClick={onHandoff}><CheckCircle2 className="mr-2 h-4 w-4" /> Handoff to campaign planning</Button></div><p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><AlertTriangle className="h-3 w-3" /> Current handoff status: {candidate.handoffStatus}</p></section>
      </CardContent>
    </Card>
  );
}
