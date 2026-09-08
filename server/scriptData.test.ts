import { describe, it, expect } from 'vitest';
import {
  checkCompliance,
  applyWordFilter,
  getHashtags,
  generateScript,
  generateCloneAdaptation,
  generateIteration,
  HOOKS,
  COMPLIANCE_RULES,
} from '../client/src/lib/scriptData';

// ============================================================
// COMPLIANCE CHECKS
// ============================================================
describe('checkCompliance', () => {
  it('flags hard violations for cure claims', () => {
    const { hardFlags } = checkCompliance('This supplement cures diabetes and is a miracle pill');
    expect(hardFlags.length).toBeGreaterThan(0);
    expect(hardFlags.some(f => f.includes('cure'))).toBe(true);
  });

  it('returns empty arrays for clean text', () => {
    const { hardFlags, softFlags } = checkCompliance('This supplement may support healthy energy levels and overall wellness.');
    expect(hardFlags).toHaveLength(0);
    expect(softFlags).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    const { hardFlags } = checkCompliance('This CURES everything');
    expect(hardFlags.length).toBeGreaterThan(0);
  });

  it('flags soft cautions for borderline language', () => {
    const { softFlags } = checkCompliance('This has guaranteed results');
    expect(softFlags.length).toBeGreaterThan(0);
    expect(softFlags.some(f => f.includes('guaranteed'))).toBe(true);
  });
});

// ============================================================
// WORD FILTER
// ============================================================
describe('applyWordFilter', () => {
  it('removes banned words', () => {
    const result = applyWordFilter('This is amazing and life-changing', ['amazing']);
    expect(result).not.toContain('amazing');
    expect(result).toContain('[REMOVED]');
  });

  it('returns original text when no banned words', () => {
    const result = applyWordFilter('This is a great supplement', []);
    expect(result).toBe('This is a great supplement');
  });

  it('handles multiple banned words', () => {
    const result = applyWordFilter('This is amazing and miraculous', ['amazing', 'miraculous']);
    expect(result).not.toContain('amazing');
    expect(result).not.toContain('miraculous');
  });

  it('is case-insensitive for word matching', () => {
    const result = applyWordFilter('This is AMAZING', ['amazing']);
    expect(result).not.toContain('AMAZING');
  });
});

// ============================================================
// HASHTAG GENERATION
// ============================================================
describe('getHashtags', () => {
  it('returns hashtags for NAD+', () => {
    const tags = getHashtags('NAD+', 'after-1-month');
    expect(tags).toContain('#Pharmacist');
    expect(tags).toContain('#TikTokShop');
    expect(tags.some(t => t.toLowerCase().includes('aging'))).toBe(true);
  });

  it('returns hashtags for Magnesium', () => {
    const tags = getHashtags('Magnesium Glycinate', 'symptom-checklist');
    expect(tags).toContain('#Pharmacist');
    expect(tags.some(t => t.toLowerCase().includes('energy') || t.toLowerCase().includes('sleep'))).toBe(true);
  });

  it('returns no more than 12 hashtags', () => {
    const tags = getHashtags('Magnesium Glycinate', 'after-1-month');
    expect(tags.length).toBeLessThanOrEqual(12);
  });

  it('includes product-specific hashtag', () => {
    const tags = getHashtags('Astaxanthin', 'after-1-month');
    expect(tags[0]).toBe('#Astaxanthin');
  });
});

// ============================================================
// SCRIPT GENERATION
// ============================================================
describe('generateScript', () => {
  const baseInputs = {
    productName: 'Magnesium Glycinate',
    productDescription: 'High-absorption magnesium for sleep and relaxation',
    keyBenefit: 'Improves sleep quality and reduces anxiety',
    productLink: 'https://www.tiktok.com/shop/test',
  };

  it('generates a script with all required fields', () => {
    const script = generateScript(baseInputs, 'after-1-month', false, []);
    expect(script.textHook).toBeTruthy();
    expect(script.verbalHook).toBeTruthy();
    expect(script.problem).toBeTruthy();
    expect(script.authorityPivot).toBeTruthy();
    expect(script.mechanism).toBeTruthy();
    expect(script.cta).toBeTruthy();
    expect(script.hashtags.length).toBeGreaterThan(0);
    expect(script.visualOverlays.length).toBeGreaterThan(0);
    expect(script.fullScript).toBeTruthy();
  });

  it('replaces [PRODUCT] placeholder in hooks', () => {
    const script = generateScript(baseInputs, 'after-1-month', false, []);
    expect(script.textHook).not.toContain('[PRODUCT]');
    expect(script.verbalHook).not.toContain('[PRODUCT]');
  });

  it('includes misdirection when enabled', () => {
    const script = generateScript(baseInputs, 'after-1-month', true, []);
    expect(script.misdirection).toBeTruthy();
    expect(script.fullScript).toContain(script.misdirection!);
  });

  it('does not include misdirection when disabled', () => {
    const script = generateScript(baseInputs, 'after-1-month', false, []);
    expect(script.misdirection).toBeUndefined();
  });

  it('applies word filter to fullScript', () => {
    const script = generateScript(baseInputs, 'after-1-month', false, ['amazing']);
    expect(script.fullScript).not.toMatch(/\bamazing\b/i);
  });

  it('runs compliance check and returns hard and soft flags', () => {
    const script = generateScript(baseInputs, 'after-1-month', false, []);
    expect(Array.isArray(script.complianceHardFlags)).toBe(true);
    expect(Array.isArray(script.complianceSoftFlags)).toBe(true);
  });

  it('works for all tier 1 hooks', () => {
    const tier1Hooks = HOOKS.filter(h => h.tier === 'tier1');
    for (const hook of tier1Hooks) {
      expect(() => generateScript(baseInputs, hook.id, false, [])).not.toThrow();
    }
  });

  it('works for all tier 2 hooks', () => {
    const tier2Hooks = HOOKS.filter(h => h.tier === 'tier2');
    for (const hook of tier2Hooks) {
      expect(() => generateScript(baseInputs, hook.id, false, [])).not.toThrow();
    }
  });

  it('generates NAD+ specific mechanism', () => {
    const nadInputs = { ...baseInputs, productName: 'NAD+', keyBenefit: 'Boosts cellular energy' };
    const script = generateScript(nadInputs, 'nad-dosing', false, []);
    expect(script.mechanism.toLowerCase()).toContain('nad');
  });
});

// ============================================================
// CLONE ADAPTATION
// ============================================================
describe('generateCloneAdaptation', () => {
  it('generates a clone guide with creator handle', () => {
    const output = generateCloneAdaptation('@drew.review', 'Magnesium Glycinate', 'Opens with symptom checklist');
    expect(output).toContain('@drew.review');
    expect(output).toContain('Magnesium Glycinate');
    expect(output).toContain('WHAT TO KEEP');
    expect(output).toContain('WHAT TO CHANGE');
  });

  it('includes product link when provided', () => {
    const output = generateCloneAdaptation('@drew.review', 'NAD+', 'Dosing video', 'https://tiktok.com/shop/test');
    expect(output).toContain('https://tiktok.com/shop/test');
  });

  it('includes pharmacist credential swap instructions', () => {
    const output = generateCloneAdaptation('@faithfuldoc', 'Astaxanthin', 'Doctor explains anti-aging');
    expect(output).toContain('Pharmacist');
  });
});

// ============================================================
// ITERATION
// ============================================================
describe('generateIteration', () => {
  it('generates 70% iteration plan', () => {
    const output = generateIteration('Magnesium instruction video', 'Magnesium Glycinate', '70');
    expect(output).toContain('70%');
    expect(output).toContain('WHAT TO KEEP');
    expect(output).toContain('WHAT TO CHANGE');
    expect(output).toContain('CTA VARIATIONS');
  });

  it('generates 20% iteration plan', () => {
    const output = generateIteration('Magnesium instruction video', 'Magnesium Glycinate', '20');
    expect(output).toContain('20%');
    expect(output).toContain('FORMAT CHANGE');
  });

  it('generates 10% iteration plan', () => {
    const output = generateIteration('Magnesium instruction video', 'Magnesium Glycinate', '10');
    expect(output).toContain('10%');
    expect(output).toContain('EXPERIMENT');
  });

  it('includes product link when provided', () => {
    const output = generateIteration('test video', 'NAD+', '70', 'https://tiktok.com/shop/nad');
    expect(output).toContain('https://tiktok.com/shop/nad');
  });
});

// ============================================================
// HOOK LIBRARY INTEGRITY
// ============================================================
describe('HOOKS data integrity', () => {
  it('all hooks have required fields', () => {
    for (const hook of HOOKS) {
      expect(hook.id).toBeTruthy();
      expect(hook.name).toBeTruthy();
      expect(hook.textHook).toBeTruthy();
      expect(hook.verbalHook).toBeTruthy();
      expect(hook.psychTriggers.length).toBeGreaterThan(0);
      expect(['high', 'medium', 'low']).toContain(hook.misdirectionCompatibility);
      expect(hook.misdirectionNote).toBeTruthy();
    }
  });

  it('has 11 tier 1 hooks', () => {
    const tier1 = HOOKS.filter(h => h.tier === 'tier1');
    // 9 original + 2 promoted from new hooks (expert-verdict, audience-pivot)
    // fountain-of-youth removed (unverified, overlapped with age-reversal)
    expect(tier1).toHaveLength(11);
  });

  it('has 13 tier 2 hooks', () => {
    const tier2 = HOOKS.filter(h => h.tier === 'tier2');
    // 8 original + 5 new healthcare hooks wired in (right-way, fear-external-threat,
    // viral-metaphor, side-effect-surprise, comment-reply-qanda)
    expect(tier2).toHaveLength(13);
  });

  it('all tier 1 hooks have example videos', () => {
    const tier1 = HOOKS.filter(h => h.tier === 'tier1');
    for (const hook of tier1) {
      expect(hook.exampleVideo).toBeTruthy();
      expect(hook.exampleVideo?.url).toContain('tiktok.com');
    }
  });
});

// ============================================================
// COMPLIANCE RULES INTEGRITY
// ============================================================
describe('COMPLIANCE_RULES', () => {
  it('has hard phrases list', () => {
    expect(COMPLIANCE_RULES.hardPhrases.length).toBeGreaterThan(0);
  });

  it('has soft phrases list', () => {
    expect(COMPLIANCE_RULES.softPhrases.length).toBeGreaterThan(0);
  });

  it('has guidelines list', () => {
    expect(COMPLIANCE_RULES.guidelines.length).toBeGreaterThan(0);
  });

  it('checkCompliance returns hardFlags for cure claims', () => {
    const result = checkCompliance('This product cures cancer and is FDA approved');
    expect(result.hardFlags.length).toBeGreaterThan(0);
    expect(result.hardFlags.some(f => f.includes('cure'))).toBe(true);
  });

  it('checkCompliance returns softFlags for borderline language', () => {
    const result = checkCompliance('This product has guaranteed results and is clinically proven');
    expect(result.softFlags.length).toBeGreaterThan(0);
    expect(result.softFlags.some(f => f.includes('guaranteed'))).toBe(true);
  });

  it('checkCompliance returns empty arrays for clean text', () => {
    const result = checkCompliance('This supplement may help support healthy energy levels');
    expect(result.hardFlags.length).toBe(0);
    expect(result.softFlags.length).toBe(0);
  });
});
