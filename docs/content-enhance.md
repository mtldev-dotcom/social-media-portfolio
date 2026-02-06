This is written like an **internal build plan**, not marketing fluff.

---

# 🧠 NICKYBRUNO.COM — PERSONAL MEDIA PAGE

**Build Plan for Cursor**

**Positioning**

* Personal portfolio / CV / storyboard / blog
* Audience: friends, peers, curious builders
* Goal: signal taste, thinking, experimentation
* No selling, no funnels, no pressure
* Business lives at `aiaa.dev`

---

## PHASE 0 — FRAME THE SITE (DO THIS FIRST)

### Task 0.1 — Lock the site purpose

Create `/docs/vision.md`

**Content**

```
This site is a living personal media page.
It documents what I build, think about, experiment with, and abandon.

It is not a business site.
It is not a sales funnel.
It is allowed to be unfinished, playful, and evolving.
```

---

### Task 0.2 — Define content taxonomy

Create `/docs/content-types.md`

**Define exactly these types**

```
POST        — short thoughts, notes, opinions
PROJECT     — things I built (polished or not)
NOTE        — learnings, reflections, reminders
EXPERIMENT  — tools, playgrounds, weird ideas
STORY       — timeline / experience / background
ACTIVITY    — status updates, availability, changes
```

Each item must have:

* type
* timestamp
* optional tags
* optional media

---

## PHASE 1 — INFORMATION ARCHITECTURE

### Task 1.1 — Feed-first mental model

Create `/docs/feed-model.md`

**Rules**

* Everything appears in one chronological feed
* No “pages” in the traditional sense
* Filters are optional views, not navigation
* Feed is the homepage

---

### Task 1.2 — Navigation (minimal)

Update header logic:

```
Home (feed)
About (static snapshot)
Lab (experiments/tools)
Notes (filtered feed)
```

No Services
No Pricing
No CTA buttons

---

## PHASE 2 — UI STRUCTURE (MATCH YOUR BETA)

### Task 2.1 — Define layout contract

Create `/docs/layout.md`

**Desktop**

* Left: icon rail
* Center: feed
* Right: profile + stats + AI guide

**Mobile**

* Single column feed
* Profile collapses into top card
* AI Guide as bottom sheet

---

### Task 2.2 — Card system

Create `/docs/cards.md`

Each feed item renders as a **Card** with:

```
• type label (POST, NOTE, PROJECT…)
• title (optional)
• body (short, readable)
• meta (date, tags)
• optional actions (expand, open, run tool)
```

No likes, no comments (yet).

---

## PHASE 3 — COPY & CONTENT (SIGNAL > POLISH)

### Task 3.1 — Global tone rules

Create `/docs/voice.md`

**Rules**

* Short sentences
* Calm confidence
* No buzzwords
* Write like you talk
* Lowercase allowed
* Honest > impressive

---

### Task 3.2 — Profile header copy

Hardcode (for now):

```
Nicky Bruno
creative technologist · ai & automation

i build calm systems.
sometimes i write about them.
```

Status:

```
currently building · experimenting · available to chat
```

---

### Task 3.3 — Seed content (important)

Create `/content/seed.json`

Add **at least 10 items**:

* 3 POSTS
* 2 NOTES
* 2 PROJECTS
* 2 EXPERIMENTS
* 1 STORY

This makes the site feel alive immediately.

---

## PHASE 4 — AI GUIDE (NOT A CHATBOT)

### Task 4.1 — Reframe AI Concierge → AI Guide

Rename everywhere:

```
AI Guide
```

Copy:

```
Ask me about anything on this page.
Projects, notes, tools, or why I built something.
```

---

### Task 4.2 — Scope the AI Guide

Create `/docs/ai-guide.md`

**Rules**

* Answers only from site content
* No generic advice
* Calm, concise responses
* “I don’t know” is acceptable

This is a **site interpreter**, not an assistant.

---

## PHASE 5 — FUN / FLEX FEATURES (CORE VALUE)

### Task 5.1 — Lab section

Create `/docs/lab.md`

Lab contains:

* tools
* experiments
* interactive demos
* unfinished ideas

Each lab item:

```
what it is
why i built it
what i learned
```

---

### Task 5.2 — Timeline mode

Create `/docs/timeline.md`

Optional toggle:

```
Feed view  ↔  Timeline view
```

Timeline groups content by year:

* 2024
* 2023
* earlier

This doubles as your CV.

---

### Task 5.3 — “Things I abandoned”

Create `/docs/abandoned.md`

This is optional but powerful.

Tone:

```
Stuff I tried.
Stuff that didn’t stick.
Lessons learned.
```

People love this.

---

## PHASE 6 — VISUAL & UX POLISH

### Task 6.1 — Color discipline

Lock palette:

```
Black
White
Grayscale
One blue accent
```

Rules:

* Blue = action, focus, links
* Never decorative
* No gradients
* No extra colors

---

### Task 6.2 — Motion rules

Create `/docs/motion.md`

Rules:

* Subtle only
* No attention-grabbing animation
* Motion supports clarity, not delight
* Respect reduced-motion

---

## PHASE 7 — CONTENT MAINTENANCE SYSTEM

### Task 7.1 — Writing flow

Decide:

* Markdown or JSON
* Local-first
* Easy to add entries fast

Goal:

```
Adding a new POST takes < 60 seconds
```

---

### Task 7.2 — “This page changes often”

Add footer note:

```
This page is a living document.
It changes often.
```

This gives you permission to iterate forever.

---

## PHASE 8 — CONNECTION TO AIAA.DEV

### Task 8.1 — Soft link only

One discreet link:

```
Working on more serious things → aiaa.dev
```

No tracking.
No emphasis.
No pitch.

---

# 🧩 FINAL CURSOR INSTRUCTION

When working in Cursor:

* Do NOT optimize for SEO
* Do NOT add marketing sections
* Do NOT over-engineer
* Favor clarity over cleverness
* Favor shipping over perfection

---