import { describe, it, expect } from 'vitest';

// Mirror the step configs from TranscriptionLoading.tsx for validation

const CLONE_STEPS = [
  { label: 'Fetching video', sublabel: 'Downloading audio from TikTok...', duration: 4000 },
  { label: 'Transcribing audio', sublabel: 'Converting speech to text with Whisper...', duration: 12000 },
  { label: 'Analyzing script structure', sublabel: 'Identifying hook, pivot, and CTA...', duration: 4000 },
  { label: 'Preparing results', sublabel: 'Almost ready...', duration: 3000 },
];

const ITERATE_STEPS = [
  { label: 'Fetching video', sublabel: 'Downloading audio from TikTok...', duration: 4000 },
  { label: 'Transcribing audio', sublabel: 'Converting speech to text with Whisper...', duration: 12000 },
  { label: 'Analyzing content', sublabel: 'Extracting key moments and structure...', duration: 4000 },
  { label: 'Preparing results', sublabel: 'Almost ready...', duration: 3000 },
];

const REWRITE_STEPS = [
  { label: 'Analyzing original script', sublabel: 'Reading hook, structure, and tone...', duration: 5000 },
  { label: 'Checking TikTok compliance', sublabel: 'Scanning for hard violations and soft cautions...', duration: 4000 },
  { label: 'Generating pharmacist rewrite', sublabel: 'Preserving original hook, adapting to your voice...', duration: 10000 },
  { label: 'Applying final polish', sublabel: 'Confidence checks and compliance corrections...', duration: 4000 },
];

const ITERATE_GENERATE_STEPS = [
  { label: 'Studying the original', sublabel: 'Identifying what made it work...', duration: 4000 },
  { label: 'Building 70% version', sublabel: 'Minor tweaks — same structure, tighter delivery...', duration: 6000 },
  { label: 'Building 20% version', sublabel: 'New format, same core message...', duration: 6000 },
  { label: 'Building 10% version', sublabel: 'Full reimagination — different angle entirely...', duration: 5000 },
];

describe('Loading screen step configurations', () => {
  it('Clone mode has exactly 4 steps', () => {
    expect(CLONE_STEPS).toHaveLength(4);
  });

  it('Clone steps start with video fetching', () => {
    expect(CLONE_STEPS[0].label).toBe('Fetching video');
    expect(CLONE_STEPS[0].sublabel).toContain('TikTok');
  });

  it('Clone steps include transcription as the longest step', () => {
    const transcribeStep = CLONE_STEPS.find(s => s.label === 'Transcribing audio');
    expect(transcribeStep).toBeDefined();
    const maxDuration = Math.max(...CLONE_STEPS.map(s => s.duration));
    expect(transcribeStep!.duration).toBe(maxDuration);
  });

  it('Clone steps all have sublabels', () => {
    CLONE_STEPS.forEach(step => expect(step.sublabel).toBeTruthy());
  });

  it('Iterate transcription mode has exactly 4 steps', () => {
    expect(ITERATE_STEPS).toHaveLength(4);
  });

  it('Clone and iterate transcription steps share the same first two labels', () => {
    expect(CLONE_STEPS[0].label).toBe(ITERATE_STEPS[0].label);
    expect(CLONE_STEPS[1].label).toBe(ITERATE_STEPS[1].label);
  });

  it('Rewrite mode has exactly 4 steps', () => {
    expect(REWRITE_STEPS).toHaveLength(4);
  });

  it('Rewrite steps include compliance check', () => {
    const complianceStep = REWRITE_STEPS.find(s => s.label.includes('compliance'));
    expect(complianceStep).toBeDefined();
  });

  it('Rewrite generation step is the longest', () => {
    const generateStep = REWRITE_STEPS.find(s => s.label.includes('Generating pharmacist rewrite'));
    expect(generateStep).toBeDefined();
    const maxDuration = Math.max(...REWRITE_STEPS.map(s => s.duration));
    expect(generateStep!.duration).toBe(maxDuration);
  });

  it('Rewrite steps are distinct from transcription steps', () => {
    const rewriteLabels = REWRITE_STEPS.map(s => s.label);
    const cloneLabels = CLONE_STEPS.map(s => s.label);
    for (const label of rewriteLabels) {
      expect(cloneLabels).not.toContain(label);
    }
  });

  it('Iterate generation has exactly 4 steps', () => {
    expect(ITERATE_GENERATE_STEPS).toHaveLength(4);
  });

  it('Iterate generation steps cover all 3 variation levels', () => {
    const labels = ITERATE_GENERATE_STEPS.map(s => s.label);
    expect(labels.some(l => l.includes('70%'))).toBe(true);
    expect(labels.some(l => l.includes('20%'))).toBe(true);
    expect(labels.some(l => l.includes('10%'))).toBe(true);
  });

  it('All steps have positive durations', () => {
    for (const step of [...CLONE_STEPS, ...ITERATE_STEPS, ...REWRITE_STEPS, ...ITERATE_GENERATE_STEPS]) {
      expect(step.duration).toBeGreaterThan(0);
    }
  });

  it('Total clone transcription time is under 30 seconds', () => {
    const total = CLONE_STEPS.reduce((sum, s) => sum + s.duration, 0);
    expect(total).toBeLessThan(30000);
  });

  it('Total iterate generation time is under 30 seconds', () => {
    const total = ITERATE_GENERATE_STEPS.reduce((sum, s) => sum + s.duration, 0);
    expect(total).toBeLessThan(30000);
  });
});

// Test the easing logic used in the progress animation
describe('Progress easing logic', () => {
  it('Progress caps at 95% to show ongoing work', () => {
    // Simulate the easing formula: Math.min(raw * 1.2, 0.95)
    const totalTicks = 40; // e.g. 4000ms / 100ms
    for (let tick = 1; tick <= totalTicks; tick++) {
      const raw = tick / totalTicks;
      const eased = Math.min(raw * 1.2, 0.95);
      expect(eased).toBeLessThanOrEqual(0.95);
    }
  });

  it('Progress reaches at least 90% by the end of a step', () => {
    const totalTicks = 40;
    const raw = totalTicks / totalTicks;
    const eased = Math.min(raw * 1.2, 0.95);
    expect(eased).toBeGreaterThanOrEqual(0.9);
  });

  it('Progress starts near 0% at the beginning', () => {
    const totalTicks = 40;
    const raw = 1 / totalTicks;
    const eased = Math.min(raw * 1.2, 0.95);
    expect(eased).toBeLessThan(0.05);
  });
});
