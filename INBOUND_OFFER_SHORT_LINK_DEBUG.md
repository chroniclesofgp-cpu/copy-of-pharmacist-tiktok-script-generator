# Inbound offer short-link debugging

## Reproduction

Date: 2026-09-12

Input: `https://www.tiktok.com/t/ZT9S4V7yVJQN8-McluG/`

On the live Product Radar page, Audit Inbound Offer accepted the input, entered a loading state, then displayed the user-facing error:

> Product audit error: product not found

The URL remained in the input field and no new candidate card was created.

## Initial diagnosis

`extractProductIdFromQuery` only extracts a contiguous 16–21 digit sequence from the submitted text. The supplied TikTok `/t/` short URL contains no product ID, so the router falls through to the name-search branch and calls Kalodata product search with the entire short URL as the keyword. That is not a product name and returns no results, which produces the generic `product not found` error.

The current UI says TikTok Shop URLs are supported, but the implementation only supports URLs that already contain a visible numeric product ID. It does not resolve TikTok short links before searching.

Next step: add safe server-side short-link resolution or a clearer unsupported-short-link message, then regression-test this exact URL format without affecting exact IDs, full product URLs, or product-name searches.
