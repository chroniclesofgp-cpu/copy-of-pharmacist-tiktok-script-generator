/**
 * BOF LINE BANK + VERBATIM TEMPLATES
 * Sources: 110 analyzed videos by @momfindsbyfaith, @dealscope, and @dealssforeveryone
 *          - 25 Faith popular (top performing)
 *          - 25 Faith latest (most recent, April 2026)
 *          - 25 Dealscope popular (top performing)
 *          - 25 Dealscope latest (most recent, April 2026)
 *          - 10 @dealssforeveryone latest (April 2026) — "Double Flash Sale" deal-alert variant
 *
 * ARCHITECTURE:
 * - VERBATIM TEMPLATE hooks (4): Reverse Psychology, Deal Alert, TikTok Glitch, Returning This
 *   → LLM fills in [variables] only. No line selection. No assembly.
 * - HYBRID BOOKEND hooks (4): Warning/Be Careful, Bundle/Motherload, Comparison/Upgrade, Quantity Math
 *   → Verbatim opening hook + verbatim urgency close. Middle assembled from line bank.
 * - LINE BANK ASSEMBLY hooks (1): Price Anchor
 *   → Full line bank assembly with top-3 filtering.
 *
 * REMOVED: Social Proof / Comment Hook (0 example videos — insufficient data)
 * MERGED: Always Read Reviews → Returning This (Variation A opener)
 *
 * SHOP CONTENT ONLY — personal/lifestyle videos excluded from analysis.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineVariant {
  line: string;
  creator: '@momfindsbyfaith' | '@dealscope' | '@dealssforeveryone' | '@blackfridaybrian' | '@welearn2earn' | 'both';
  frequency: 'very-high' | 'high' | 'medium' | 'low';
  dealTypes?: string[]; // which deal types this line is appropriate for
  notes?: string;
}

export interface HookLineBank {
  hookId: string;
  format: 'BOF' | 'BOF+';
  templateType: 'verbatim' | 'hybrid' | 'assembly';
  textHooks: LineVariant[];
  verbalHooks: LineVariant[];
  dealRevealOpeners: LineVariant[];
  howToLines: LineVariant[];
  proofLines?: LineVariant[]; // BOF+ only
  couponLines: LineVariant[];
  urgencyCloses: LineVariant[];
}

// ─── Verbatim Templates ───────────────────────────────────────────────────────
// For verbatim-template hooks, the LLM receives the full template with [slots]
// and only substitutes product-specific variables.

export interface VerbatimTemplate {
  hookId: string;
  creator: '@momfindsbyfaith' | '@dealscope' | '@dealssforeveryone' | '@blackfridaybrian' | '@welearn2earn' | 'both';
  description: string;
  template: string; // Full script template with [PRODUCT], [DEAL], [PRICE], [CODE] slots
  slots: string[]; // List of required slot names
}

export const VERBATIM_TEMPLATES: Record<string, VerbatimTemplate[]> = {

  // ── Reverse Psychology — Faith version ──────────────────────────────────────
  'reverse-psychology': [
    {
      hookId: 'reverse-psychology',
      creator: '@momfindsbyfaith',
      description: 'Faith standard — flash sale + coupon (most common pattern)',
      template: `TEXT: DO NOT GET THIS [EMOJI]

Do not get [PRODUCT] unless you're getting it today because [DEAL_REASON].

When you tap the orange shopping cart, you'll unlock a major flash sale and fast and free shipping. And some of you will even see a coupon at checkout — not everyone sees those coupons and it's for a limited time.

But that sale ends [DEADLINE], so grab it before they raise the price.`,
      slots: ['PRODUCT', 'DEAL_REASON', 'EMOJI', 'DEADLINE'],
    },
    {
      hookId: 'reverse-psychology',
      creator: '@momfindsbyfaith',
      description: 'Faith — targeted audience opener (e.g. "Acne girlies", "Dry skin girlies")',
      template: `TEXT: DO NOT GET THIS [EMOJI]

[AUDIENCE] do not get [PRODUCT] by itself because they just released a [BUNDLE_SIZE]-pack and it's on sale and there's free shipping and some of you even have coupons today. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one.

[ONE_BENEFIT_SENTENCE].

So don't be like me and overpay — make sure you add the [BUNDLE_SIZE]-pack because that sale price makes it the best deal today.`,
      slots: ['PRODUCT', 'AUDIENCE', 'BUNDLE_SIZE', 'ONE_BENEFIT_SENTENCE', 'EMOJI'],
    },
    {
      hookId: 'reverse-psychology',
      creator: '@dealscope',
      description: 'Dealscope version — quantity/bundle angle',
      template: `TEXT: DO NOT BUY [PRODUCT] [EMOJI]

Do not buy this [PRODUCT]. At least not until you know this.

Here's how to get it. Step one, tap the orange cart and add [QUANTITY] to your order. That's going to activate your flash sale and fast and free shipping.

Hurry up and get it before it's too late.`,
      slots: ['PRODUCT', 'EMOJI', 'QUANTITY'],
    },
    {
      hookId: 'reverse-psychology',
      creator: '@dealscope',
      description: 'Dealscope — "do not buy the X pack" quantity upgrade',
      template: `TEXT: DO NOT BUY THIS [QUANTITY] PACK [EMOJI]

Do not buy this [QUANTITY]-pack of [PRODUCT] cause right now you can actually get double for almost the same price. This is how.

First tap on the orange shopping cart and add [DOUBLE_QUANTITY] to your order. That's going to activate both of the TikTok coupons located on the deals tab. [COUPON_DETAILS]. [DEAL_STACK_DESCRIPTION].

Hurry up and get it.`,
      slots: ['PRODUCT', 'QUANTITY', 'DOUBLE_QUANTITY', 'COUPON_DETAILS', 'DEAL_STACK_DESCRIPTION', 'EMOJI'],
    },
  ],

  // ── Deal Alert — Faith version ───────────────────────────────────────────────
  'deal-alert': [
    {
      hookId: 'deal-alert',
      creator: '@momfindsbyfaith',
      description: 'Faith standard — double discount with coupon',
      template: `TEXT: [PRODUCT] DOUBLE DISCOUNT — SALE ENDS TONIGHT

[PRODUCT] is on a major double discount today. This is how.

Tap the orange cart to activate a major flash sale and fast and free shipping. And some of you will even see a coupon at checkout — not everyone sees those coupons and it's for a limited time.

But that sale ends [DEADLINE], so grab it before they raise the price.`,
      slots: ['PRODUCT', 'DEADLINE'],
    },
    {
      hookId: 'deal-alert',
      creator: '@momfindsbyfaith',
      description: 'Faith — "Final hours" triple discount',
      template: `TEXT: TRIPLE DISCOUNT — FINAL HOURS

Final hours to get [PRODUCT] on a major triple discount. Here's how.

Tap the orange cart to activate a major flash sale and fast and free shipping and make sure you add the [BUNDLE_SIZE]-pack to your cart and claim that coupon in the deals tab. The total is going to be less than the price of [COMPARISON] when it's not on sale and you're getting [BONUS_ITEM] for practically free.

But that sale ends tonight, so if you want to grab this up, do it before it's gone.`,
      slots: ['PRODUCT', 'BUNDLE_SIZE', 'COMPARISON', 'BONUS_ITEM'],
    },
    {
      hookId: 'deal-alert',
      creator: '@dealscope',
      description: 'Dealscope version — triple discount with CREATORPICK code',
      template: `TEXT: [PRODUCT] ON SALE — TONIGHT ONLY

[PRODUCT] is on a major triple discount today. I'm going to show you how to do it.

Step one, tap the orange cart and add [QUANTITY] to your order. That's going to activate the flash sale and free shipping. Then go to the deals tab and use all your TikTok coupons. If you have no coupons, type in code CREATORPICK in all capital letters. That way you have a triple discount with free shipping.

Hurry up and claim it before it's too late and the timer runs out.`,
      slots: ['PRODUCT', 'QUANTITY'],
    },
    {
      hookId: 'deal-alert',
      creator: '@dealscope',
      description: 'Dealscope — liquidation sale framing',
      template: `TEXT: How is this less than $[PRICE]??

How is this less than [PRICE]? Because [BRAND] is having their liquidation sale today and it ends at midnight.

To take advantage, just click right here and add [QUANTITY] to your order and then use all the TikTok coupons located on the deals tab. If you have no coupons, type in code CREATORPICK in all capital letters. That way you have a triple discount with free shipping on all orders.

Hurry up and get it. Do not miss out.`,
      slots: ['PRODUCT', 'BRAND', 'PRICE', 'QUANTITY'],
    },
    {
      hookId: 'deal-alert',
      creator: '@dealssforeveryone',
      description: '@dealssforeveryone — Double Flash Sale (8 of 10 videos, April 2026)',
      template: `TEXT: DOUBLE FLASH SALE 🔥 [TODAY ONLY]

They just dropped the price on [PRODUCT] only for today. Here's how to claim it.

First, tap that orange shopping cart right there — that's going to lock that first flash sale. Afterwards, claim that coupon in the deals tab — it's going to lock a second major flash sale. And you're also getting fast and free shipping.

Just make sure you act right now because this sale does end by tonight. So tap that orange shopping cart before you miss out forever.`,
      slots: ['PRODUCT'],
    },
    {
      hookId: 'deal-alert',
      creator: '@dealssforeveryone',
      description: '@dealssforeveryone — Double Flash Sale with anticipation opener',
      template: `TEXT: They just dropped the price 👀 [TONIGHT ONLY]

They finally put this one on sale. They just dropped the price on [PRODUCT] only for today. Here's how to claim it.

First, tap that orange shopping cart right there — that's going to lock that first flash sale. Afterwards, claim that coupon in the deals tab — it's going to lock a second major flash sale. And you're also getting fast and free shipping.

Just make sure you act right now because this sale does end by tonight. So tap that orange shopping cart before you miss out forever.`,
      slots: ['PRODUCT'],
    },
  ],

  // ── TikTok Glitch — Dealscope only ──────────────────────────────────────────
  'tiktok-glitch': [
    {
      hookId: 'tiktok-glitch',
      creator: '@dealscope',
      description: 'Dealscope standard — extreme deal price',
      template: `TEXT: TikTok Glitch 😱

I just found out about this TikTok Shop glitch. You can get [PRODUCT] for [GLITCH_PRICE — a real deal price, e.g. "$2.99" or "$0.99", never "a penny"]. I'm not joking.

So I'm gonna show you how to do it. First, you're gonna go to the TikTok Shop, you're gonna search up '[PRODUCT]'. You're gonna click on the first one that pops up, and then you're gonna scroll down and you're gonna see a coupon for [COUPON_AMOUNT] off. You're gonna click on that coupon, and then you're gonna click 'buy now'.

Go do it now before they fix it.`,
      slots: ['PRODUCT', 'GLITCH_PRICE', 'COUPON_AMOUNT'],
    },
    {
      hookId: 'tiktok-glitch',
      creator: '@dealscope',
      description: 'Dealscope quantity version',
      template: `TEXT: I got [QUANTITY] for [PRICE] ???? DAYUMM

Okay, so I just found out about this TikTok Shop glitch. You can get [QUANTITY] of these [PRODUCT] for [PRICE]. I'm not joking.

Here's how. Step one, tap the orange cart and add [QUANTITY] to your order. Scroll down and claim the [COUPON_AMOUNT] coupons in the deals tab.

Hurry up before they run out of stock.`,
      slots: ['PRODUCT', 'QUANTITY', 'PRICE', 'COUPON_AMOUNT'],
    },
  ],

  // ── Returning This — Faith only (merged with Always Read Reviews) ─────────────
  'returning-this': [
    {
      hookId: 'returning-this',
      creator: '@momfindsbyfaith',
      description: 'Variation A — Reviews opener (most common, confirmed across multiple videos)',
      template: `TEXT: Sending this back! / I'm returning this 💔

Rule number one, always read the reviews when it comes to TikTok, because I got [PRODUCT] and now I have to return it.

It's not because [BENEFIT_1], and it's not [BENEFIT_2], or the fact that [BENEFIT_3][BENEFIT_4_OPTIONAL], and it's not even [BENEFIT_5_OPTIONAL].

I'm returning it because I actually bought [INDIVIDUAL_ITEMS] separately, when right now [BRAND] just released their [BUNDLE_NAME] and you can get all of this in a bundle on a massive discount with free shipping and some of you even have coupons today. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one.

So don't be like me and overpay by getting these separately because that sale price makes it the best deal today. If you still see that cart, I would run before it disappears.`,
      slots: ['PRODUCT', 'BENEFIT_1', 'BENEFIT_2', 'BENEFIT_3', 'BENEFIT_4_OPTIONAL', 'BENEFIT_5_OPTIONAL', 'INDIVIDUAL_ITEMS', 'BRAND', 'BUNDLE_NAME'],
    },
    {
      hookId: 'returning-this',
      creator: '@momfindsbyfaith',
      description: 'Variation B — Direct return opener',
      template: `TEXT: I'm so returning this 😭

I'm definitely returning this [PRODUCT].

It's not because [BENEFIT_1], and it's not [BENEFIT_2], or the fact that [BENEFIT_3][BENEFIT_4_OPTIONAL].

But the reason for why I'm returning it, right after I paid full price for this, [BRAND] put it on a huge discount with free shipping and then put a coupon on it. And it's on sale with free shipping and some of you even have coupons. Not everyone sees a coupon and it's for a limited time so you'll have to go to checkout to see if you have one.

So don't be like me and overpay because that sale ends soon and you don't wanna miss it. If you still see that cart, I would grab it before it disappears.`,
      slots: ['PRODUCT', 'BENEFIT_1', 'BENEFIT_2', 'BENEFIT_3', 'BENEFIT_4_OPTIONAL', 'BRAND'],
    },
    {
      hookId: 'returning-this',
      creator: '@momfindsbyfaith',
      description: 'Variation A — Nurse reference opener (variant of A)',
      template: `TEXT: Still returning this 😭

See the nurse on here who said to always read the reviews when you get something on TikTok? Well, I got [PRODUCT] and now I have to return it.

It's not because [BENEFIT_1], and it's not [BENEFIT_2], or the fact that [BENEFIT_3][BENEFIT_4_OPTIONAL].

I'm returning it because I just got the one pack. But then they put the [BUNDLE_NAME] on sale with free shipping and there's a coupon that some of you have. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one.

So don't be like me and get these separately because that bundle sale price makes it the best deal today. I'll drop the link right here. Grab it before it's gone.`,
      slots: ['PRODUCT', 'BENEFIT_1', 'BENEFIT_2', 'BENEFIT_3', 'BENEFIT_4_OPTIONAL', 'BUNDLE_NAME'],
    },
    {
      hookId: 'returning-this',
      creator: '@blackfridaybrian',
      description: 'Variation C — Brian compressed pivot (fake-out negative → quick ingredient defense → cart-tap deal reveal)',
      template: `TEXT: I'm throwing this in the trash 🗑️ / I'm so mad at this company 😤

I'm throwing this [PRODUCT] in the trash. And it's not the formula — [QUICK_BENEFIT]. The reason I'm pissed off at this company is because when you tap on that cart and add [QUANTITY], it's a way better deal.

[HOW_TO_LINE]

But whatever you do, do not pay full price because that deal is going to be ending very soon.`,
      slots: ['PRODUCT', 'QUICK_BENEFIT', 'QUANTITY'],
    },
  ],

  // ── Fake Outrage (@blackfridaybrian) ─────────────────────────────────────────
  'fake-outrage': [
    {
      hookId: 'fake-outrage',
      creator: '@blackfridaybrian',
      description: 'Standard — fake outrage opener → ingredient credibility → cart-tap deal reveal',
      template: `TEXT: I'm throwing this in the trash 🗑️

Throwing this shit in the trash. [PRODUCT] by [BRAND]. And it's not the [FORMULA_OR_INGREDIENTS].

I did a deep dive with AI. Every one of these ingredients has some pretty cool-looking backing. They work synergistically together. Like, [INGREDIENT_1], [INGREDIENT_2], [INGREDIENT_3] — multiple things that work well together. That's why they got so many five-star reviews.

The reason I'm pissed off at this company is because when you tap on that cart and add two, it activates a flash sale — way better deal than buying one.

So whatever you do, do not overpay. Tap on that cart while it's still on sale, because you know the sale's gonna be ending very soon.`,
      slots: ['PRODUCT', 'BRAND', 'FORMULA_OR_INGREDIENTS', 'INGREDIENT_1', 'INGREDIENT_2', 'INGREDIENT_3'],
    },
    {
      hookId: 'fake-outrage',
      creator: '@blackfridaybrian',
      description: 'Variation B — mad-at-company opener',
      template: `TEXT: I'm so mad at this company right now 😤

I'm so mad at this company right now, [BRAND]. And it's not the [PRODUCT_OR_FORMULA].

Like, [INGREDIENT_1], [INGREDIENT_2], [INGREDIENT_3] — multiple things that work well together. That's why they got so many five-star reviews. That stuff does exactly what you want it to do.

The reason I'm mad is when you tap on that cart and then add two, it activates a flash sale — way better deal than buying one.

Whatever you do, do not wait. Tap on that cart before the flash sale ends.`,
      slots: ['BRAND', 'PRODUCT_OR_FORMULA', 'INGREDIENT_1', 'INGREDIENT_2', 'INGREDIENT_3'],
    },
  ],

  // ── Hope You Didn't Buy (@welearn2earn) ──────────────────────────────────────
  'hope-you-didnt-buy': [
    {
      hookId: 'hope-you-didnt-buy',
      creator: '@welearn2earn',
      description: 'Standard — protective opener → flash sale activation → product demo → do not overpay CTA',
      template: `TEXT: Hope you didn't buy this 🛑

Hope you didn't buy that expensive [PRODUCT] when today you can get [it/a new one] for next to nothing.

When you tapped it on a shopping cart, it's gonna activate a limited flash sale.

All you do is [SIMPLE_ACTION] and it's already [BENEFIT].

Whatever you do, do not overpay. Tap it on a shopping cart to get you some of this while it's on sale, because you know the sale's gonna be ending very soon.`,
      slots: ['PRODUCT', 'SIMPLE_ACTION', 'BENEFIT'],
    },
    {
      hookId: 'hope-you-didnt-buy',
      creator: '@welearn2earn',
      description: 'Variation B — dirt cheap opener',
      template: `TEXT: Don't buy this until you watch this 🛑

I hope you didn't buy this expensive [PRODUCT] when today you can get it for dirt cheap.

When you tapped it on a shopping cart, it's gonna activate a limited flash sale.

[PRODUCT] works on [USE_CASE]. It's portable, take it wherever you want it to go.

So whatever you do, stop [OLD_BEHAVIOR]. Tap it on a shopping cart to get you one of these while it's on sale, because you know the sale's gonna be ending very soon.`,
      slots: ['PRODUCT', 'USE_CASE', 'OLD_BEHAVIOR'],
    },
  ],

  // ── Got Robbed (@welearn2earn) ────────────────────────────────────────────────
  'got-robbed': [
    {
      hookId: 'got-robbed',
      creator: '@welearn2earn',
      description: 'Standard — accusatory opener → flash sale activation → product demo → villain-framing CTA',
      template: `TEXT: You got robbed 🚨

Your ass got robbed if you went and bought this expensive [PRODUCT], when today you can get it for next to nothing.

When you tapped it on a shopping cart, that's gonna activate a limited flash sale.

Y'all, this [PRODUCT] [KEY_FEATURE], making it perfect to use for [USE_CASE_1], or maybe [USE_CASE_2].

So quit giving them folks all their money. Tap it on a shopping cart to get you a few of these while they're on sale, because you know the sale's gonna be ending very soon.`,
      slots: ['PRODUCT', 'KEY_FEATURE', 'USE_CASE_1', 'USE_CASE_2'],
    },
    {
      hookId: 'got-robbed',
      creator: '@welearn2earn',
      description: 'Variation B — high bill opener (utility/service angle)',
      template: `TEXT: They're robbing you 🚨

You got a high ass [BILL_OR_PRICE] for no reason. Today you can get [PRODUCT] for next to nothing.

When you tapped it on a shopping cart, that's gonna activate a limited flash sale.

All you do is [SIMPLE_ACTION] and it's already [BENEFIT].

So quit giving them folks all their money. Tap it on a shopping cart to get you a few of these while they're on sale, because you know the sale's gonna be ending very soon.`,
      slots: ['BILL_OR_PRICE', 'PRODUCT', 'SIMPLE_ACTION', 'BENEFIT'],
    },
  ],
  'counting-hook': [
    {
      hookId: 'counting-hook',
      creator: '@cakedfinds' as any,
      description: 'Base version — rapid item list, no per-item benefit sentences',
      template: `TEXT: Not 1, not 2, not 3... but [ITEM_COUNT]? 🤯

Not one, not two, not three, [CONTINUE_COUNT], but [ITEM_COUNT]? Have you seen all these [BRAND] products they're giving us at this discount?

I got this whole [BOX_OR_SET]. This is over $[TOTAL_VALUE] worth of products.

[ITEM_1], [ITEM_2], [ITEM_3][ADDITIONAL_ITEMS] — an entire [ROUTINE_OR_KIT].

Check your price and read those reviews.

If anyone wants to try it, definitely get it now because I have a feeling this sale is going to sell them out again.`,
      slots: ['ITEM_COUNT', 'CONTINUE_COUNT', 'BRAND', 'BOX_OR_SET', 'TOTAL_VALUE', 'ITEM_1', 'ITEM_2', 'ITEM_3', 'ADDITIONAL_ITEMS', 'ROUTINE_OR_KIT'],
    },
    {
      hookId: 'counting-hook',
      creator: '@cakedfinds' as any,
      description: 'Enhanced version — rapid item list with short benefit tag per item (used with Generate Benefit Lines)',
      template: `TEXT: Not 1, not 2, not 3... but [ITEM_COUNT]? 🤯

Not one, not two, not three, [CONTINUE_COUNT], but [ITEM_COUNT]? Have you seen all these [BRAND] products they're giving us at this discount?

I got this whole [BOX_OR_SET]. This is over $[TOTAL_VALUE] worth of products.

[ITEM_1] — [BENEFIT_1]. [ITEM_2] — [BENEFIT_2]. [ITEM_3] — [BENEFIT_3].[ADDITIONAL_ITEM_BENEFITS] An entire [ROUTINE_OR_KIT].

Check your price and read those reviews.

If anyone wants to try it, definitely get it now because I have a feeling this sale is going to sell them out again.`,
      slots: ['ITEM_COUNT', 'CONTINUE_COUNT', 'BRAND', 'BOX_OR_SET', 'TOTAL_VALUE', 'ITEM_1', 'BENEFIT_1', 'ITEM_2', 'BENEFIT_2', 'ITEM_3', 'BENEFIT_3', 'ADDITIONAL_ITEM_BENEFITS', 'ROUTINE_OR_KIT'],
    },
  ],
};

// ─── Hybrid Bookends ──────────────────────────────────────────────────────────
// For hybrid hooks: the opening hook and urgency close are verbatim.
// The middle section (deal reveal + how-to) is assembled from the line bank.

export interface HybridBookend {
  hookId: string;
  creator: '@momfindsbyfaith' | '@dealscope' | '@dealssforeveryone' | '@blackfridaybrian' | '@welearn2earn' | 'both';
  textHook: string;
  verbalHook: string;
  urgencyClose: string;
  notes?: string;
}

export const HYBRID_BOOKENDS: Record<string, HybridBookend[]> = {

  'warning-be-careful': [
    {
      hookId: 'warning-be-careful',
      creator: '@momfindsbyfaith',
      textHook: 'Warning don\'t get this‼️ TODAY ONLY',
      verbalHook: 'Be careful with [PRODUCT] right now because [DEAL_REASON].',
      urgencyClose: 'But that sale ends [DEADLINE], so grab it before they raise the price.',
    },
    {
      hookId: 'warning-be-careful',
      creator: '@momfindsbyfaith',
      textHook: 'Please do not overpay for [PRODUCT]',
      verbalHook: 'Please do not overpay for [PRODUCT_A] and [PRODUCT_B]. Because they just put this in a bundle on a flash sale with free shipping. And some of you even have coupons today, so tap that cart to see if you have one.',
      urgencyClose: 'But please don\'t overpay by getting these separately because that sale price will end soon. I\'ll drop the link right here. Grab it before it\'s gone.',
      notes: 'Confirmed verbatim from Faith latest videos — Laka lip tint + liner bundle',
    },
    {
      hookId: 'warning-be-careful',
      creator: '@dealscope',
      textHook: 'Be careful with [PRODUCT]!',
      verbalHook: 'Do not buy the small [PRODUCT]. Get this big one instead. It\'s the same price cause right now this thing is on a flash sale.',
      urgencyClose: 'Hurry up and get it before it\'s too late.',
    },
    {
      hookId: 'warning-be-careful',
      creator: '@dealscope',
      textHook: 'Do not buy the small one',
      verbalHook: 'Please do not buy the small [PRODUCT]. Get this big [PRODUCT_BIGGER] instead, it\'s the same price. You get this whole thing on a major double discount.',
      urgencyClose: 'Do not miss out. Hurry up and get it. The sale is about to end tonight.',
      notes: 'Confirmed verbatim from Dealscope latest — "same price right now" framing',
    },
  ],

  'bundle-motherload': [
    {
      hookId: 'bundle-motherload',
      creator: '@momfindsbyfaith',
      textHook: 'HOLY [BRAND] MOTHERLOAD 🤯',
      verbalHook: 'Holy [BRAND] motherload. They are spoiling us with this bundle.',
      urgencyClose: 'But do not wait because that sale is about to end. Grab it before it disappears.',
    },
    {
      hookId: 'bundle-motherload',
      creator: '@momfindsbyfaith',
      textHook: 'HOLY [BRAND] MOTHERLOAD 🤯',
      verbalHook: 'Holy [BRAND] motherload. Not only did [BRAND] put all of their [PRODUCT_LINE] in a bundle, they put it on a huge discount.',
      urgencyClose: 'So do not wait until they raise the price on this because if you were to buy all of these individually, you would be absolutely getting ripped off. So grab it while you still can.',
      notes: 'Confirmed verbatim from Faith popular — Cyclar Sacred Santal bundle',
    },
    {
      hookId: 'bundle-motherload',
      creator: '@dealscope',
      textHook: 'You get all this 😱 [PRODUCT]',
      verbalHook: 'You get [ITEM_1], [ITEM_2], [ITEM_3] and a TikTok coupon.',
      urgencyClose: 'Hurry up, do not miss it.',
    },
    {
      hookId: 'bundle-motherload',
      creator: '@momfindsbyfaith',
      textHook: 'Not one, not two, not three... you\'re getting ALL [QUANTITY]',
      verbalHook: 'Not one, not two, not three, not four, not five. You\'re getting all [QUANTITY] of these today on a major discount and there\'s fast and free shipping and some of you even have coupons.',
      urgencyClose: 'But that sale ends soon and you don\'t want to miss it. So tap that cart, add two while you still can.',
      notes: 'Confirmed verbatim from Faith latest — quantity emphasis bundle hook',
    },
  ],

  'comparison-upgrade': [
    {
      hookId: 'comparison-upgrade',
      creator: '@dealscope',
      textHook: 'Stop buying this [PRODUCT]! Get [BETTER_VERSION] here',
      verbalHook: 'Do not buy the [WRONG_VERSION]. Get [BETTER_VERSION] instead. It\'s the same price because right now [DEAL_REASON].',
      urgencyClose: 'Hurry up before it goes back up.',
    },
    {
      hookId: 'comparison-upgrade',
      creator: '@dealscope',
      textHook: 'Do not buy the small [PRODUCT]',
      verbalHook: 'Do not buy the small [PRODUCT]. Get this big one instead. It\'s the same price right now.',
      urgencyClose: 'Hurry up and get it. Do not miss it.',
      notes: 'Confirmed verbatim from Dealscope latest — Cosrx, Mungboon, Beauty of Joseon',
    },
    {
      hookId: 'comparison-upgrade',
      creator: '@momfindsbyfaith',
      textHook: 'Warning don\'t get this‼️ TODAY ONLY',
      verbalHook: 'Be careful with [PRODUCT_A] and [PRODUCT_B] right now because for the same price, you can get it with [PRODUCT_C] for free.',
      urgencyClose: 'But that sale ends [DEADLINE], so grab it before they raise the price.',
    },
  ],

  'quantity-math': [
    {
      hookId: 'quantity-math',
      creator: 'both',
      textHook: 'Add [QUANTITY] to unlock sale',
      verbalHook: 'If you add [QUANTITY] to your cart, you unlock [DEAL] and you\'re getting [TOTAL_UNITS] for [PRICE]. That\'s [PRICE_PER_UNIT] each.',
      urgencyClose: 'Hurry up and get it before it\'s too late.',
    },
    {
      hookId: 'quantity-math',
      creator: '@momfindsbyfaith',
      textHook: 'Get [QUANTITY] for the price of [LOWER_QUANTITY]',
      verbalHook: 'Stop getting one of these [PRODUCT] because right now you can get three for the price of two. Here\'s how.',
      urgencyClose: 'But that sale ends tonight, so if you want to grab this up, tap the orange cart before it\'s gone.',
      notes: 'Confirmed verbatim from Faith popular — Coleology cutting jelly 3-for-2',
    },
    {
      hookId: 'quantity-math',
      creator: '@momfindsbyfaith',
      textHook: 'You can get [QUANTITY_A] or [QUANTITY_B] for the same price',
      verbalHook: 'You can get [QUANTITY_A] or [QUANTITY_B] [PRODUCT] today for the same price. Here\'s how. Tap the orange shopping cart and add two of the [BUNDLE_SIZE]-packs to your order and you\'ll activate a major flash sale and fast and free shipping.',
      urgencyClose: 'And if you\'re like me and you need all [QUANTITY], that sale price makes it the best deal today. So I\'ll drop the link right here. Grab two while you still can.',
      notes: 'Confirmed verbatim from Faith latest — Medicube pads 5-or-6 same price',
    },
    {
      hookId: 'quantity-math',
      creator: '@dealscope',
      textHook: '[QUANTITY] for the price of [LOWER_QUANTITY]',
      verbalHook: 'The [QUANTITY] pack is now the same price as the [LOWER_QUANTITY] pack.',
      urgencyClose: 'Hurry up before the timer runs out.',
    },
  ],
};

// ─── Shared CTA Arsenal ───────────────────────────────────────────────────────

export const SHARED_HOW_TO_LINES: LineVariant[] = [
  { line: 'Tap the orange cart to activate a major flash sale and fast and free shipping.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'free-shipping'] },
  { line: 'Just tap the orange cart and that\'s going to activate your flash sale and fast and free shipping.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'free-shipping'] },
  { line: 'When you tap the orange shopping cart, you\'ll unlock a major flash sale and fast and free shipping.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'free-shipping'] },
  { line: 'When you tap that cart, add two of the [BUNDLE_SIZE]-packs to your order, you\'ll activate a major flash sale and fast and free shipping.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'free-shipping', 'quantity-unlock'] },
  { line: 'Step one, tap the orange cart and add [X] to your order. That\'s going to activate your flash sale and fast and free shipping.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['quantity-unlock', 'flash-sale'] },
  { line: 'Just click right here, add [X] to your order.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['quantity-unlock'] },
  { line: 'Click the shopping cart down below and add [X] to your order.', creator: '@dealscope', frequency: 'high', dealTypes: ['quantity-unlock'] },
  { line: 'Tap down below to activate the sale.', creator: '@dealscope', frequency: 'high', dealTypes: ['flash-sale'] },
  { line: 'Make sure you add the [BUNDLE_SIZE]-pack to your cart and claim that coupon in the deals tab.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['coupon', 'quantity-unlock'] },
  { line: 'Add two to your cart to unlock that TikTok Shop coupon.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['quantity-unlock', 'coupon'] },
  { line: 'Use all the TikTok coupons located on the deals tab.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['coupon'] },
  { line: 'Type in code CREATORPICK in all capital letters.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['creator-code'], notes: 'Dealscope signature code — confirmed across 10+ latest videos' },
  { line: 'At the checkout page, use code [CODE] in all capital letters.', creator: '@dealscope', frequency: 'high', dealTypes: ['creator-code'] },
  { line: 'And then use that $10 off coupon and the 20% off coupon located on the deals tab.', creator: '@dealscope', frequency: 'medium', dealTypes: ['coupon'] },
];

// Hook-specific how-to lines (override SHARED for these hooks)
export const QUANTITY_MATH_HOW_TO: LineVariant[] = [
  { line: 'Add [QUANTITY] to your cart — that unlocks the bundle coupon and activates the flash sale price.', creator: 'both', frequency: 'very-high', dealTypes: ['quantity-unlock'] },
  { line: 'Step one, tap the orange cart and add [QUANTITY] to your order. That\'s going to unlock the deal.', creator: '@dealscope', frequency: 'high', dealTypes: ['quantity-unlock'] },
  { line: 'Add [QUANTITY] to your cart to unlock that TikTok Shop coupon and the flash sale price.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['quantity-unlock', 'coupon'] },
  ...SHARED_HOW_TO_LINES.filter(l => l.dealTypes?.includes('creator-code')),
];

export const TIKTOK_GLITCH_HOW_TO: LineVariant[] = [
  { line: 'First, you\'re gonna go to the TikTok Shop, you\'re gonna search up \'[product]\'. You\'re gonna click on the first one that pops up, and then you\'re gonna scroll down and you\'re gonna see a coupon for [X]% off. You\'re gonna click on that coupon, and then you\'re gonna click \'buy now\'.', creator: '@dealscope', frequency: 'very-high' },
  ...SHARED_HOW_TO_LINES,
];

// Urgency closes tagged by deal type
export const SHARED_URGENCY_CLOSES: LineVariant[] = [
  // ── @momfindsbyfaith closes ──
  { line: 'But that sale ends tonight, so grab it before they raise the price.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'coupon', 'free-gift'], notes: 'Best for flash sale + coupon stacked' },
  { line: 'But that sale ends tonight, so if you want to grab this up, do it before you miss it.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'coupon', 'free-shipping'] },
  { line: 'The sale ends soon and you don\'t want to miss it. So tap that cart and add two while you still can.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'coupon', 'quantity-unlock'], notes: 'Confirmed from Faith latest — very consistent close' },
  { line: 'That sale price makes it the best deal today. I\'ll drop the link right here. Grab it before it\'s gone.', creator: '@momfindsbyfaith', frequency: 'very-high', dealTypes: ['flash-sale', 'bundle', 'coupon'], notes: 'Confirmed verbatim from Faith latest — signature close formula' },
  { line: 'This sale ends tonight, so if you want to grab it up, do it before it disappears.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'coupon'] },
  { line: 'Before they raise the price.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'coupon', 'price-anchor'], notes: 'Faith signature close — pure consequence' },
  { line: "Now's the time — before they raise the price.", creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'coupon', 'price-anchor'] },
  { line: "If you want to grab this up, now's the time — before they raise the price.", creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'price-anchor'] },
  { line: 'I would run before it disappears.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'bundle', 'free-gift'] },
  { line: 'But do not wait because that sale is about to end. Grab it before it disappears.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'bundle'] },
  { line: 'So if you still see that cart, grab it before it disappears.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['flash-sale', 'bundle', 'coupon'] },
  { line: 'Please don\'t overpay by getting these separately because that sale price will end soon. I\'ll drop the link right here. Grab it before it\'s gone.', creator: '@momfindsbyfaith', frequency: 'high', dealTypes: ['bundle', 'flash-sale'], notes: 'Confirmed verbatim from Faith latest — Laka bundle' },
  // ── @dealscope closes ──
  { line: 'Hurry up and get it. Do not miss out.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['flash-sale', 'coupon', 'quantity-unlock', 'free-gift'], notes: 'Dealscope signature close — confirmed across 15+ latest videos' },
  { line: 'Hurry up and get it before it\'s too late.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['flash-sale', 'coupon', 'quantity-unlock', 'free-gift'] },
  { line: 'Hurry up and get it before it\'s too late and the timer runs out.', creator: '@dealscope', frequency: 'high', dealTypes: ['flash-sale', 'quantity-unlock'], notes: 'Use when there is a visible countdown timer' },
  { line: 'Hurry up and claim it before it\'s too late and that timer runs out.', creator: '@dealscope', frequency: 'high', dealTypes: ['flash-sale', 'quantity-unlock'], notes: 'Use when there is a visible countdown timer' },
  { line: 'Hurry up, do not miss it.', creator: '@dealscope', frequency: 'high', dealTypes: ['flash-sale', 'coupon', 'bundle', 'free-gift'] },
  { line: 'Hurry up, the timer\'s gonna end.', creator: '@dealscope', frequency: 'medium', dealTypes: ['flash-sale'], notes: 'Only when a countdown timer is visible' },
  { line: 'Hurry up and get it because the timer\'s about to end.', creator: '@dealscope', frequency: 'high', dealTypes: ['flash-sale', 'quantity-unlock'], notes: 'Confirmed from Dealscope latest' },
  { line: 'Do not miss out. Hurry up and get it. The sale is about to end tonight.', creator: '@dealscope', frequency: 'high', dealTypes: ['flash-sale', 'coupon'], notes: 'Confirmed verbatim from Dealscope latest' },
  { line: 'Go do it now before they fix it.', creator: '@dealscope', frequency: 'medium', dealTypes: ['tiktok-glitch'], notes: 'TikTok Glitch hook ONLY' },
];

export const SHARED_COUPON_LINES: LineVariant[] = [
  // NOTE: These lines are for the COUPON SECTION only — they must NOT contain a cart-tap instruction.
  // The cart-tap instruction lives in SHARED_HOW_TO_LINES. Coupon lines are appended AFTER the how-to.
  { line: 'And some of you will even see a coupon at checkout — not everyone sees those coupons and it\'s for a limited time.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Gamification — cleaned: removed embedded cart-tap' },
  { line: 'Some of you even have coupons today. Not everyone sees those coupons and it\'s for a limited time so you\'ll have to go to checkout to see if you have one.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Confirmed verbatim from Faith latest — very consistent phrasing' },
  { line: 'And some of you even have coupons today, so check at checkout to see if you have one.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Shorter variant — cleaned: removed embedded cart-tap' },
  { line: 'Go to checkout to see if you have a coupon — not everyone sees those coupons.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Cleaned: removed embedded cart-tap' },
  { line: 'Make sure to check your coupons at checkout.', creator: 'both', frequency: 'high' },
  { line: 'Scroll down and claim the coupons in the deals tab.', creator: '@momfindsbyfaith', frequency: 'high' },
  { line: 'Use all the TikTok coupons located on the deals tab.', creator: '@dealscope', frequency: 'very-high', notes: 'Confirmed from Dealscope latest — standard phrasing' },
  { line: 'And then at the checkout page where it says deals, claim that $10 off coupon and the 20% off coupon.', creator: '@dealscope', frequency: 'medium' },
  { line: 'Two coupons stack up with the flash sale.', creator: '@dealscope', frequency: 'medium' },
  { line: 'One is $10 off and one is 20% off and it stacks up on top of the sale.', creator: '@dealscope', frequency: 'medium', notes: 'Confirmed verbatim from Dealscope latest — Goli 3-pack video' },
];

// ─── Hook 1: Reverse Psychology "Do Not Buy" ─────────────────────────────────
// templateType: 'verbatim' — use VERBATIM_TEMPLATES['reverse-psychology']

export const REVERSE_PSYCHOLOGY_LINES: HookLineBank = {
  hookId: 'reverse-psychology',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: 'DO NOT GET THIS [emoji]', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'DO NOT GET THIS‼️', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'Do not get this !!', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'DO NOT BUY [product] [emoji]\nBe very careful!!', creator: '@dealscope', frequency: 'high' },
    { line: 'Don\'t buy this one 😬\n[brand] secrets here!', creator: '@dealscope', frequency: 'medium' },
    { line: 'Stop getting this ✋ TODAY ONLY', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not get ✋🛑 TODAY ONLY', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'DO NOT BUY THIS [QUANTITY] PACK [emoji]', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest — quantity upgrade angle' },
  ],
  verbalHooks: [
    { line: 'Do not get [product] unless you\'re getting it today because [deal reason].', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'I\'m warning you, do not get [product] unless you\'re getting it today because [deal reason].', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not get [product] unless you\'re getting it today because they just dropped their price.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not get the [product] because today when you add [X] of them to your cart you\'re getting it on a [deal].', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: '[AUDIENCE] do not get [product] by itself because they just released a [BUNDLE_SIZE]-pack and it\'s on sale.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed from Faith latest — targeted audience opener' },
    { line: 'Do not buy this [product]. At least not until you know this.', creator: '@dealscope', frequency: 'high' },
    { line: 'Do not buy this [X]-pack of [product] cause right now you can actually get double for almost the same price.', creator: '@dealscope', frequency: 'very-high', notes: 'Confirmed verbatim from Dealscope latest — Goli 3-pack video' },
    { line: 'Do not buy this [product], and do not buy this [product], and do not buy this one either. At least not until you know this secret.', creator: '@dealscope', frequency: 'medium' },
  ],
  dealRevealOpeners: [
    { line: 'Here\'s how to get it.', creator: '@dealscope', frequency: 'high' },
    { line: 'Right now this thing is on a flash sale.', creator: '@dealscope', frequency: 'high', notes: 'Only use when verbal hook did NOT already establish same-price framing' },
    { line: 'This is how.', creator: '@momfindsbyfaith', frequency: 'high' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  couponLines: SHARED_COUPON_LINES,
  urgencyCloses: SHARED_URGENCY_CLOSES,
};

// ─── Hook 2: Warning / Be Careful ────────────────────────────────────────────
// templateType: 'hybrid' — use HYBRID_BOOKENDS['warning-be-careful'] for hook + close

export const WARNING_BE_CAREFUL_LINES: HookLineBank = {
  hookId: 'warning-be-careful',
  format: 'BOF',
  templateType: 'hybrid',
  textHooks: [
    { line: 'Warning don\'t get this‼️ TODAY ONLY', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'Warning don\'t get this‼️ FINAL HOURS', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Please do not overpay for [product]', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed from Faith latest — bundle overpay angle' },
    { line: 'Be careful with [product]!', creator: '@dealscope', frequency: 'high' },
    { line: 'Careful buying this [emoji] Claim [deal tease]', creator: '@dealscope', frequency: 'medium' },
    { line: 'Stop getting this ✋ TODAY ONLY', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not buy the small one', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest — size upgrade angle' },
  ],
  verbalHooks: [
    { line: 'Be careful with [product] right now because for the same price, you can get [better deal / more product / free gift].', creator: 'both', frequency: 'very-high' },
    { line: 'Please do not overpay for [product A] and [product B]. Because they just put this in a bundle on a flash sale with free shipping.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed verbatim from Faith latest' },
    { line: 'Be careful with [product] right now because [deal ending — e.g. "the sale ends tonight" or "the price is going back up"].', creator: '@dealscope', frequency: 'high', notes: 'DEAL_REASON must be a specific deal mechanic — NOT a vague phrase like "the price is going up"' },
    { line: 'I\'m warning you, do not get [product] unless you\'re getting it today because [deal reason].', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not buy the small [product]. Get this big one instead. It\'s the same price cause right now this thing is on a flash sale.', creator: '@dealscope', frequency: 'high' },
  ],
  dealRevealOpeners: [
    { line: 'You can get it with [free gift] included for free.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Cleaned: removed leading "For the same price" — verbal hook already establishes that' },
    { line: 'You\'re getting [better bundle / more product / free gift] — same price.', creator: '@dealscope', frequency: 'high' },
    { line: 'Right now [deal] — same price.', creator: '@dealscope', frequency: 'high' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  couponLines: SHARED_COUPON_LINES,
  urgencyCloses: SHARED_URGENCY_CLOSES,
};

// ─── Hook 3: Deal / Discount Alert ───────────────────────────────────────────
// templateType: 'verbatim' — use VERBATIM_TEMPLATES['deal-alert']

export const DEAL_ALERT_LINES: HookLineBank = {
  hookId: 'deal-alert',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: '[PRODUCT] DOUBLE DISCOUNT\nSALE ENDS TONIGHT', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: '[PRODUCT] ON SALE — TONIGHT ONLY', creator: 'both', frequency: 'high' },
    { line: 'TRIPLE DISCOUNT\nFINAL HOURS', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: '[X] pack sale here! Add [X] to claim', creator: '@dealscope', frequency: 'high' },
    { line: '[BRAND] SALE', creator: 'both', frequency: 'medium' },
    { line: 'How is this less than $[PRICE]??', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest — liquidation sale hook' },
    { line: '[BRAND] LIQUIDATION SALE — ends at midnight', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest' },
    { line: 'DOUBLE FLASH SALE 🔥 [TODAY ONLY]', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — 8 of 10 videos, April 2026' },
    { line: 'They just dropped the price 👀 [TONIGHT ONLY]', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — @dealssforeveryone April 2026' },
    { line: 'Finally on sale 🚨 [TODAY ONLY]', creator: '@dealssforeveryone', frequency: 'high', notes: 'Anticipation variant — @dealssforeveryone April 2026' },
  ],
  verbalHooks: [
    { line: '[Product] is on a major double discount today.', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: '[Product] is on a major triple discount today.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Final hours to get [product] on a major triple discount.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'The six pack is now the same price as the three pack.', creator: '@dealscope', frequency: 'high' },
    { line: 'You get [X], [X] and [X] with a major double discount.', creator: '@dealscope', frequency: 'high' },
    { line: 'How is this less than [price]? Because [brand] is having their liquidation sale today and it ends at midnight.', creator: '@dealscope', frequency: 'high', notes: 'Confirmed verbatim from Dealscope latest' },
    { line: 'They just dropped the price on [product] only for today. Here\'s how to claim it.', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — 4 of 8 deal-alert videos, April 2026' },
    { line: 'They finally put this one on sale. They just dropped the price on [product] only for today.', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — anticipation variant, 3 of 8 videos, April 2026' },
    { line: 'Oh, I\'ve been waiting for this to go on sale. They just dropped the price on [product] only for today.', creator: '@dealssforeveryone', frequency: 'high', notes: 'Confirmed verbatim — personal excitement variant, April 2026' },
  ],
  dealRevealOpeners: [
    { line: 'This is how.', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'So you\'re gonna wanna grab that sale.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'I\'m going to show you how to do it.', creator: '@dealscope', frequency: 'high' },
    { line: 'To take advantage, just click right here.', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest — liquidation sale' },
    { line: 'That\'s gonna stack up with the flash sale. [X] discount, free shipping.', creator: '@dealscope', frequency: 'high' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  couponLines: [
    ...SHARED_COUPON_LINES,
    // @dealssforeveryone — Double Flash Sale coupon framing (verbatim, April 2026)
    { line: 'Claim that coupon in the deals tab — it\'s going to lock a second major flash sale.', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — 8 of 10 videos, April 2026. Reframes coupon as unlocking a second sale, not just a discount.' },
  ],
  urgencyCloses: [
    ...SHARED_URGENCY_CLOSES,
    // @dealssforeveryone — "miss out forever" close (verbatim, April 2026)
    { line: 'So tap that orange shopping cart before you miss out forever.', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — ~4 of 8 videos, April 2026. Extreme scarcity framing.' },
    { line: 'Just make sure you act right now because this sale does end by tonight. So tap that orange shopping cart before you miss out forever.', creator: '@dealssforeveryone', frequency: 'very-high', notes: 'Confirmed verbatim — full urgency close block, April 2026.' },
  ],
};

// ─── Hook 4: Bundle / Motherload ─────────────────────────────────────────────
// templateType: 'hybrid' — use HYBRID_BOOKENDS['bundle-motherload'] for hook + close

export const BUNDLE_MOTHERLOAD_LINES: HookLineBank = {
  hookId: 'bundle-motherload',
  format: 'BOF+',
  templateType: 'hybrid',
  textHooks: [
    { line: 'HOLY [BRAND] MOTHERLOAD 🤯', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'You get all this 😱 [product name]', creator: '@dealscope', frequency: 'high' },
    { line: 'Get all this [brand] set 😍', creator: '@dealscope', frequency: 'high' },
    { line: 'Holy [brand] motherload 🤯', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Not one, not two... you\'re getting ALL [QUANTITY] 😱', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed from Faith latest — quantity emphasis bundle' },
  ],
  verbalHooks: [
    { line: 'Holy [brand] motherload. They are spoiling us with this bundle.', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'Holy [brand] motherload. Not only did [brand] put all of their [product line] in a bundle, they put it on a huge discount.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Confirmed verbatim from Faith popular' },
    { line: 'Not one, not two, not three, not four, not five. You\'re getting all [quantity] of these today on a major discount and there\'s fast and free shipping and some of you even have coupons.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed verbatim from Faith latest' },
    { line: 'You get [X shampoos], [X conditioners], [X free gifts], and a TikTok coupon.', creator: '@dealscope', frequency: 'high' },
    { line: 'You\'re getting all of this from [brand] with that major double discount.', creator: '@dealscope', frequency: 'high' },
    { line: 'Oh my gosh, you guys, look at this!', creator: '@momfindsbyfaith', frequency: 'medium' },
  ],
  dealRevealOpeners: [
    { line: 'And they put it all on a massive discount with free shipping.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Cleaned: removed "Not only did [brand] put..." to avoid overlap with verbalHook which may already say "put it on a huge discount"' },
    { line: 'With that major double discount.', creator: '@dealscope', frequency: 'high' },
    { line: 'So let\'s see what you get.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Here\'s what you get.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Deal reveal opener for bundle — lists items. Cart-tap goes in howTo only.' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  proofLines: [
    { line: 'You\'re getting a full bottle of their [item]. [One benefit sentence].', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Repeat for each item in bundle — hold it up, name it, one benefit, move on' },
    { line: 'Hold up each item, name it, give one benefit per item. 10 seconds max per item.', creator: 'both', frequency: 'very-high', notes: 'Stage direction — not spoken' },
    { line: 'I love everything about [brand] because everything they make is [quality descriptor].', creator: '@momfindsbyfaith', frequency: 'medium' },
    { line: 'This has [key ingredient] in it, which [one benefit].', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Ingredient-benefit format — confirmed from Faith popular Cyclar video' },
  ],
  couponLines: SHARED_COUPON_LINES,
  urgencyCloses: [
    { line: 'But do not wait because that sale is about to end. Grab it before it disappears.', creator: '@momfindsbyfaith', frequency: 'very-high' },
    { line: 'So do not wait until they raise the price on this because if you were to buy all of these individually, you would be absolutely getting ripped off. So grab it while you still can.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Confirmed verbatim from Faith popular — Cyclar bundle' },
    { line: 'So if you still see that cart, grab it before it disappears.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Hurry up, do not miss it.', creator: '@dealscope', frequency: 'high' },
    ...SHARED_URGENCY_CLOSES,
  ],
};

// ─── Hook 5: TikTok Glitch / Hack ────────────────────────────────────────────
// templateType: 'verbatim' — use VERBATIM_TEMPLATES['tiktok-glitch']

export const TIKTOK_GLITCH_LINES: HookLineBank = {
  hookId: 'tiktok-glitch',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: 'TikTok Glitch 😱', creator: '@dealscope', frequency: 'very-high' },
    { line: 'I got [X] for $0.01 😳', creator: '@dealscope', frequency: 'high' },
    { line: 'TikTok Glitch 😱\nI got [X] for [price] 😳', creator: '@dealscope', frequency: 'high' },
    { line: 'Bro i just got [X] for [price] ???? DAYUMM', creator: '@dealscope', frequency: 'medium' },
  ],
  verbalHooks: [
    { line: 'Okay, so I just found out about this TikTok Shop glitch.', creator: '@dealscope', frequency: 'very-high' },
    { line: 'I just found out about this TikTok Shop glitch. You can get [product] for [GLITCH_PRICE — use a real deal price like "$3" or "$0.99", NOT "a penny"].', creator: '@dealscope', frequency: 'very-high', notes: 'GLITCH_PRICE must be a real deal price — do not use "a penny" or exaggerated prices' },
    { line: 'You can get [X] of these [product] for [price]. I\'m not joking.', creator: '@dealscope', frequency: 'high' },
  ],
  dealRevealOpeners: [
    { line: 'So I\'m gonna show you how to do it.', creator: '@dealscope', frequency: 'very-high' },
    { line: 'Here\'s how.', creator: '@dealscope', frequency: 'high' },
  ],
  howToLines: TIKTOK_GLITCH_HOW_TO,
  couponLines: [
    { line: 'There\'s a coupon for [X]% off — you\'re gonna click on that coupon.', creator: '@dealscope', frequency: 'high' },
    ...SHARED_COUPON_LINES,
  ],
  urgencyCloses: [
    { line: 'Go do it now before they fix it.', creator: '@dealscope', frequency: 'very-high', dealTypes: ['tiktok-glitch'] },
    { line: 'Hurry up before they run out of stock.', creator: '@dealscope', frequency: 'high' },
    ...SHARED_URGENCY_CLOSES,
  ],
};

// ─── Hook 6: Comparison / Upgrade ────────────────────────────────────────────
// templateType: 'hybrid' — use HYBRID_BOOKENDS['comparison-upgrade'] for hook + close

export const COMPARISON_UPGRADE_LINES: HookLineBank = {
  hookId: 'comparison-upgrade',
  format: 'BOF',
  templateType: 'hybrid',
  textHooks: [
    { line: 'Stop buying this [product]! Get [better version] here [emoji]', creator: '@dealscope', frequency: 'high' },
    { line: 'Don\'t buy the small ones. [Deal tease]', creator: '@dealscope', frequency: 'high' },
    { line: 'Get the [color/version] one [brand] [size] pack!!', creator: '@dealscope', frequency: 'medium' },
    { line: 'Warning don\'t get this‼️ TODAY ONLY', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not buy the small [product]', creator: '@dealscope', frequency: 'very-high', notes: 'Confirmed from Dealscope latest — most common comparison hook' },
    { line: 'Get this big one instead — same price right now', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest' },
  ],
  verbalHooks: [
    { line: 'Do not buy the [smaller/wrong version]. Get [the bigger/better one] instead. It\'s the same price because right now [deal reason].', creator: '@dealscope', frequency: 'very-high' },
    { line: 'Do not buy the small [product]. Get this big one instead. It\'s the same price right now.', creator: '@dealscope', frequency: 'very-high', notes: 'Confirmed verbatim from Dealscope latest — Cosrx, Mungboon, Beauty of Joseon' },
    { line: 'Be careful with [product A] and [product B] right now because for the same price, you can get it with [product C] for free.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Do not buy the small [product]. Get this big one instead.', creator: '@dealscope', frequency: 'high' },
    { line: 'Do not buy the [wrong version], get the [right version] instead.', creator: '@dealscope', frequency: 'high' },
  ],
  dealRevealOpeners: [
    { line: 'And they have a new coupon code on top of that.', creator: '@dealscope', frequency: 'high' },
    { line: 'You can get [better deal / more product].', creator: 'both', frequency: 'high' },
    { line: 'You\'re getting [list better items].', creator: '@dealscope', frequency: 'high' },
    { line: 'Right now there\'s a flash sale stacked on top.', creator: '@dealscope', frequency: 'high', notes: 'Deal reveal only — no cart-tap instruction here; that goes in howTo' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  couponLines: SHARED_COUPON_LINES,
  urgencyCloses: [
    { line: 'Hurry up before it goes back up.', creator: '@dealscope', frequency: 'high' },
    { line: 'Hurry up before the timer runs out.', creator: '@dealscope', frequency: 'high' },
    { line: 'Hurry up and get it. Do not miss it.', creator: '@dealscope', frequency: 'very-high', notes: 'Confirmed from Dealscope latest — signature close' },
    ...SHARED_URGENCY_CLOSES,
  ],
};

// ─── Hook 7: Price Anchor ─────────────────────────────────────────────────────
// templateType: 'assembly' — full line bank assembly

export const PRICE_ANCHOR_LINES: HookLineBank = {
  hookId: 'price-anchor',
  format: 'BOF',
  templateType: 'assembly',
  textHooks: [
    { line: 'Usually $[retail price] → Get it for $[deal price] today', creator: 'both', frequency: 'high' },
    { line: '$[retail] → $[deal price] TONIGHT ONLY', creator: 'both', frequency: 'high' },
    { line: 'Usually $[retail price] → $[deal price] today', creator: 'both', frequency: 'high' },
    { line: 'How is this less than $[PRICE]??', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest — liquidation sale price anchor' },
  ],
  verbalHooks: [
    { line: 'This is usually $[retail price] but right now you can get it for [deal price] with the flash sale and coupon stacked.', creator: 'both', frequency: 'very-high' },
    { line: 'This normally retails for $[retail price] but right now it\'s on a major sale.', creator: 'both', frequency: 'high' },
    { line: 'How is this less than [price]? Because [brand] is having their liquidation sale today and it ends at midnight.', creator: '@dealscope', frequency: 'high', notes: 'Confirmed verbatim from Dealscope latest' },
  ],
  dealRevealOpeners: [
    { line: 'With the flash sale and coupon stacked.', creator: 'both', frequency: 'high', notes: 'Confirms the stacking mechanic without repeating the price' },
    { line: 'That\'s [X]% off the retail price.', creator: 'both', frequency: 'medium', notes: 'Only use if percentage was NOT mentioned in verbal hook' },
    { line: 'Here\'s how to claim it.', creator: 'both', frequency: 'high' },
    { line: 'To take advantage, just click right here.', creator: '@dealscope', frequency: 'high', notes: 'Confirmed from Dealscope latest' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  couponLines: SHARED_COUPON_LINES,
  urgencyCloses: SHARED_URGENCY_CLOSES,
};

// ─── Hook 8: Quantity Math ────────────────────────────────────────────────────
// templateType: 'hybrid' — use HYBRID_BOOKENDS['quantity-math'] for hook + close

export const QUANTITY_MATH_LINES: HookLineBank = {
  hookId: 'quantity-math',
  format: 'BOF',
  templateType: 'hybrid',
  textHooks: [
    { line: 'Add [X] boxes to unlock sale', creator: '@dealscope', frequency: 'high' },
    { line: '[X] for the price of [Y]', creator: 'both', frequency: 'high' },
    { line: '[X] pack sale here! Add [X] to claim', creator: '@dealscope', frequency: 'high' },
    { line: '[X] bottles for the price of [Y] — here\'s how', creator: 'both', frequency: 'medium' },
    { line: 'Get [QUANTITY_A] or [QUANTITY_B] for the same price', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed from Faith latest — Medicube pads' },
  ],
  verbalHooks: [
    { line: 'If you add [X] to your cart, you unlock [deal] and you\'re getting [X units] for [price]. That\'s [price per unit] each.', creator: 'both', frequency: 'very-high' },
    { line: 'Stop getting one of these [product] because right now you can get three for the price of two. Here\'s how.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Confirmed verbatim from Faith popular — Coleology cutting jelly' },
    { line: 'You can get [QUANTITY_A] or [QUANTITY_B] [product] today for the same price. Here\'s how.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Confirmed verbatim from Faith latest — Medicube pads' },
    { line: 'The six pack is now the same price as the three pack.', creator: '@dealscope', frequency: 'high' },
    { line: 'You get three vinegar, three matcha and three ashwagandha with a major double discount.', creator: '@dealscope', frequency: 'medium', notes: 'Adapt for any multi-variety bundle' },
  ],
  dealRevealOpeners: [
    { line: 'This is how.', creator: '@dealscope', frequency: 'very-high' },
    { line: 'I\'m going to show you how to do it.', creator: '@dealscope', frequency: 'high' },
    { line: 'Here\'s how to unlock it.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'You\'ll activate a major flash sale and fast and free shipping.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Deal reveal continuation — states what the quantity unlock activates. Cart-tap instruction goes in howTo only.' },
  ],
  howToLines: QUANTITY_MATH_HOW_TO,
  couponLines: SHARED_COUPON_LINES,
  urgencyCloses: SHARED_URGENCY_CLOSES,
};

// ─── Hook 9: Returning This ───────────────────────────────────────────────────
// (Merged with Always Read Reviews — Variation A uses the reviews opener)
// templateType: 'verbatim' — use VERBATIM_TEMPLATES['returning-this']
// Source: Faith popular + latest videos analyzed
// Creator: @momfindsbyfaith ONLY — dealscope does not use this hook

export const RETURNING_THIS_LINES: HookLineBank = {
  hookId: 'returning-this',
  format: 'BOF+',
  templateType: 'verbatim',
  textHooks: [
    { line: 'Sending this back!', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Most common text hook' },
    { line: 'I\'m returning this 💔', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Still returning this 😭', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'I\'m so returning this', creator: '@momfindsbyfaith', frequency: 'high' },
  ],
  verbalHooks: [
    // Variation A — Reviews opener (most common)
    { line: 'Rule number one, always read the reviews when it comes to TikTok, because I got [product] and now I have to return it.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Variation A — most common opener' },
    { line: 'See the nurse on here who said to always read the reviews when you get something on TikTok? Well, I got [product] and now I have to return it.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Variation A — nurse reference variant' },
    // Variation B — Direct return opener
    { line: 'I\'m definitely returning this [product] because I got it at full price when you can now get all of this on a major discount with free shipping.', creator: '@momfindsbyfaith', frequency: 'high', notes: 'Variation B — direct opener' },
    { line: 'I\'m so returning the [product].', creator: '@momfindsbyfaith', frequency: 'medium', notes: 'Variation B — short direct opener' },
    // Variation C — Brian compressed pivot openers (verbatim from @blackfridaybrian transcripts)
    { line: 'I\'m throwing this [product] in the trash. And it\'s not the formula — [quick benefit]. The reason I\'m pissed off at this company is because when you tap on that cart and add [quantity], it\'s a way better deal.', creator: '@blackfridaybrian', frequency: 'high', notes: 'Variation C — compressed pivot, cart-tap deal reveal' },
    { line: 'I\'m so mad at this company right now. And it\'s not the product — [quick benefit]. The reason I\'m pissed off is because when you tap on that cart and add [quantity], it\'s a way better deal.', creator: '@blackfridaybrian', frequency: 'high', notes: 'Variation C — mad-at-company opener' },
    { line: 'I\'m returning this [product]. And it\'s not the formula — [quick benefit]. The reason I\'m mad is when you tap on that cart and add [quantity], it\'s a way better deal.', creator: '@blackfridaybrian', frequency: 'high', notes: 'Variation C — returning opener' },
    { line: 'I\'m so pissed off at this company right now for this [product]. And it\'s not the formula. [quick benefit]. The reason I\'m pissed off is because when you tap on that cart and add [quantity], it\'s a way better deal.', creator: '@blackfridaybrian', frequency: 'medium', notes: 'Variation C — pissed-off opener' },
  ],
  dealRevealOpeners: [
    { line: 'I\'m returning it because I actually bought [individual items] separately, when right now [brand] just released their [bundle name].', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'The pivot line — most consistent across all videos' },
    { line: 'But the reason for why I\'m returning it, right after I paid full price for this, [brand] put it on a huge discount with free shipping and then put a coupon on it.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'I\'m returning it because I just got the one pack. But then they put the [bundle name] on sale with free shipping.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'But it\'s because they just dropped their price on the [bundle name].', creator: '@momfindsbyfaith', frequency: 'medium' },
  ],
  howToLines: SHARED_HOW_TO_LINES,
  proofLines: [
    // The negative list — "It's not because [benefit]" structure
    { line: 'It\'s not because [benefit 1], and it\'s not [benefit 2], or the fact that [benefit 3], and it\'s not even [benefit 4].', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'The negative list — state 3-5 product benefits as reasons NOT to return it' },
    { line: 'It\'s not because [benefit 1], and it\'s not [benefit 2], or because [benefit 3].', creator: '@momfindsbyfaith', frequency: 'high', notes: '3-item version for shorter scripts' },
    { line: 'Not because [benefit 1], not because [benefit 2], not even because [benefit 3].', creator: '@momfindsbyfaith', frequency: 'medium' },
  ],
  couponLines: [
    // Coupon gamification is nearly universal for this hook
    { line: 'And you can get all of this in a bundle on a massive discount with free shipping and some of you even have coupons today. Not everyone sees those coupons and it\'s for a limited time so you\'ll have to go to checkout to see if you have one.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Full coupon gamification line — verbatim' },
    { line: 'With free shipping and there\'s a coupon that some of you have but not everyone sees those coupons so tap that cart to see if you have one.', creator: '@momfindsbyfaith', frequency: 'high' },
    ...SHARED_COUPON_LINES,
  ],
  urgencyCloses: [
    // "Don't be like me" close formula — extremely consistent across all videos
    { line: 'So don\'t be like me and overpay by getting these separately because that sale price makes it the best deal today. If you still see that cart, I would run before it disappears.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Verbatim close formula' },
    { line: 'Don\'t be like me and overpay by just getting these two. Add the bundle while it\'s on sale especially if you see that coupon. I would run before it disappears.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'So don\'t be like me and buy this separately because they\'re already selling out. If you still see that cart, I would grab it before it disappears.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'Just don\'t be like me and overpay because that sale ends soon and you don\'t wanna miss it.', creator: '@momfindsbyfaith', frequency: 'high' },
    { line: 'So don\'t be like me and get these separately because that bundle sale price makes it the best deal today. I\'ll drop the link right here. Grab it before it\'s gone.', creator: '@momfindsbyfaith', frequency: 'very-high', notes: 'Confirmed verbatim from Faith latest — very consistent close' },
    { line: 'Just do not wait because the last time they put this on sale they sold out so quick. So if you still see that cart, I would grab it before it disappears.', creator: '@momfindsbyfaith', frequency: 'medium' },
    ...SHARED_URGENCY_CLOSES.filter(l => l.creator === '@momfindsbyfaith'),
  ],
};

// ─── Fake Outrage (@blackfridaybrian) ──────────────────────────────────────────
// Source: 12 videos analyzed (10 Popular + 2 Latest), May 2026
// Structure: Fake-outrage opener → product defense (ingredients/reviews) → real complaint = the deal → cart-tap CTA
// All lines verbatim from @blackfridaybrian transcripts

const FAKE_OUTRAGE_LINES: HookLineBank = {
  hookId: 'fake-outrage',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: 'I\'m throwing this in the trash 🗑️', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Most-used text overlay — appears on majority of his fake-outrage videos' },
    { line: 'I\'m so mad at this company right now 😤', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'I\'m returning this 😤', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'I\'m so pissed off at this company right now 😤', creator: '@blackfridaybrian', frequency: 'medium' },
  ],
  verbalHooks: [
    { line: 'Throwing this shit in the trash. [PRODUCT] by [BRAND]. And it\'s not the [formula/ingredients/product].', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Most-used verbal opener — verbatim from multiple transcripts' },
    { line: 'I\'m so mad at this company right now, [BRAND]. And it\'s not the [product/formula/gummies].', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Second most-used opener' },
    { line: 'I\'m returning this shit. [PRODUCT] by [BRAND]. And it\'s not the formula.', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'I\'m so pissed off at this company, [BRAND], right now for these [PRODUCT]. And it\'s not the formula.', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'I\'m mad at this company, [BRAND], right now. Like, not the [PRODUCT].', creator: '@blackfridaybrian', frequency: 'medium' },
  ],
  dealRevealOpeners: [
    { line: 'The reason I\'m pissed off at this company is because when you tap on that cart and add two,', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Verbatim pivot to deal reveal — cart-tap mechanic' },
    { line: 'The reason I\'m mad is when you tap on that cart and then add two,', creator: '@blackfridaybrian', frequency: 'very-high' },
    { line: 'The only reason I\'m pissed at this company is because when you tap on the cart here on TikTok and', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'The reason I\'m saying that is because when you tap on that cart,', creator: '@blackfridaybrian', frequency: 'high' },
  ],
  howToLines: [
    { line: 'I did a deep dive with AI. Every one of these ingredients has some pretty cool-looking backing. They work synergistically together.', creator: '@blackfridaybrian', frequency: 'high', notes: 'His signature "deep dive" credibility line' },
    { line: 'I did a deep dive. They work really, really well together. That\'s why they got so many five-star reviews.', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'Like, [INGREDIENT 1], [INGREDIENT 2], [INGREDIENT 3] — multiple things that work well together.', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Ingredient stacking — always lists 2-4 ingredients' },
    { line: 'That\'s why they got so many five-star reviews. That stuff does exactly what you want it to do.', creator: '@blackfridaybrian', frequency: 'very-high' },
    { line: 'I mean, the reviews are five star for a reason, right? That stuff does exactly what you want it to do.', creator: '@blackfridaybrian', frequency: 'high' },
  ],
  couponLines: [
    { line: 'When you tap on that cart and add two, it activates a flash sale — way better deal than buying one.', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Cart-tap flash sale mechanic — his signature deal reveal' },
    { line: 'Tap on that cart. When you add two it\'s gonna activate a flash sale. That\'s the deal.', creator: '@blackfridaybrian', frequency: 'high' },
    ...SHARED_COUPON_LINES,
  ],
  urgencyCloses: [
    { line: 'So whatever you do, do not overpay. Tap on that cart while it\'s still on sale, because you know the sale\'s gonna be ending very soon.', creator: '@blackfridaybrian', frequency: 'very-high', notes: 'Verbatim close — most consistent across all his videos' },
    { line: 'Whatever you do, do not wait. Tap on that cart before the flash sale ends.', creator: '@blackfridaybrian', frequency: 'high' },
    { line: 'Tap on that cart to get you one of these while they\'re on sale, because you know the sale\'s gonna be ending very soon.', creator: '@blackfridaybrian', frequency: 'high' },
    ...SHARED_URGENCY_CLOSES.filter(l => l.creator === '@blackfridaybrian'),
  ],
};

// ─── Hope You Didn't Buy (@welearn2earn) ─────────────────────────────────────
// Source: 8 videos analyzed (Popular + Latest), May 2026
// Structure: Protective opener ("hope you didn't buy expensive X") → flash sale activation → product demo → do not overpay CTA
// All lines verbatim from @welearn2earn transcripts

const HOPE_YOU_DIDNT_BUY_LINES: HookLineBank = {
  hookId: 'hope-you-didnt-buy',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: 'Hope you didn\'t buy this 🛑', creator: '@welearn2earn', frequency: 'very-high', notes: 'Most-used text overlay' },
    { line: 'Don\'t buy this until you watch this 🛑', creator: '@welearn2earn', frequency: 'high' },
  ],
  verbalHooks: [
    { line: 'Hope you didn\'t buy that expensive [PRODUCT] when today you can get [it/a new one] for next to nothing.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Verbatim opener — most consistent across all his hope-you-didnt-buy videos' },
    { line: 'I hope you didn\'t buy this expensive [PRODUCT] when today you can get it for dirt cheap.', creator: '@welearn2earn', frequency: 'very-high' },
    { line: 'Hope you didn\'t buy that expensive [PRODUCT] when today you can get a new [PRODUCT VARIANT] for next to nothing.', creator: '@welearn2earn', frequency: 'high' },
  ],
  dealRevealOpeners: [
    { line: 'When you tapped it on a shopping cart, it\'s gonna activate a limited flash sale.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Verbatim deal reveal — appears in every single video' },
    { line: 'You tapped it on a shopping cart, it\'s gonna activate a limited flat sale.', creator: '@welearn2earn', frequency: 'high', notes: 'Slight variation — same structure' },
    { line: 'You tap it on a shopping cart, that\'s gonna activate a limited flash sale.', creator: '@welearn2earn', frequency: 'high' },
  ],
  howToLines: [
    { line: 'All you do is [simple action] and it\'s already [benefit].', creator: '@welearn2earn', frequency: 'very-high', notes: 'His signature simplicity framing — makes product feel effortless' },
    { line: 'It\'s super simple to use. All you do is [action] and [result].', creator: '@welearn2earn', frequency: 'high' },
    { line: 'Let me show you. All you do is [action], [outcome].', creator: '@welearn2earn', frequency: 'high' },
    { line: '[PRODUCT] works on [specific use case]. It\'s portable, take it wherever you want it to go.', creator: '@welearn2earn', frequency: 'medium' },
  ],
  couponLines: [
    { line: 'Whatever you do, do not overpay. Tap it on a shopping cart to get you some of this while it\'s on sale.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Verbatim mid-CTA — appears in nearly every video' },
    { line: 'So whatever you do, stop [paying/doing the old thing]. Tap it on a shopping cart to get you [one/a few] of these while they\'re on sale.', creator: '@welearn2earn', frequency: 'high' },
    ...SHARED_COUPON_LINES,
  ],
  urgencyCloses: [
    { line: 'Because you know the sale\'s gonna be ending very soon.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Verbatim close — appears in every single video, always the final line' },
    { line: 'Tap it on a shopping cart to get you a few of these while they\'re on sale, because you know the sale\'s gonna be ending very soon.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Full close with CTA — verbatim' },
    ...SHARED_URGENCY_CLOSES.filter(l => l.creator === '@welearn2earn'),
  ],
};

// ─── Got Robbed (@welearn2earn) ──────────────────────────────────────────────
// Source: 3 videos analyzed (Popular), May 2026
// Structure: Accusatory protective opener ("your ass got robbed") → flash sale activation → product demo → do not overpay CTA
// Same structural formula as hope-you-didnt-buy but more aggressive tone
// All lines verbatim from @welearn2earn transcripts

const GOT_ROBBED_LINES: HookLineBank = {
  hookId: 'got-robbed',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: 'You got robbed 🚨', creator: '@welearn2earn', frequency: 'very-high', notes: 'Most-used text overlay for this hook' },
    { line: 'They\'re robbing you 🚨', creator: '@welearn2earn', frequency: 'medium' },
  ],
  verbalHooks: [
    { line: 'Your ass got robbed if you went and bought this expensive [PRODUCT], when today you can get it for next to nothing.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Verbatim opener — confirmed from transcript' },
    { line: 'You got a high ass [utility bill/price] for no reason. Today you can get [PRODUCT] for next to nothing.', creator: '@welearn2earn', frequency: 'high', notes: 'Variation — focuses on the overpayment rather than the purchase act' },
    { line: 'The [utility company/retailer] is bending you over. And today you can get [PRODUCT] for next to nothing.', creator: '@welearn2earn', frequency: 'high', notes: 'Most aggressive variation — frames the seller as the villain' },
  ],
  dealRevealOpeners: [
    { line: 'When you tapped it on a shopping cart, that\'s gonna activate a limited flash sale.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Same deal reveal as hope-you-didnt-buy — consistent across all his hooks' },
    { line: 'You tap the door and shopping cart, that\'s gonna activate a limited flash sale.', creator: '@welearn2earn', frequency: 'high' },
  ],
  howToLines: [
    { line: 'All you do is [simple action] and it\'s already [benefit].', creator: '@welearn2earn', frequency: 'very-high' },
    { line: 'So whatever you do, stop [paying/doing the old thing].', creator: '@welearn2earn', frequency: 'high', notes: 'Reinforces the villain framing from the opener' },
    { line: 'Y\'all, this [PRODUCT] [key feature], making it perfect to use for [use case 1], or maybe [use case 2].', creator: '@welearn2earn', frequency: 'high' },
  ],
  couponLines: [
    { line: 'So quit giving them folks all their money. Tap it on a shopping cart to get you a few of these while they\'re on sale.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Verbatim mid-CTA — unique to got-robbed hook, reinforces villain framing' },
    { line: 'Whatever you do, do not overpay. Tap it on a shopping cart to get you one of these while it\'s on sale.', creator: '@welearn2earn', frequency: 'high' },
    ...SHARED_COUPON_LINES,
  ],
  urgencyCloses: [
    { line: 'Because you know the sale\'s gonna be ending very soon.', creator: '@welearn2earn', frequency: 'very-high', notes: 'Same close as hope-you-didnt-buy — consistent across all his hooks' },
    { line: 'Tap it on a shopping cart to get you a few of these while they\'re on sale, because you know the sale\'s gonna be ending very soon.', creator: '@welearn2earn', frequency: 'very-high' },
    ...SHARED_URGENCY_CLOSES.filter(l => l.creator === '@welearn2earn'),
  ],
};

const COUNTING_HOOK_LINES: HookLineBank = {
  hookId: 'counting-hook',
  format: 'BOF',
  templateType: 'verbatim',
  textHooks: [
    { line: 'Not 1, not 2, not 3... but [N]? 🤯', creator: '@cakedfinds' as any, frequency: 'very-high', notes: 'Verbatim text hook — the count number must match actual item count' },
    { line: 'Wait... [N] products for this price?! 🤯', creator: '@cakedfinds' as any, frequency: 'medium', notes: 'Variation — skips the count and goes straight to the reveal' },
  ],
  verbalHooks: [
    { line: 'Not one, not two, not three, not four, but [N]? Have you seen all these [BRAND] products they\'re giving us at this discount?', creator: '@cakedfinds' as any, frequency: 'very-high', notes: 'Verbatim opener from @cakedfinds transcript — count must match item count' },
    { line: 'Not one, not two, not three, but [N]? Have you seen all these [BRAND] products they\'re giving us at this price?', creator: '@cakedfinds' as any, frequency: 'high', notes: 'Shorter variation for 3-item bundles' },
  ],
  dealRevealOpeners: [
    { line: 'I got this whole [box/set/bundle]. This is over $[VALUE] worth of products.', creator: '@cakedfinds' as any, frequency: 'very-high', notes: 'Verbatim value anchor — the dollar amount is required for this hook to land' },
    { line: 'Look at everything you get in this [box/set]. This is easily $[VALUE] worth of products.', creator: '@cakedfinds' as any, frequency: 'high' },
  ],
  howToLines: [
    { line: '[ITEM 1], [ITEM 2], [ITEM 3]... [ITEM N] — an entire [routine/kit/set].', creator: '@cakedfinds' as any, frequency: 'very-high', notes: 'Rapid-fire item list — names only, no benefit sentences in base version' },
    { line: 'You get [ITEM 1], [ITEM 2], [ITEM 3], and [ITEM N] — everything you need for [goal/routine].', creator: '@cakedfinds' as any, frequency: 'high', notes: 'Slightly slower variation with a summary benefit at the end' },
  ],
  couponLines: [
    { line: 'Check your price and read those reviews.', creator: '@cakedfinds' as any, frequency: 'very-high', notes: 'Verbatim CTA from transcript — unique to this hook' },
    ...SHARED_COUPON_LINES,
  ],
  urgencyCloses: [
    { line: 'If anyone wants to try it, definitely get it now because I have a feeling this sale is going to sell them out again.', creator: '@cakedfinds' as any, frequency: 'very-high', notes: 'Verbatim close from @cakedfinds transcript' },
    ...SHARED_URGENCY_CLOSES,
  ],
};

// ─── Master Line Bank Index ───────────────────────────────────────────────────
// NOTE: Social Proof / Comment Hook removed (0 example videos — insufficient data)
// NOTE: Always Read Reviews merged into Returning This (Variation A opener)

export const BOF_LINE_BANK: Record<string, HookLineBank> = {
  'reverse-psychology': REVERSE_PSYCHOLOGY_LINES,
  'warning-be-careful': WARNING_BE_CAREFUL_LINES,
  'deal-alert': DEAL_ALERT_LINES,
  'bundle-motherload': BUNDLE_MOTHERLOAD_LINES,
  'tiktok-glitch': TIKTOK_GLITCH_LINES,
  'comparison-upgrade': COMPARISON_UPGRADE_LINES,
  'price-anchor': PRICE_ANCHOR_LINES,
  'quantity-math': QUANTITY_MATH_LINES,
  'returning-this': RETURNING_THIS_LINES,
  'fake-outrage': FAKE_OUTRAGE_LINES,
  'hope-you-didnt-buy': HOPE_YOU_DIDNT_BUY_LINES,
  'got-robbed': GOT_ROBBED_LINES,
  'counting-hook': COUNTING_HOOK_LINES,
};

// ─── BOF vs BOF+ Classification ──────────────────────────────────────────────

export const BOF_FORMAT_MAP: Record<string, 'BOF' | 'BOF+'> = {
  'reverse-psychology': 'BOF',
  'warning-be-careful': 'BOF',
  'deal-alert': 'BOF',
  'tiktok-glitch': 'BOF',
  'price-anchor': 'BOF',
  'comparison-upgrade': 'BOF',
  'bundle-motherload': 'BOF+',
  'quantity-math': 'BOF',
  'returning-this': 'BOF+',
  'fake-outrage': 'BOF',
  'hope-you-didnt-buy': 'BOF',
  'got-robbed': 'BOF',
  'counting-hook': 'BOF',
};

// ─── Template Type Classification ────────────────────────────────────────────

export const BOF_TEMPLATE_TYPE_MAP: Record<string, 'verbatim' | 'hybrid' | 'assembly'> = {
  'reverse-psychology': 'verbatim',
  'deal-alert': 'verbatim',
  'tiktok-glitch': 'verbatim',
  'returning-this': 'verbatim',
  'fake-outrage': 'verbatim',
  'hope-you-didnt-buy': 'verbatim',
  'got-robbed': 'verbatim',
  'counting-hook': 'verbatim',
  'warning-be-careful': 'hybrid',
  'bundle-motherload': 'hybrid',
  'comparison-upgrade': 'hybrid',
  'quantity-math': 'hybrid',
  'price-anchor': 'assembly',
};

// ─── Helper: Get top lines for a hook position (creator-balanced) ──────────────────────────────────
// Guarantees at least 1 line per creator present in the bank so new creators
// are never permanently buried by established creators with more very-high lines.

export function getTopLines(
  hookId: string,
  position: 'textHooks' | 'verbalHooks' | 'dealRevealOpeners' | 'howToLines' | 'proofLines' | 'couponLines' | 'urgencyCloses',
  count = 3
): string[] {
  const bank = BOF_LINE_BANK[hookId];
  if (!bank) return [];
  const lines = bank[position] as LineVariant[] | undefined;
  if (!lines || lines.length === 0) return [];

  const frequencyOrder = { 'very-high': 0, high: 1, medium: 2, low: 3 };
  const sorted = [...lines].sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]);

  // Identify all unique creators present in this position
  const creators = Array.from(new Set(sorted.map(l => l.creator).filter(c => c !== 'both')));

  // If only one creator (or no count pressure), fall back to simple top-N
  if (creators.length <= 1) return sorted.slice(0, count).map(l => l.line);

  // Creator-balanced: guarantee 1 best line per creator, then fill remaining slots
  // with the highest-frequency lines not already selected
  const selected: LineVariant[] = [];
  const usedIndices = new Set<number>();

  // Round 1: pick the single best line from each creator
  for (const creator of creators) {
    const idx = sorted.findIndex((l, i) => !usedIndices.has(i) && (l.creator === creator || l.creator === 'both'));
    if (idx !== -1) {
      selected.push(sorted[idx]);
      usedIndices.add(idx);
    }
  }

  // Round 2: fill remaining slots with next-best lines (any creator)
  for (let i = 0; i < sorted.length && selected.length < count; i++) {
    if (!usedIndices.has(i)) {
      selected.push(sorted[i]);
      usedIndices.add(i);
    }
  }

  return selected.slice(0, count).map(l => l.line);
}

// ─── Helper: Get urgency closes filtered by deal type ────────────────────────

export function getClosesForDealTypes(dealTypes: string[], creator?: '@momfindsbyfaith' | '@dealscope'): LineVariant[] {
  return SHARED_URGENCY_CLOSES.filter(close => {
    const creatorMatch = !creator || close.creator === creator || close.creator === 'both';
    if (!creatorMatch) return false;
    // If close has no dealTypes restriction, it's universal
    if (!close.dealTypes || close.dealTypes.length === 0) return true;
    // Otherwise, check if any of the close's deal types match the active deal types
    return close.dealTypes.some(dt => dealTypes.includes(dt));
  });
}

// ─── Helper: Get verbatim template for a hook ────────────────────────────────

export function getVerbatimTemplate(hookId: string, creator?: '@momfindsbyfaith' | '@dealscope'): VerbatimTemplate | null {
  const templates = VERBATIM_TEMPLATES[hookId];
  if (!templates || templates.length === 0) return null;
  if (creator) {
    return templates.find(t => t.creator === creator || t.creator === 'both') || templates[0];
  }
  return templates[0];
}

// ─── Helper: Get hybrid bookend for a hook ───────────────────────────────────

export function getHybridBookend(hookId: string, creator?: '@momfindsbyfaith' | '@dealscope'): HybridBookend | null {
  const bookends = HYBRID_BOOKENDS[hookId];
  if (!bookends || bookends.length === 0) return null;
  if (creator) {
    return bookends.find(b => b.creator === creator || b.creator === 'both') || bookends[0];
  }
  return bookends[0];
}

// ─── Helper: Format line bank for LLM prompt ─────────────────────────────────

export function formatLineBankForPrompt(hookId: string, dealTypes?: string[]): string {
  const bank = BOF_LINE_BANK[hookId];
  if (!bank) return '';

  const sections: string[] = [];

  // Creator-balanced addSection: guarantees at least 1 line per creator so new
  // creators are never buried by established creators with more very-high lines.
  const addSection = (title: string, lines: LineVariant[] | undefined, filterByDealTypes = false, count = 4) => {
    if (!lines || lines.length === 0) return;
    let filtered = lines;
    if (filterByDealTypes && dealTypes && dealTypes.length > 0) {
      const relevant = lines.filter(l => !l.dealTypes || l.dealTypes.some(dt => dealTypes.includes(dt)));
      if (relevant.length > 0) filtered = relevant;
    }
    const frequencyOrder = { 'very-high': 0, high: 1, medium: 2, low: 3 };
    const sorted = [...filtered].sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]);
    const creators = Array.from(new Set(sorted.map(l => l.creator).filter(c => c !== 'both')));
    let top: LineVariant[];
    if (creators.length <= 1) {
      top = sorted.slice(0, count);
    } else {
      const selected: LineVariant[] = [];
      const usedIndices = new Set<number>();
      // Round 1: best line per creator
      for (const creator of creators) {
        const idx = sorted.findIndex((l, i) => !usedIndices.has(i) && (l.creator === creator || l.creator === 'both'));
        if (idx !== -1) { selected.push(sorted[idx]); usedIndices.add(idx); }
      }
      // Round 2: fill remaining slots with next-best
      for (let i = 0; i < sorted.length && selected.length < count; i++) {
        if (!usedIndices.has(i)) { selected.push(sorted[i]); usedIndices.add(i); }
      }
      top = selected.slice(0, count);
    }
    sections.push(`### ${title}\n${top.map(l => `- "${l.line}"`).join('\n')}`);
  };

  addSection('TEXT HOOK OPTIONS', bank.textHooks);
  addSection('VERBAL HOOK OPTIONS', bank.verbalHooks);
  addSection('DEAL REVEAL OPENERS', bank.dealRevealOpeners);
  addSection('HOW-TO LINES', bank.howToLines, true);
  if (bank.proofLines) addSection('PROOF POINT LINES', bank.proofLines);
  addSection('COUPON LINES', bank.couponLines);
  addSection('URGENCY CLOSE OPTIONS', bank.urgencyCloses);

  return sections.join('\n\n');
}

// ─── Helper: Format verbatim template for LLM prompt ─────────────────────────

export function formatVerbatimTemplateByIndex(hookId: string, index: number): string {
  const templates = VERBATIM_TEMPLATES[hookId];
  if (!templates || templates.length === 0) return '';
  const template = templates[Math.min(index, templates.length - 1)];
  return `VERBATIM TEMPLATE (fill in [SLOTS] only — do not rewrite the surrounding language):

${template.template}

REQUIRED SLOTS: ${template.slots.join(', ')}

INSTRUCTIONS: Replace each [SLOT] with the appropriate product-specific value. Keep all other language exactly as written. Do not paraphrase, reorder, or add new sentences.`;
}

export function formatVerbatimTemplateForPrompt(hookId: string, creator?: '@momfindsbyfaith' | '@dealscope'): string {
  const template = getVerbatimTemplate(hookId, creator);
  if (!template) return '';

  return `VERBATIM TEMPLATE (fill in [SLOTS] only — do not rewrite the surrounding language):

${template.template}

REQUIRED SLOTS: ${template.slots.join(', ')}

INSTRUCTIONS: Replace each [SLOT] with the appropriate product-specific value. Keep all other language exactly as written. Do not paraphrase, reorder, or add new sentences.`;
}

// ─── Helper: Get all line options for a section (for line scroller) ───────────

export type LineSection = 'textHooks' | 'verbalHooks' | 'dealRevealOpeners' | 'howToLines' | 'proofLines' | 'couponLines' | 'urgencyCloses';

export function getLineOptions(
  hookId: string,
  position: LineSection,
  dealTypes?: string[],
  creator?: '@momfindsbyfaith' | '@dealscope'
): string[] {
  const bank = BOF_LINE_BANK[hookId];
  if (!bank) return [];
  let lines = bank[position] as LineVariant[] | undefined;
  if (!lines || lines.length === 0) return [];

  // Filter by creator if specified
  if (creator) {
    const creatorFiltered = lines.filter(l => l.creator === creator || l.creator === 'both');
    if (creatorFiltered.length > 0) lines = creatorFiltered;
  }

  // Filter by deal type for how-to lines
  if (position === 'howToLines' && dealTypes && dealTypes.length > 0) {
    const relevant = lines.filter(l => !l.dealTypes || l.dealTypes.some(dt => dealTypes.includes(dt)));
    if (relevant.length > 0) lines = relevant;
  }

  // Sort by frequency descending
  return lines
    .sort((a, b) => {
      const order = { 'very-high': 0, high: 1, medium: 2, low: 3 };
      return order[a.frequency] - order[b.frequency];
    })
    .map(l => l.line);
}

// ─── Helper: Get all verbatim template options (for template swap) ────────────

export function getVerbatimTemplateOptions(hookId: string): Array<{
  description: string;
  creator: string;
  template: string;
  slots: string[];
}> {
  const templates = VERBATIM_TEMPLATES[hookId];
  if (!templates || templates.length === 0) return [];
  return templates.map(t => ({
    description: t.description,
    creator: t.creator,
    template: t.template,
    slots: t.slots,
  }));
}

// ─── Helper: Get all urgency close options (for line scroller) ────────────────

export function getUrgencyCloseOptions(
  hookId: string,
  dealTypes?: string[],
  creator?: '@momfindsbyfaith' | '@dealscope'
): string[] {
  // Combine hook-specific closes with shared closes
  const bank = BOF_LINE_BANK[hookId];
  const hookCloses = bank?.urgencyCloses || [];

  const sharedCloses = getClosesForDealTypes(dealTypes || [], creator);

  const allCloses = [...hookCloses, ...sharedCloses];
  const seen = new Set<string>();
  const deduped = allCloses.filter(l => {
    if (seen.has(l.line)) return false;
    seen.add(l.line);
    return true;
  });

  if (creator) {
    const filtered = deduped.filter(l => l.creator === creator || l.creator === 'both');
    if (filtered.length > 0) return filtered.map(l => l.line);
  }

  return deduped
    .sort((a, b) => {
      const order = { 'very-high': 0, high: 1, medium: 2, low: 3 };
      return order[a.frequency] - order[b.frequency];
    })
    .map(l => l.line);
}
