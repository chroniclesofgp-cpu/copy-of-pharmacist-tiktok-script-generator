// Product Library — pre-loaded supplement profiles for one-tap fill in Generate Mode

export interface ProductProfile {
  id: string;
  name: string;
  category: string;
  keyBenefit: string;
  description: string;
  emoji: string;
  topHooks: string[]; // hook IDs that work best for this product
}

export const PRODUCT_LIBRARY: ProductProfile[] = [
  {
    id: 'nad-plus',
    name: 'NAD+',
    category: 'Longevity',
    keyBenefit: 'Boosts cellular energy and supports healthy aging',
    description: 'NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in every cell that declines by up to 50% by age 40. It plays a critical role in cellular energy production, DNA repair, and activating longevity proteins called sirtuins. Supplementing with NAD+ precursors like NMN or NR helps restore youthful cellular function, improves mitochondrial health, supports brain clarity, and may slow the visible signs of aging. Most users report improved energy, mental sharpness, and better sleep quality within 2–4 weeks.',
    emoji: '⚡',
    topHooks: ['after-1-month', 'suppressed-knowledge', 'age-reversal'],
  },
  {
    id: 'nmn',
    name: 'NMN',
    category: 'Longevity',
    keyBenefit: 'Direct NAD+ precursor that restores cellular energy and slows aging',
    description: 'NMN (Nicotinamide Mononucleotide) is the most direct precursor to NAD+ and is rapidly converted in the body. Unlike other NAD+ boosters, NMN crosses into cells efficiently and raises NAD+ levels within hours. Research from Harvard and Washington University shows NMN improves muscle function, metabolic health, and cognitive performance in aging subjects. Key benefits include increased energy without stimulants, improved insulin sensitivity, enhanced DNA repair, and better cardiovascular health. Sublingual or liposomal forms have the highest bioavailability.',
    emoji: '🔬',
    topHooks: ['suppressed-knowledge', 'nad-dosing', 'after-1-month'],
  },
  {
    id: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    category: 'Sleep & Recovery',
    keyBenefit: 'Improves sleep quality, reduces anxiety, and relieves muscle tension',
    description: 'Magnesium Glycinate is the most bioavailable and gentle form of magnesium — bound to glycine, an amino acid that also promotes relaxation. Over 68% of Americans are deficient in magnesium, which affects 300+ enzymatic reactions including sleep regulation, muscle relaxation, and stress response. Unlike magnesium oxide (which causes digestive upset), glycinate is absorbed efficiently and doesn\'t cause laxative effects. Benefits include deeper sleep, reduced nighttime anxiety, fewer muscle cramps, improved mood, and lower cortisol. Most effective taken 30–60 minutes before bed at 200–400mg.',
    emoji: '🌙',
    topHooks: ['instruction-correction', 'symptom-checklist', 'after-1-month'],
  },
  {
    id: 'astaxanthin',
    name: 'Astaxanthin',
    category: 'Antioxidant & Skin',
    keyBenefit: 'Most powerful antioxidant known — protects skin, eyes, and joints from oxidative damage',
    description: 'Astaxanthin is a carotenoid produced by microalgae that gives salmon and flamingos their pink color. It is 6,000x more potent than Vitamin C and 550x stronger than Vitamin E as an antioxidant. Unlike most antioxidants, it crosses both the blood-brain barrier and the blood-retinal barrier, protecting the brain and eyes simultaneously. Key benefits include visibly reduced skin aging (wrinkles, elasticity, hydration), improved eye health and reduced eye fatigue, reduced joint inflammation, enhanced athletic endurance, and UV protection from within. Requires 4–8 weeks for visible skin improvements.',
    emoji: '🦩',
    topHooks: ['suppressed-knowledge', 'trend-or-trash', 'comparison'],
  },
  {
    id: 'collagen',
    name: 'Collagen Peptides',
    category: 'Skin & Joints',
    keyBenefit: 'Rebuilds skin elasticity, reduces joint pain, and strengthens hair and nails',
    description: 'Collagen is the most abundant protein in the body, making up 70% of skin and 90% of connective tissue. Production drops 1% per year after age 25 and accelerates with sun exposure, sugar consumption, and stress. Hydrolyzed collagen peptides (Types I and III) are broken down into bioavailable amino acids that stimulate the body\'s own collagen synthesis. Clinical studies show measurable improvements in skin elasticity and hydration within 8–12 weeks, reduced joint pain in active adults, stronger nails, and thicker hair. Best absorbed with Vitamin C, which is a required cofactor for collagen synthesis.',
    emoji: '✨',
    topHooks: ['after-1-month', 'age-reversal', 'instruction-correction'],
  },
  {
    id: 'berberine',
    name: 'Berberine',
    category: 'Metabolic Health',
    keyBenefit: 'Regulates blood sugar, supports weight loss, and improves metabolic health',
    description: 'Berberine is a plant alkaloid found in goldenseal, barberry, and Oregon grape that activates AMPK — the same metabolic pathway targeted by Metformin. Multiple meta-analyses show berberine lowers fasting blood glucose by 20%, reduces HbA1c comparably to pharmaceutical interventions, and improves insulin sensitivity. Additional benefits include reduced LDL cholesterol, lower triglycerides, support for PCOS, and modest but consistent weight reduction. Often called "nature\'s Ozempic" in wellness circles. Best taken with meals at 500mg, 2–3x daily. Onset of metabolic effects typically within 2–4 weeks.',
    emoji: '🌿',
    topHooks: ['suppressed-knowledge', 'comparison', 'trend-or-trash'],
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    category: 'Stress & Hormones',
    keyBenefit: 'Reduces cortisol, improves stress resilience, and supports testosterone levels',
    description: 'Ashwagandha (Withania somnifera) is an adaptogenic herb used in Ayurvedic medicine for over 3,000 years. Clinical trials using KSM-66 extract show a 27–30% reduction in cortisol levels, significant improvements in perceived stress and anxiety, and measurable increases in testosterone and DHEA in men. Benefits include improved sleep quality, reduced brain fog, better workout recovery, enhanced libido, and stabilized mood. Unlike stimulants, it works by regulating the HPA axis rather than masking symptoms. Effects build over 4–8 weeks of consistent use. KSM-66 and Sensoril are the two most clinically validated extracts.',
    emoji: '🧘',
    topHooks: ['after-1-month', 'symptom-checklist', 'storytime'],
  },
  {
    id: 'coq10',
    name: 'CoQ10 (Ubiquinol)',
    category: 'Heart & Energy',
    keyBenefit: 'Powers mitochondrial energy production and protects cardiovascular health',
    description: 'CoQ10 (Coenzyme Q10) is a fat-soluble compound essential for mitochondrial ATP production — the energy currency of every cell. The body\'s production peaks in your 20s and declines 65% by age 80. Statin medications further deplete CoQ10, making supplementation critical for anyone on cholesterol medication. Ubiquinol is the active, reduced form with 3–8x better absorption than standard ubiquinone. Benefits include improved heart function, reduced fatigue, better exercise tolerance, lower blood pressure, and protection against oxidative damage to the heart. Particularly important for anyone over 40 or on statins.',
    emoji: '❤️',
    topHooks: ['warning-signs', 'suppressed-knowledge', 'dosing-authority'],
  },
  {
    id: 'omega3',
    name: 'Omega-3 (Fish Oil)',
    category: 'Brain & Heart',
    keyBenefit: 'Reduces inflammation, supports brain health, and protects cardiovascular function',
    description: 'Omega-3 fatty acids (EPA and DHA) are essential fats the body cannot produce — they must come from diet or supplementation. EPA reduces systemic inflammation and supports cardiovascular health; DHA is the primary structural fat in the brain and retina. The average American gets 10x more omega-6 (inflammatory) than omega-3, creating a chronic inflammatory imbalance. Benefits include reduced triglycerides, lower blood pressure, improved mood and cognitive function, reduced joint inflammation, and better eye health. Look for at minimum 1,000mg combined EPA+DHA per serving. Triglyceride form (not ethyl ester) has significantly better absorption.',
    emoji: '🐟',
    topHooks: ['instruction-correction', 'nad-dosing', 'comparison'],
  },
  {
    id: 'vitamin-d3-k2',
    name: 'Vitamin D3 + K2',
    category: 'Immune & Bone',
    keyBenefit: 'Strengthens immunity, supports bone density, and regulates calcium absorption',
    description: 'Vitamin D3 and K2 are synergistic nutrients that must be taken together for optimal effect. D3 increases calcium absorption from the gut, but without K2 (MK-7 form), that calcium can deposit in arteries instead of bones. Over 40% of Americans are deficient in Vitamin D, linked to increased risk of infections, autoimmune conditions, depression, and bone loss. D3 also regulates over 1,000 genes involved in immune function, mood, and inflammation. K2 activates osteocalcin (directs calcium to bones) and Matrix GLA Protein (prevents arterial calcification). The combination supports bone density, immune resilience, cardiovascular health, and mood regulation. Optimal D3 dose is 2,000–5,000 IU with K2 at 100–200mcg MK-7.',
    emoji: '☀️',
    topHooks: ['warning-signs', 'instruction-correction', 'myth-busting'],
  },
];

export const PRODUCT_CATEGORIES = Array.from(new Set(PRODUCT_LIBRARY.map(p => p.category)));

export function getProductById(id: string): ProductProfile | undefined {
  return PRODUCT_LIBRARY.find(p => p.id === id);
}
