import { useState, useEffect } from 'react';

interface LoadingStep {
  label: string;
  sublabel?: string;
  duration: number; // approximate ms for this step
}

const CLONE_STEPS: LoadingStep[] = [
  { label: 'Fetching video', sublabel: 'Downloading audio from TikTok...', duration: 4000 },
  { label: 'Transcribing audio', sublabel: 'Converting speech to text with Whisper...', duration: 12000 },
  { label: 'Analyzing script structure', sublabel: 'Identifying hook, pivot, and CTA...', duration: 4000 },
  { label: 'Preparing results', sublabel: 'Almost ready...', duration: 3000 },
];

const ITERATE_STEPS: LoadingStep[] = [
  { label: 'Fetching video', sublabel: 'Downloading audio from TikTok...', duration: 4000 },
  { label: 'Transcribing audio', sublabel: 'Converting speech to text with Whisper...', duration: 12000 },
  { label: 'Analyzing content', sublabel: 'Extracting key moments and structure...', duration: 4000 },
  { label: 'Preparing results', sublabel: 'Almost ready...', duration: 3000 },
];

const REWRITE_STEPS: LoadingStep[] = [
  { label: 'Analyzing original script', sublabel: 'Reading hook, structure, and tone...', duration: 5000 },
  { label: 'Checking TikTok compliance', sublabel: 'Scanning for hard violations and soft cautions...', duration: 4000 },
  { label: 'Generating pharmacist rewrite', sublabel: 'Preserving original hook, adapting to your voice...', duration: 10000 },
  { label: 'Applying final polish', sublabel: 'Confidence checks and compliance corrections...', duration: 4000 },
];

const ITERATE_GENERATE_STEPS: LoadingStep[] = [
  { label: 'Studying the original', sublabel: 'Identifying what made it work...', duration: 4000 },
  { label: 'Building 70% version', sublabel: 'Minor tweaks — same structure, tighter delivery...', duration: 6000 },
  { label: 'Building 20% version', sublabel: 'New format, same core message...', duration: 6000 },
  { label: 'Building 10% version', sublabel: 'Full reimagination — different angle entirely...', duration: 5000 },
];

// ── Shared progress bar renderer ─────────────────────────────────────────────

function ProgressSteps({
  steps,
  activeStep,
  stepProgress,
  accentColor,
}: {
  steps: LoadingStep[];
  activeStep: number;
  stepProgress: number;
  accentColor: 'purple' | 'amber' | 'teal';
}) {
  const colorMap = {
    purple: { bar: 'bg-purple-500', barActive: 'bg-purple-400', text: 'text-purple-400', dot: 'bg-purple-400' },
    amber: { bar: 'bg-amber-500', barActive: 'bg-amber-400', text: 'text-amber-400', dot: 'bg-amber-400' },
    teal: { bar: 'bg-teal-500', barActive: 'bg-teal-400', text: 'text-teal-400', dot: 'bg-teal-400' },
  };
  const c = colorMap[accentColor];

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const isCompleted = i < activeStep;
        const isCurrent = i === activeStep;
        const isWaiting = i > activeStep;

        return (
          <div key={i}>
            <div className="flex items-start justify-between mb-1.5 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {/* Step indicator dot */}
                <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-0.5 transition-all duration-300 ${
                  isCompleted ? c.dot :
                  isCurrent ? `${c.dot} animate-pulse` :
                  'bg-white/15'
                }`} />
                <div className="min-w-0">
                  <p className={`text-sm font-medium transition-colors duration-300 leading-tight ${
                    isCurrent ? 'text-white' :
                    isCompleted ? c.text :
                    'text-white/25'
                  }`}>
                    {isCompleted ? `✓ ${step.label}` : step.label}
                  </p>
                  {isCurrent && step.sublabel && (
                    <p className="text-[11px] text-white/35 mt-0.5 leading-tight">{step.sublabel}</p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                {isCurrent && (
                  <span className="text-xs text-white/40 tabular-nums">{stepProgress}%</span>
                )}
                {isCompleted && (
                  <span className={`text-xs ${c.text}`}>Done</span>
                )}
                {isWaiting && (
                  <span className="text-xs text-white/15">—</span>
                )}
              </div>
            </div>
            <div className={`h-1 w-full rounded-full overflow-hidden ml-4 transition-colors duration-300 ${
              isWaiting ? 'bg-white/5' : 'bg-white/10'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-200 ease-out ${
                  isCompleted ? c.bar : isCurrent ? c.barActive : 'bg-transparent'
                }`}
                style={{
                  width: isCompleted ? '100%' : isCurrent ? `${stepProgress}%` : '0%',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Shared hook for step animation ───────────────────────────────────────────

function useStepAnimation(isActive: boolean, steps: LoadingStep[]) {
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setActiveStep(0);
      setStepProgress(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const step = steps[activeStep];
    if (!step) return;

    const intervalMs = 100;
    const totalTicks = step.duration / intervalMs;
    let tick = 0;

    const interval = setInterval(() => {
      tick++;
      const raw = tick / totalTicks;
      // Ease-in-out: fast start, slows near 95% to wait for real completion
      const eased = Math.min(raw * 1.2, 0.95);
      setStepProgress(Math.round(eased * 100));

      if (tick >= totalTicks) {
        clearInterval(interval);
        if (activeStep < steps.length - 1) {
          setActiveStep(prev => prev + 1);
          setStepProgress(0);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isActive, activeStep, steps]);

  return { activeStep, stepProgress };
}

// ── Shared overlay wrapper ────────────────────────────────────────────────────

function LoadingOverlay({
  title,
  emoji,
  footer,
  children,
}: {
  title: string;
  emoji: string;
  footer: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl bg-[#0a0e1a] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{emoji}</span>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {children}
        <p className="text-[11px] text-white/20 text-center mt-6">{footer}</p>
      </div>
    </div>
  );
}

// ── Transcription Loading Overlay ────────────────────────────────────────────

interface TranscriptionLoadingProps {
  isActive: boolean;
  mode: 'clone' | 'iterate';
}

export function TranscriptionLoading({ isActive, mode }: TranscriptionLoadingProps) {
  const steps = mode === 'clone' ? CLONE_STEPS : ITERATE_STEPS;
  const accentColor = mode === 'clone' ? 'purple' : 'amber';
  const { activeStep, stepProgress } = useStepAnimation(isActive, steps);

  if (!isActive) return null;

  return (
    <LoadingOverlay
      title={mode === 'clone' ? 'Transcribing Video' : 'Transcribing Video'}
      emoji={mode === 'clone' ? '🧬' : '🔬'}
      footer="Usually takes 15–30 seconds depending on video length"
    >
      <ProgressSteps steps={steps} activeStep={activeStep} stepProgress={stepProgress} accentColor={accentColor} />
    </LoadingOverlay>
  );
}

// ── Rewrite Loading Overlay ──────────────────────────────────────────────────

interface RewriteLoadingProps {
  isActive: boolean;
}

export function RewriteLoading({ isActive }: RewriteLoadingProps) {
  const { activeStep, stepProgress } = useStepAnimation(isActive, REWRITE_STEPS);

  if (!isActive) return null;

  return (
    <LoadingOverlay
      title="Generating Pharmacist Rewrite"
      emoji="💊"
      footer="Adapting the proven script to your pharmacist voice — usually 10–20 seconds"
    >
      <ProgressSteps steps={REWRITE_STEPS} activeStep={activeStep} stepProgress={stepProgress} accentColor="purple" />
    </LoadingOverlay>
  );
}

// ── Iterate Generation Loading Overlay ───────────────────────────────────────

interface IterateLoadingProps {
  isActive: boolean;
}

export function IterateLoading({ isActive }: IterateLoadingProps) {
  const { activeStep, stepProgress } = useStepAnimation(isActive, ITERATE_GENERATE_STEPS);

  if (!isActive) return null;

  return (
    <LoadingOverlay
      title="Generating 70/20/10 Iterations"
      emoji="⚗️"
      footer="Building all three variation levels — usually 15–25 seconds"
    >
      <ProgressSteps steps={ITERATE_GENERATE_STEPS} activeStep={activeStep} stepProgress={stepProgress} accentColor="amber" />
    </LoadingOverlay>
  );
}
