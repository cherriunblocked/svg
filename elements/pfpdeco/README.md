# Avatar decoration assets

Drop transparent square images here. The shop's `avatar_decoration` items
reference these by filename (`payload.asset`). Missing files fall back to a
colored ring drawn from `payload.style`.

Expected shape: transparent-center frame that overshoots the pfp by ~35%
(same layout as Discord decorations). Any format the browser can load
works — png, apng, gif, webp.

A file dropped in here is inert until it has a `SEED` entry in
`server/routes/shop.ts` — that's what gives it a price and puts it in the
shop. The catalog there is the source of truth; this list used to be
duplicated here and went stale.
