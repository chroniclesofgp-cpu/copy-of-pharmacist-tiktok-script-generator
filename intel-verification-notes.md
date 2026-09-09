# Intel Doc Verification Notes — June 20, 2026

## PMID Verification Results

| PMID | Status | Title (verified) | Author | Journal | Year | Used In |
|---|---|---|---|---|---|---|
| 12100180 | ✅ VERIFIED | The effect of niacinamide on reducing cutaneous pigmentation and suppression of melanosome transfer | Hakozaki T | Br J Dermatol | 2002 Jul | TX Cream, Toner Pad, Eye Patch, Eye Cream |
| 25422651 | ❌ WRONG PMID | Title resolves to a CORD BLOOD CYTOCHROME P450 study — completely unrelated | Kelishadi R | J Res Med Sci | 2014 Aug | TX Cream, Toner Pad |
| 25422661 | ✅ CORRECT PMID for TXA | Topical tranexamic acid as a promising treatment for melasma | Ebrahimi B | J Res Med Sci | 2014 Aug | TX Cream, Toner Pad |
| 27213821 | ✅ VERIFIED | Effects of Turmeric (Curcuma longa) on Skin Health: A Systematic Review | Vaughn AR | Phytother Res | 2016 Aug | Toner Pad, Eye Cream |
| 29853739 | ✅ VERIFIED | Skin Barrier and Calcium | Lee SE | Ann Dermatol | 2018 Jun | Toner Pad, Eye Patch, Eye Cream |
| 31176168 | ❌ WRONG PMID | Title resolves to a HONOKIOL/LUNG CANCER study — completely unrelated | Zhang J | Biomed Pharmacother | 2019 Sep | Toner Pad |
| 30537675 | ✅ CORRECT PMID for Kojic Acid | Kojic acid applications in cosmetic and pharmaceutical preparations | Saeedi M | Biomed Pharmacother | 2019 Feb | Toner Pad |
| 35979986 | ✅ VERIFIED | The possible role of the nucleoside adenosine in countering skin aging: A review | Marucci G | Biofactors | 2022 Sep | Eye Patch |

## Summary of Errors Found
- **PMID 25422651** was cited as the Ebrahimi TXA melasma study — it is NOT. The correct PMID is **25422661**.
- **PMID 31176168** was cited as the Saeedi kojic acid study — it is NOT. The correct PMID is **30537675**.
- Both wrong PMIDs resolve to real but completely unrelated papers. This is the exact error the verification rule was designed to catch.

## INCI Verification — TX Cream (INCIDecoder confirmed)

**Full INCI (INCIDecoder verified):**
Water, Butylene Glycol, Phenyl Trimethicone, Tranexamic Acid, Niacinamide, Butyrospermum Parkii (Shea) Butter, Beeswax, 1,2-Hexanediol, Caprylic/Capric Triglyceride, Terminalia Ferdinandiana Fruit Extract, Myrciaria Dubia Fruit Extract, Castanea Crenata (Chestnut) Shell Extract, Hamamelis Virginiana (Witch Hazel) Leaf Extract, Nelumbium Speciosum Flower Extract, Chrysanthellum Indicum Extract, Perilla Frutescens Leaf Extract, Anthemis Nobilis Flower Extract, Morinda Citrifolia Fruit Extract, Ceramide NP, Panthenol, Decapeptide-40, Sodium Hyaluronate, Glutathione, Acetyl Glucosamine, Hydrolyzed Collagen, Hydrogenated Lecithin, Polyglyceryl-10 Stearate, Glycerin, Cetearyl Alcohol, Polyglyceryl-4 Caprate, Carbomer, Glyceryl Stearate, Arginine, Allantoin, Ethylhexylglycerin, Adenosine, Diethoxyethyl Succinate, Cetyl Ethylhexanoate, Phospholipids, Potassium Cetyl Phosphate, Dextrin, Polylysine, Caprylyl Glycol

**Key additions vs. generated doc (doc was incomplete):**
- Ceramide NP — skin-identical barrier ingredient (significant addition)
- Glutathione — antioxidant brightening agent (significant addition)
- Acetyl Glucosamine — brightening, skin-identical
- Decapeptide-40 — peptide (anti-aging)
- Adenosine — A2A receptor, collagen synthesis (MFDS wrinkle ingredient)
- Witch Hazel extract — soothing, astringent
- Multiple botanical extracts (Terminalia Ferdinandiana = Kakadu Plum, highest natural Vitamin C source)
- Panthenol — pro-vitamin B5, barrier repair
- Sodium Hyaluronate — hydration

**Note on Terminalia Ferdinandiana (Kakadu Plum):** This is a pharmacist-worthy ingredient — it contains the highest known concentration of natural Vitamin C of any fruit (up to 3,000 mg/100g vs. 50 mg/100g in oranges). This is a Tier 2 ingredient that should be mentioned verbally on camera.

**Note on Glutathione:** Oral glutathione is widely used in Southeast Asia for skin brightening. Topical glutathione is less studied but works as an antioxidant and may inhibit melanin synthesis via tyrosinase. This is a pharmacist-only angle — most creators would not know to call this out.

## INCI — Kojic Acid Turmeric TX Toner Pad (TikTok Shop listing verified)

**Full INCI (TikTok Shop listing — only source available, not yet on INCIDecoder):**
Water, Niacinamide, Butylene Glycol, Glycerin, Propanediol, 1,2-Hexanediol, Hyaluronic Acid, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Hydroxyacetophenone, Glycereth-25 PCA Isostearate, Panthenol, Ethylhexylglycerin, Xanthan Gum, Adenosine, Trisodium Ethylenediamine Disuccinate, Citrus Nobilis (Mandarin Orange) Peel Oil, Lavandula Angustifolia (Lavender) Oil, Cedrus Atlantica Wood Oil, Citrus Aurantium Dulcis (Orange) Peel Oil, Rosmarinus Officinalis (Rosemary) Leaf Oil, Centella Asiatica Extract, Curcuma Longa (Turmeric) Root Extract, Gluconolactone, Kojic Acid, Tranexamic Acid, Citrus Limon (Lemon) Peel Oil, Hydrogenated Lecithin, Polyglyceryl-10 Laurate, Sodium Ascorbyl Phosphate, Biotin, Folic Acid, Pyridoxine, Cyanocobalamin, Tocopherol, Beta-Carotene, Riboflavin, Thiamine HCl, Colloidal Sulfur, Hesperidin, Succinic Acid, Glycolic Acid, Dimethylsilanol Hyaluronate, Hydrolyzed Sodium Hyaluronate, Hydroxypropyltrimonium Hyaluronate, Sodium Hyaluronate Crosspolymer, Sodium Hyaluronate Dimethylsilanol, Sodium Acetylated Hyaluronate, Glutathione, Zinc PCA

**Key additions vs. generated doc (doc was incomplete/wrong):**
- The generated doc listed Kojic Acid, TXA, Niacinamide, Turmeric, Adenosine — but the ACTUAL formula is MUCH richer
- Contains Sodium Ascorbyl Phosphate (stable Vitamin C derivative) — FOURTH brightening active not mentioned in generated doc
- Contains Glutathione — fifth brightening active (antioxidant, melanin inhibitor)
- Contains Zinc PCA — sebum-regulating, anti-inflammatory
- Contains Gluconolactone — mild PHA exfoliant (helps with cell turnover for spot fading)
- Contains Glycolic Acid — AHA exfoliant (important: this means the pad IS an exfoliating product — needs SPF disclaimer)
- Contains B-vitamin complex: Biotin, Folic Acid, Pyridoxine (B6), Cyanocobalamin (B12), Riboflavin (B2), Thiamine (B1) — pharmacist-only angle: the B-vitamin skin support complex
- Contains Colloidal Sulfur — anti-inflammatory, antimicrobial (acne-adjacent use case)
- Contains Centella Asiatica — soothing, wound healing
- Contains 6 forms of Hyaluronic Acid — multi-molecular weight hydration
- Contains essential oils (lavender, orange, rosemary, cedar, mandarin, lemon) — NOT fragrance-free. Important for sensitive skin users.
- NOTE: Glycolic Acid presence means this product MUST be followed by SPF in AM — this is a key pharmacist safety point

## INCI — Calcium Volume Eye Patch (INCIDecoder verified)

**Full INCI (INCIDecoder verified — uploaded 02/12/2026):**
Aqua (Water), Glycerin, Butylene Glycol, Niacinamide, Carrageenan, Ceratonia Siliqua (Carob) Gum, Pentylene Glycol, Propanediol, Polyglyceryl-10 Laurate, Cyamopsis Tetragonoloba (Guar) Gum, Cellulose Gum, Pinus Sylvestris Leaf Extract, Ethyl Hexanediol, Hexylene Glycol, Potassium Chloride, Allantoin, Sucrose, Chlorphenesin, Calcium Lactate, Hydroxyacetophenone, Illicium Verum (Anise) Fruit Extract, 1,2-Hexanediol, Calcium Chloride, Dipotassium Glycyrrhizate, Cichorium Intybus (Chicory) Root Oligosaccharides, Ethylhexylglycerin, Adenosine, Disodium EDTA, Arginine, Parfum (Fragrance), Caprylyl Glycol, Prunus Amygdalus Dulcis (Sweet Almond) Fruit Extract, Hydrolyzed Elastin, Hydrolyzed Collagen, Tabebuia Impetiginosa Bark Extract, Tremella Fuciformis (Mushroom) Extract, Collagen Extract, Gluconolactone, Sodium Benzoate, Tin Oxide, Caesalpinia Spinosa Gum, Calcium Gluconate, Mica, Titanium Dioxide (Ci 77891), Iron Oxides (Ci 77491)

**Key notes:**
- Contains Parfum (Fragrance) — NOT fragrance-free. Important for sensitive eye area users.
- Calcium delivered via BOTH Calcium Lactate AND Calcium Gluconate — dual calcium source
- Contains Gluconolactone (PHA exfoliant) — gentle enough for eye area
- Contains Hydrolyzed Elastin + Hydrolyzed Collagen + Collagen Extract — triple structural protein support
- Contains Tremella Fuciformis (Snow Mushroom) — holds 500x its weight in water, superior to HA for hydration
- Contains Tabebuia Impetiginosa Bark Extract — anti-inflammatory, antimicrobial
- Contains Tin Oxide + Mica + Titanium Dioxide + Iron Oxides — cosmetic pigments (gives the patch its appearance)

## INCI — Calcium Intense Volume Eye Cream (INCIDecoder verified)

**IMPORTANT FINDING:** The "Calcium Intense Volume Eye Cream" listed on TikTok Shop is the same product as the **Cemenrete Calcium Intense Cream** (the EX Volume Firming Cream from the Gifted Collagen Boost Set). The INCIDecoder page shows the jar label reading "REBORNIC 10,000" and "EX VOLUME FIRMING." This is NOT an eye cream — it is the same full-face firming cream sold as a standalone product. The TikTok Shop listing title includes "Eye Cream" which appears to be a marketing/SEO choice.

**Full INCI (INCIDecoder verified — uploaded 12/31/2023):**
Water, Butylene Glycol, Propanediol, Glycerin, Macadamia Integrifolia Seed Oil, Olea Europaea (Olive) Fruit Oil, Cetyl Ethylhexanoate, 1,2-Hexanediol, Butyrospermum Parkii (Shea) Butter, Cetearyl Alcohol, Methyl Hydrogenated Rosinate, Niacinamide, Polysorbate 60, Cyclopentasiloxane, Glycereth-26, Glyceryl Stearate, PEG-100 Stearate, Cyclohexasiloxane, Ammonium Acryloyldimethyltaurate/VP Copolymer, Hydrogenated Lecithin, Sorbitan Stearate, Coptis Japonica Root Extract, Cocos Nucifera (Coconut) Oil, Polyacrylate-13, Polyisobutene, Theobroma Cacao (Cocoa) Seed Extract, Ethylhexylglycerin, Polyglyceryl-4 Oleate, Hydrolyzed Gardenia Florida Extract, Hydrolyzed Malt Extract, Adenosine, Hydrolyzed Viola Tricolor Extract, Dextrin, Disodium EDTA, Polysorbate 20, Sorbitan Isostearate, Sodium Glycerophosphate, Ammonium Polyacryloyldimethyl Taurate, Hyaluronic Acid, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Potassium Magnesium Aspartate, Calcium Gluconate, Magnesium Gluconate, Prunus Amygdalus Dulcis (Sweet Almond) Fruit Extract, Tremella Fuciformis (Mushroom) Extract, Tabebuia Impetiginosa Bark Extract, Collagen Extract, Hydrolyzed Elastin

**Key notes:**
- REBORNIC technology present (Calcium Gluconate delivery system)
- Contains Magnesium Gluconate alongside Calcium Gluconate — dual mineral approach
- Contains Potassium Magnesium Aspartate — electrolyte complex for cellular energy
- Fragrance-free (confirmed by INCIDecoder)
- Clinically tested as non-irritant (per INCIDecoder description)
- Contains Macadamia Oil + Olive Oil + Coconut Oil + Shea Butter — rich emollient base
- No REBORNIC Calcium Spicules in this product — the REBORNIC here refers to the calcium gluconate delivery system only
- This product is the same as the EX Volume Firming Cream in the Gifted Collagen Boost Set

## All INCI Checks Complete — Ready to Build Final Docs
