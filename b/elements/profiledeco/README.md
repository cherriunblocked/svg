# Profile effect assets

Drop card-sized transparent images here. Shop `profile_effect` items load
them by filename (`payload.asset`). Missing files fall back to a CSS
gradient/pattern keyed off `payload.style`.

The overlay renders at the full card size (384×~variable) with
`object-cover` and fades in/out with the card open animation, mimicking
Discord's card effects. Animated formats (gif, apng, webp) loop.

Seeded slots:
- `aurora.gif`
- `grid.png`
- `confetti.gif`
- `sparkles.gif`
