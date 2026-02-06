# Motion Rules

---

## Principles

- Subtle only.
- No attention-grabbing animation.
- Motion supports clarity, not delight.
- Respect `prefers-reduced-motion`.

---

## Allowed

- Fade transitions on theme toggle
- Hover state color transitions (150–200ms)
- Focus ring appearance

## Not allowed

- Entrance animations (slide-in, bounce)
- Loading spinners that dominate the viewport
- Parallax scrolling
- Decorative motion

---

## Implementation

`app/globals.css` includes a `@media (prefers-reduced-motion: reduce)` block
that disables all transitions and animations for users who request it.
