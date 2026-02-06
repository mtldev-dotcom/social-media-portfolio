# Layout Contract

---

## Desktop (>= 1024px)

- **Left**: icon rail (Home, About, Lab, Notes) + theme toggle + language switcher
- **Center**: feed (or route-specific content)
- **Right**: profile summary + stats + AI Guide

## Mobile (< 1024px)

- Single column feed
- Profile collapses into top card
- AI Guide as bottom sheet or hidden
- Left nav becomes horizontal row at top

---

## Grid

```
grid-cols-[72px_minmax(0,1fr)_360px]
```

- Left column: 72px fixed
- Center: fluid
- Right column: 360px fixed
- Gap: 1rem (16px)
- Max width: 1260px, centered
