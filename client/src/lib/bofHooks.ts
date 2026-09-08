// BOF (Bottom of Funnel) TikTok Shop Hook Library
// Based on analysis of @momfindsbyfaith, @dealscope, and @dealssforeveryone (50 videos + 20 additional April 2026)
// All hooks confirmed active within last 6 months
//
// REMOVED: Social Proof / Comment Hook (0 example videos — insufficient data)
// MERGED: Always Read Reviews → Returning This (Variation A opener — confirmed in 6 of 10 videos)
// ADDED: templateType field — 'verbatim' | 'hybrid' | 'assembly'

export type BofHookTier = 'primary' | 'viral-trend';
export type BofFormat = 'BOF' | 'BOF+';
export type CouponPlacement = 'none' | 'mid-deal' | 'cta' | 'both';
export type BofTemplateType = 'verbatim' | 'hybrid' | 'assembly';

export interface BofHook {
  id: string;
  name: string;
  tier: BofHookTier;
  format: BofFormat;
  /** verbatim = full template with [slots], LLM only fills variables
   *  hybrid   = verbatim opening hook + verbatim close, middle assembled from line bank
   *  assembly = full line bank assembly (top-3 per position) */
  templateType: BofTemplateType;
  /** BOF = pure deal close, no benefit field in UI.
   *  BOF+ = benefit/proof field shown automatically in UI. */
  requiresBenefitField: boolean;
  frequency: 'very-high' | 'high' | 'medium' | 'low';
  lastConfirmed: string; // Month YYYY
  textHookFormula: string;
  verbalHookFormula: string;
  psychMechanism: string;
  bestFor: string;
  couponPlacement: CouponPlacement;
  exampleVideos: { creator: string; description: string; url: string }[];
  replicationTemplate: string;
  notes?: string;
}

export const BOF_HOOKS: BofHook[] = [
  // ── Primary Hooks ──────────────────────────────────────────────────────────
  {
    id: 'reverse-psychology',
    name: 'Do Not Buy This',
    tier: 'primary',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'very-high',
    lastConfirmed: 'January 2026',
    textHookFormula: 'DO NOT GET THIS [emoji]',
    verbalHookFormula: 'Do not get [product] unless you\'re getting it today because [deal reason].',
    psychMechanism: 'Pattern interrupt — viewer expects a recommendation, gets a warning instead. Brain pauses. Reveal creates relief and purchase momentum.',
    bestFor: 'Any product with an active flash sale or time-limited deal',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@momfindsbyfaith', description: 'e.l.f. Halo Glow Skin Tint — 8.6M views', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7618475887188577549' },
      { creator: '@momfindsbyfaith', description: 'TIRTIR Glide & Hide Concealer', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7557187121044327694' },
      { creator: '@momfindsbyfaith', description: 'Kojic Acid Peel Shot (Medicube)', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7608466941564472590' },
      { creator: '@dealscope', description: 'Goli 3-pack — secret 50% off', url: 'https://www.tiktok.com/@dealscope/video/7560873870882835725' },
      { creator: '@dealscope', description: 'Beauty of Joseon Sunscreen', url: 'https://www.tiktok.com/@dealscope/video/7567182939314769165' },
      { creator: '@dealscope', description: 'Portable Charger', url: 'https://www.tiktok.com/@dealscope/video/7555710981922409742' },
    ],
    replicationTemplate: `TEXT:    DO NOT GET THIS [emoji]
VERBAL:  Do not get [product] unless you're getting it today because [deal].
DEAL:    [Specific mechanics — flash sale / coupon stack / bundle unlock]
HOW-TO:  Tap the orange cart → [steps to claim]
CLOSE:   But that sale ends tonight so tap the cart before [they raise the price / it disappears].`,
  },
  {
    id: 'warning-be-careful',
    name: 'Warning / Be Careful',
    tier: 'primary',
    format: 'BOF',
    templateType: 'hybrid',
    requiresBenefitField: false,
    frequency: 'high',
    lastConfirmed: 'October 2025',
    textHookFormula: 'Warning don\'t get this‼️ [TODAY ONLY / FINAL HOURS]',
    verbalHookFormula: 'Be careful with [product] right now because [reason — better bundle / deal ending / price going up].',
    psychMechanism: 'Protective framing — positions creator as an advocate saving the viewer from a mistake. Softer than Reverse Psychology but equally effective for steering toward a better deal.',
    bestFor: 'When a better bundle exists, or when a deal is about to expire',
    couponPlacement: 'cta',
    exampleVideos: [
      { creator: '@momfindsbyfaith', description: 'JoySpring bundle — Mood Magic free', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7535012284251245879' },
      { creator: '@dealscope', description: 'Medicube big set same price as small', url: 'https://www.tiktok.com/@dealscope/video/7536084977285483789' },
      { creator: '@dealscope', description: 'Colombian shampoo 5-piece set', url: 'https://www.tiktok.com/@dealscope/video/7512905731008613678' },
      { creator: '@dealscope', description: 'Guru Nanda whitening strips 14-day', url: 'https://www.tiktok.com/@dealscope/video/7535975338539601207' },
    ],
    replicationTemplate: `TEXT:    Warning, don't get this [emoji] [TODAY ONLY / FINAL HOURS]
VERBAL:  Be careful with [product] right now because for the same price, you can get [better deal / more product / free gift].
HOW-TO:  Tap the orange cart → [steps]
CLOSE:   But that sale ends tonight so [tap / grab / claim] before you miss it.`,
  },
  {
    id: 'deal-alert',
    name: 'Deal / Discount Alert',
    tier: 'primary',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'high',
    lastConfirmed: 'April 2026',
    textHookFormula: '[PRODUCT] ON SALE — TONIGHT ONLY',
    verbalHookFormula: '[Product] is on a major sale today. This is how you get it.',
    psychMechanism: 'Direct deal lead — no misdirection, just the deal. Works when the discount is genuinely shocking. The viewer\'s job is to act, not to be convinced.',
    bestFor: 'When the deal itself is the story — dramatic price drop, flash sale, or rare discount',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@momfindsbyfaith', description: 'Cocofloss double discount', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7512371709144649003' },
      { creator: '@momfindsbyfaith', description: 'G Toner Pads — final hours', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7488001742982941998' },
      { creator: '@dealscope', description: 'Goli 6-pack same price as 3-pack', url: 'https://www.tiktok.com/@dealscope/video/7538681303315647757' },
      { creator: '@dealscope', description: 'Medicube $25 with code LADOVE24', url: 'https://www.tiktok.com/@dealscope/video/7453638996032376107' },
      { creator: '@dealssforeveryone', description: 'HiaPets Air Purifier — Double Flash Sale (8 videos, April 2026)', url: 'https://www.tiktok.com/@dealssforeveryone/video/7626991609011326239' },
      { creator: '@dealssforeveryone', description: 'Xtreme Muse Camera — Double Flash Sale anticipation opener', url: 'https://www.tiktok.com/@dealssforeveryone/video/7627396773123722527' },
    ],
    replicationTemplate: `TEXT:    [PRODUCT] ON SALE — TONIGHT ONLY
VERBAL:  [Product] is on a major sale today. This is how you get it.
HOW-TO:  Step one, tap the orange cart. [Coupon/bundle steps]. That's [deal description] plus free shipping.
CLOSE:   Hurry up and claim it before [it's too late / the timer runs out / tonight].

Variation B — Double Flash Sale (@dealssforeveryone, 8 of 10 videos, April 2026):
TEXT:    DOUBLE FLASH SALE 🔥 [TODAY ONLY]
VERBAL:  They just dropped the price on [product] only for today. Here's how to claim it.
HOW-TO:  First, tap that orange shopping cart — that's going to lock that first flash sale. Afterwards, claim that coupon in the deals tab — it's going to lock a second major flash sale. And you're also getting fast and free shipping.
CLOSE:   Just make sure you act right now because this sale does end by tonight. So tap that orange shopping cart before you miss out forever.`,
  },
  {
    id: 'bundle-motherload',
    name: 'Bundle / Motherload',
    tier: 'primary',
    format: 'BOF+',
    templateType: 'hybrid',
    requiresBenefitField: true,
    frequency: 'high',
    lastConfirmed: 'December 2025',
    textHookFormula: 'HOLY [BRAND] MOTHERLOAD 🤯',
    verbalHookFormula: 'Holy [brand] motherload, they are spoiling us with this bundle.',
    psychMechanism: 'Quantity anchoring — viewer sees or hears they are getting significantly more than expected. The gap between perceived value and deal price is the hook.',
    bestFor: 'Multi-item bundles, free gift with purchase, or large quantity unlocks',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@momfindsbyfaith', description: 'Cyklar Sacred Santal bundle (52 sec BOF+)', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7590200789482736951' },
      { creator: '@dealscope', description: 'Colombian shampoo armful display', url: 'https://www.tiktok.com/@dealscope/video/7564517366843837710' },
      { creator: '@dealscope', description: 'Medicube display board bundle', url: 'https://www.tiktok.com/@dealscope/video/7582837789331328270' },
      { creator: '@dealscope', description: 'Goli "finesse the box" skit', url: 'https://www.tiktok.com/@dealscope/video/7589541610547858743' },
    ],
    replicationTemplate: `TEXT:    HOLY [BRAND] MOTHERLOAD 🤯 / You get all this [emoji]
VERBAL:  Holy [brand] motherload, they are spoiling us. / You get [list every item in the bundle].
WALKTHROUGH: Hold up each item, name it, give one benefit per item (10 sec max per item).
CLOSE:   But do not wait because that sale is about to end. Grab it before it disappears.`,
  },
  {
    id: 'tiktok-glitch',
    name: 'TikTok Glitch / Hack',
    tier: 'primary',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'medium',
    lastConfirmed: 'November 2025',
    textHookFormula: 'TikTok Glitch 😱',
    verbalHookFormula: 'I just found out about this TikTok Shop glitch. You can get [product] for [price]. I\'m not joking.',
    psychMechanism: 'Insider framing — viewer feels they are getting information they are not supposed to have. Urgency is built in — glitches get fixed.',
    bestFor: 'Extreme deals only — 90%+ off, penny pricing, or 5-for-1 type mechanics',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@dealscope', description: 'Sunscreen penny deal', url: 'https://www.tiktok.com/@dealscope/video/7567576953432116535' },
      { creator: '@dealscope', description: '5 sunscreens almost free', url: 'https://www.tiktok.com/@dealscope/video/7567575304588365111' },
      { creator: '@dealscope', description: 'Beauty of Joseon — add 5 same price as 1', url: 'https://www.tiktok.com/@dealscope/video/7567238698488696077' },
    ],
    replicationTemplate: `TEXT:    TikTok Glitch 😱 / I got [X] for [price] 😳
VERBAL:  I just found out about this TikTok Shop glitch. You can get [product] for [price]. I'm not joking.
HOW-TO:  [Step-by-step — tap cart, add X quantity, apply coupon]
CLOSE:   Go do it now before they fix it. / Hurry up before they run out of stock.`,
    notes: 'DEALSCOPE ONLY — @momfindsbyfaith does not use this hook. Do not use for standard deals. The glitch framing requires a deal that feels impossible at face value (90%+ off, penny pricing, or 5-for-1 type mechanics). Three confirmed example videos from Oct–Nov 2025 — all converted. Keep until evidence of declining performance.',
  },
  {
    id: 'comparison-upgrade',
    name: 'Comparison / Upgrade',
    tier: 'primary',
    format: 'BOF',
    templateType: 'hybrid',
    requiresBenefitField: false,
    frequency: 'medium',
    lastConfirmed: 'August 2025',
    textHookFormula: 'Stop buying this [product]! Get [better version] here [emoji]',
    verbalHookFormula: 'Do not buy the [smaller/wrong version]. Get [the bigger/better one] instead. It\'s the same price because right now [deal reason].',
    psychMechanism: 'Advocate positioning — creator protects the viewer from a mistake. Steers toward a better SKU or bundle available for the same price due to the current deal.',
    bestFor: 'When a larger size, better bundle, or different SKU is available for the same price or less',
    couponPlacement: 'none',
    exampleVideos: [
      { creator: '@dealscope', description: 'Medicube small vs big set', url: 'https://www.tiktok.com/@dealscope/video/7536084977285483789' },
      { creator: '@dealscope', description: 'Whitening strips small vs 14-day', url: 'https://www.tiktok.com/@dealscope/video/7535975338539601207' },
      { creator: '@momfindsbyfaith', description: 'JoySpring Para Patrol + Mood Magic free', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7535012284251245879' },
    ],
    replicationTemplate: `TEXT:    Stop buying this [product]! Get [better version] here [emoji]
VERBAL:  Do not buy the [smaller/wrong version]. Get [this one] instead. It's the same price because right now [deal].
HOW-TO:  [Steps to claim the better deal]
CLOSE:   Hurry up before [it goes back up / the timer runs out].`,
  },
  // REMOVED: Price Anchor (1 video from Oct 2025 — insufficient data, low conversion confidence)
  {
    id: 'quantity-math',
    name: 'Quantity Math Hook',
    tier: 'primary',
    format: 'BOF',
    templateType: 'hybrid',
    requiresBenefitField: false,
    frequency: 'medium',
    lastConfirmed: 'September 2025',
    textHookFormula: 'Add [X] boxes to unlock sale',
    verbalHookFormula: 'If you add [X] to your cart, you unlock [deal] and you\'re getting [X units] for [price]. That\'s [price per unit] each.',
    psychMechanism: 'Math transparency — showing the per-unit math makes the deal feel calculated and trustworthy rather than vague.',
    bestFor: 'Consumables or products people buy in bulk where a quantity threshold unlocks a meaningfully better per-unit price',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@dealscope', description: 'Goli 6-pack same price as 3-pack', url: 'https://www.tiktok.com/@dealscope/video/7538681303315647757' },
      { creator: '@dealscope', description: 'Goli all 9 bottles — best per-unit price', url: 'https://www.tiktok.com/@dealscope/video/7550927264662244621' },
      { creator: '@momfindsbyfaith', description: 'G Toner Pads — add 2 to unlock coupon', url: 'https://www.tiktok.com/@momfindsbyfaith/video/7488001742982941998' },
    ],
    replicationTemplate: `TEXT:    Add [X] to unlock sale / [X] for the price of [Y]
VERBAL:  If you add [X] to your cart, you unlock [deal] and you're getting [X units] for [price]. That's [price per unit] each.
HOW-TO:  [Steps to add quantity and claim]
CLOSE:   [Urgency close]`,
  },
  // ── Viral Trend Hooks ──────────────────────────────────────────────────────
  {
    id: 'returning-this',
    name: 'I\'m Returning This',
    tier: 'viral-trend',
    format: 'BOF+',
    templateType: 'verbatim',
    requiresBenefitField: true,
    frequency: 'high',
    lastConfirmed: 'April 2026',
    textHookFormula: 'Sending this back! / I\'m returning this 💔',
    verbalHookFormula: 'Rule number one, always read the reviews when it comes to TikTok, because I got [product] and now I have to return it.',
    psychMechanism: 'Narrative reversal — viewer expects a negative review or complaint, gets a deal reveal instead. The "negative list" (it\'s not because X, Y, or Z) builds product credibility while creating suspense about the real reason.',
    bestFor: 'Bundle upgrade angle (returning individual items for the bundle deal). Creator buys individual items, then reveals the bundle is on sale for less.',
    couponPlacement: 'both',
    exampleVideos: [
      { creator: '@momfindsbyfaith', description: 'Physician\'s Choice Gut Guardian 3-pack — bundle pivot + coupon gamification', url: 'https://www.tiktok.com/t/ZTkD17M3d/' },
      { creator: '@momfindsbyfaith', description: 'Returning This videos — April 2026 batch (10 videos analyzed)', url: 'https://www.tiktok.com/@momfindsbyfaith' },
    ],
    replicationTemplate: `TEXT:    Sending this back! / I'm returning this 💔 / Still returning this 😭

VARIATION A — REVIEWS OPENER (most common — 6 of 10 videos):
VERBAL:  Rule number one, always read the reviews when it comes to TikTok, because I got [product] and now I have to return it.
NEGATIVE LIST: It's not because [benefit 1], and it's not [benefit 2], or the fact that [benefit 3], and it's not even [benefit 4].
PIVOT:   I'm returning it because I actually bought [individual items] separately, when right now [brand] just released their [bundle name].
DEAL:    You can get all of this in a bundle on a massive discount with free shipping and some of you even have coupons today. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one.
CLOSE:   So don't be like me and overpay by getting these separately because that sale price makes it the best deal today. If you still see that cart, I would run before it disappears.

VARIATION B — DIRECT RETURN OPENER (4 of 10 videos):
VERBAL:  I'm definitely returning this [product] because I got it at full price when you can now get all of this on a major discount with free shipping.
[Same negative list, pivot, deal, and close structure as Variation A]`,
    notes: 'FAITH ONLY — @dealscope does not use this hook. Coupon gamification is nearly universal (9 of 10 videos). The "don\'t be like me" close formula is the most consistent element across all 10 analyzed videos. Always Read Reviews is now the Variation A opener for this hook — they are the same hook, not separate.',
  },

  // ── New Creator Hooks (@blackfridaybrian + @welearn2earn) ─────────────────
  {
    id: 'fake-outrage',
    name: 'Fake Outrage / Throwing This Away',
    tier: 'viral-trend',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'very-high',
    lastConfirmed: 'May 2026',
    textHookFormula: 'I\'m throwing this in the trash 🗑️ / I\'m so mad at this company right now 😤',
    verbalHookFormula: 'Throwing this shit in the trash. [PRODUCT] by [BRAND]. And it\'s not the [formula/ingredients/product].',
    psychMechanism: 'Fake outrage pattern interrupt — viewer expects a negative review, gets a deal reveal instead. The "it\'s not the formula" pivot builds product credibility while the real complaint (the price) creates urgency.',
    bestFor: 'Health/wellness products with multiple ingredients — the "deep dive" credibility line works best when you can name 2-4 specific ingredients',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@blackfridaybrian', description: 'Fake outrage opener — cart-tap flash sale mechanic', url: 'https://www.tiktok.com/@blackfridaybrian/video/7637054064731098382' },
    ],
    replicationTemplate: `TEXT:    I'm throwing this in the trash 🗑️ / I'm so mad at this company right now 😤
VERBAL:  Throwing this shit in the trash. [PRODUCT] by [BRAND]. And it's not the [formula/ingredients/product].
CREDIBILITY: I did a deep dive with AI. Every one of these ingredients has some pretty cool-looking backing. They work synergistically together. / Like, [INGREDIENT 1], [INGREDIENT 2], [INGREDIENT 3] — multiple things that work well together. That's why they got so many five-star reviews.
PIVOT:   The reason I'm pissed off at this company is because when you tap on that cart and add two,
DEAL:    it activates a flash sale — way better deal than buying one.
CLOSE:   So whatever you do, do not overpay. Tap on that cart while it's still on sale, because you know the sale's gonna be ending very soon.`,
    notes: '@blackfridaybrian ONLY. The "deep dive with AI" credibility line is his signature — use it when possible. Always name 2-4 specific ingredients. The cart-tap mechanic (add two to activate flash sale) is unique to his hook structure.',
  },
  {
    id: 'hope-you-didnt-buy',
    name: 'Hope You Didn\'t Buy',
    tier: 'viral-trend',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'very-high',
    lastConfirmed: 'May 2026',
    textHookFormula: 'Hope you didn\'t buy this 🛑 / Don\'t buy this until you watch this 🛑',
    verbalHookFormula: 'Hope you didn\'t buy that expensive [PRODUCT] when today you can get [it/a new one] for next to nothing.',
    psychMechanism: 'Protective framing — positions creator as an advocate saving the viewer from overpaying. The "for next to nothing" contrast creates immediate deal anticipation.',
    bestFor: 'Any product with an active flash sale — works especially well for everyday consumer goods (beauty, home, tech accessories)',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@welearn2earn', description: 'Rice water hair product — hope you didn\'t buy opener', url: 'https://www.tiktok.com/@welearn2earn/video/7637291956992773390' },
    ],
    replicationTemplate: `TEXT:    Hope you didn't buy this 🛑
VERBAL:  Hope you didn't buy that expensive [PRODUCT] when today you can get [it/a new one] for next to nothing.
DEAL:    When you tapped it on a shopping cart, it's gonna activate a limited flash sale.
DEMO:    [Simple product demo — show it working, name the key benefit in 1-2 sentences]
CTA:     Whatever you do, do not overpay. Tap it on a shopping cart to get you some of this while it's on sale,
CLOSE:   because you know the sale's gonna be ending very soon.`,
    notes: '@welearn2earn ONLY. The "for next to nothing" opener and "because you know the sale\'s gonna be ending very soon" close are his most consistent verbatim lines — use them exactly. The demo section is always brief (1-2 sentences showing the product works).',
  },
  {
    id: 'got-robbed',
    name: 'You Got Robbed',
    tier: 'viral-trend',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'high',
    lastConfirmed: 'May 2026',
    textHookFormula: 'You got robbed 🚨 / They\'re robbing you 🚨',
    verbalHookFormula: 'Your ass got robbed if you went and bought this expensive [PRODUCT], when today you can get it for next to nothing.',
    psychMechanism: 'Accusatory protective framing — more aggressive version of Hope You Didn\'t Buy. The "got robbed" framing positions the retailer as the villain and the creator as the hero saving the viewer from being exploited.',
    bestFor: 'Products where the retail price feels exploitative — utilities, everyday essentials, anything with a clear price gap',
    couponPlacement: 'mid-deal',
    exampleVideos: [
      { creator: '@welearn2earn', description: '360 phone mount — got robbed opener', url: 'https://www.tiktok.com/@welearn2earn/video/7637289266447518990' },
    ],
    replicationTemplate: `TEXT:    You got robbed 🚨
VERBAL:  Your ass got robbed if you went and bought this expensive [PRODUCT], when today you can get it for next to nothing.
DEAL:    When you tapped it on a shopping cart, that's gonna activate a limited flash sale.
DEMO:    Y'all, this [PRODUCT] [key feature], making it perfect to use for [use case 1], or maybe [use case 2].
CTA:     So quit giving them folks all their money. Tap it on a shopping cart to get you a few of these while they're on sale,
CLOSE:   because you know the sale's gonna be ending very soon.`,
    notes: '@welearn2earn ONLY. Same structural formula as hope-you-didnt-buy but more aggressive tone. The "quit giving them folks all their money" mid-CTA is unique to this hook — it reinforces the villain framing from the opener. The close is identical to hope-you-didnt-buy.',
  },
  {
    id: 'counting-hook',
    name: 'Not 1, Not 2... But [N]',
    tier: 'viral-trend',
    format: 'BOF',
    templateType: 'verbatim',
    requiresBenefitField: false,
    frequency: 'high',
    lastConfirmed: 'May 2026',
    textHookFormula: 'Not 1, not 2, not 3... but [N]? 🤯',
    verbalHookFormula: 'Not one, not two, not three, not four, but [N]? Have you seen all these [BRAND] products they\'re giving us at this discount?',
    psychMechanism: 'Escalating count creates anticipation and disbelief — each number raises the stakes before the reveal. The value anchor ("over $X worth of products") immediately quantifies the deal size. Works exclusively for multi-item bundles where quantity itself is the hook.',
    bestFor: 'Multi-item bundles (4+ items) where the quantity at the price point is the main selling point. Skincare sets, wellness bundles, tool kits.',
    couponPlacement: 'none',
    exampleVideos: [
      { creator: '@cakedfinds', description: 'Dr. Melaxin 5-piece bundle — counting hook with value anchor', url: 'https://www.tiktok.com/@cakedfinds/video/7629931787937991966' },
    ],
    replicationTemplate: `TEXT:    Not 1, not 2, not 3... but [N]? 🤯
VERBAL:  Not one, not two, not three, [continue count], but [N]? Have you seen all these [BRAND] products they're giving us at this discount?
VALUE:   I got this whole [box/set/bundle]. This is over $[VALUE] worth of products.
LIST:    [ITEM 1], [ITEM 2], [ITEM 3]... [ITEM N] — an entire [routine/kit/set].
CTA:     Check your price and read those reviews.
CLOSE:   If anyone wants to try it, definitely get it now because I have a feeling this sale is going to sell them out again.`,
    notes: 'BUNDLE ONLY — requires 4+ items to work. The count in the opener must match the actual number of items. The value anchor ("over $X worth") is required — without it the count loses impact. Items are listed by name only in the base version; the Generate Benefit Lines feature adds a short benefit tag per item as an enhanced variation.',
  },
];

// 6-video testing sequence with coupon placement weighting
// Coupon language appears in videos 2, 4, and 6 — weighted but not every script
export const BOF_TESTING_SEQUENCE: {
  position: number;
  hookId: string;
  format: BofFormat;
  includeCoupon: boolean;
  rationale: string;
}[] = [
  {
    position: 1,
    hookId: 'reverse-psychology',
    format: 'BOF',
    includeCoupon: false,
    rationale: 'Baseline test — the dominant hook. Always first. Pure deal close, no coupon language.',
  },
  {
    position: 2,
    hookId: 'deal-alert',
    format: 'BOF',
    includeCoupon: true,
    rationale: 'Test whether the deal itself is the story. Include coupon language mid-deal to drive checkout clicks.',
  },
  {
    position: 3,
    hookId: 'warning-be-careful',
    format: 'BOF',
    includeCoupon: false,
    rationale: 'Test the protective/advisory angle. Clean close — no coupon language.',
  },
  {
    position: 4,
    hookId: 'returning-this',
    format: 'BOF+',
    includeCoupon: true,
    rationale: 'Test narrative reversal angle — returns/review opener pivots to bundle deal. Coupon gamification nearly universal for this hook.',
  },
  {
    position: 5,
    hookId: 'comparison-upgrade',
    format: 'BOF',
    includeCoupon: false,
    rationale: 'Test if there is a better version or bundle angle. Clean close.',
  },
  {
    position: 6,
    hookId: 'quantity-math',
    format: 'BOF',
    includeCoupon: true,
    rationale: 'Test quantity unlock math angle. Coupon language in CTA to drive checkout.',
  },
];

export const BOF_DEAL_TYPES = [
  { id: 'flash-sale', label: 'Flash Sale', description: 'Active TikTok Shop flash sale — tap the orange cart to activate' },
  { id: 'coupon', label: 'Coupon in Deals Tab', description: 'Coupon must be manually claimed in the deals tab' },
  { id: 'creator-code', label: 'Creator Code', description: 'Code applied at checkout for additional discount' },
  { id: 'quantity-unlock', label: 'Quantity Unlock', description: 'Add X units to cart to unlock a bundle coupon' },
  { id: 'free-shipping', label: 'Free Shipping', description: 'Free shipping included with the deal' },
  { id: 'free-gift', label: 'Free Gift with Purchase', description: 'Free item included when you add to cart' },
] as const;

export type BofDealTypeId = typeof BOF_DEAL_TYPES[number]['id'];

// Verbatim coupon gamification lines from @momfindsbyfaith and @dealscope
// These drive checkout clicks even without a confirmed coupon — the gamification IS the mechanism
export const COUPON_LANGUAGE_VARIANTS = [
  // Verbatim from @momfindsbyfaith Physician\'s Choice Gut Guardian video (Jan 2026)
  'Tap the cart and go to checkout to see if you have a coupon — not everyone sees those coupons.',
  // Verbatim from @momfindsbyfaith e.l.f. Halo Glow video
  'And some of you even see a coupon, so make sure you tap that cart to see if you have one.',
  // Verbatim from @momfindsbyfaith multiple videos
  'Scroll down and claim the coupons in the deals tab.',
  // Verbatim from @momfindsbyfaith multiple videos
  'Add two to your cart to unlock that TikTok Shop coupon.',
  // Verbatim from @dealscope multiple videos
  'And then at the checkout page where it says deals, claim that coupon.',
  // Verbatim from @dealssforeveryone — Double Flash Sale framing (8 of 10 videos, April 2026)
  // Reframes coupon as unlocking a second sale, not just a discount — additive psychology
  'Claim that coupon in the deals tab — it\'s going to lock a second major flash sale.',
];
