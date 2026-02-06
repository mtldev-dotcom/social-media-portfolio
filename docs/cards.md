# Card System

Every feed item renders as a **Card**.

---

## Card anatomy

| Element        | Required | Description                                     |
|----------------|----------|-------------------------------------------------|
| Type label     | Yes      | POST, NOTE, PROJECT, EXPERIMENT, STORY, ACTIVITY |
| Title          | No       | Short heading (when relevant)                   |
| Body           | Yes      | Short, readable content                         |
| Meta           | Yes      | Date, tags                                      |
| Actions        | No       | Expand, open, run tool (future)                 |

---

## Rules

- No likes, no comments (yet).
- Type label is always visible — helps the reader scan and filter mentally.
- Cards use neutral surfaces (`surface-1`), thin dividers, soft shadow depth.
- Optional glass effect (`.card-glass`) reserved for floating panels only.
