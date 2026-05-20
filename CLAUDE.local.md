# Local rules (gitignored)

Personal preferences and in-progress conventions that haven't been pinned into the shipped CLAUDE files yet.

Repo-wide things and the doc routing table live in [`CLAUDE.md`](CLAUDE.md). Frontend rules live in [`frontend/CLAUDE.md`](frontend/CLAUDE.md). Backend rules live in [`backend/CLAUDE.md`](backend/CLAUDE.md). When a rule here stabilizes (multiple instances, user agreement), promote it into the appropriate scoped file.

## Project posture: learning sandbox

This codebase is a learning playground, not a production app on a deadline. The user is especially drawn to **smart components with clever TypeScript** — generics, mapped/conditional types, render-prop APIs, single-source literal unions — as a way to test their ability to build generic, reusable, large-scale frontend solutions.

- When asked "should we do X?" and X is more rigorous, generic, or type-clever than strictly required, weight learning value alongside necessity. "You don't need this" is rarely the right framing — the answer is rarely about _need_.
- Lean toward generic, type-safe, reusable shapes. Smart TS is the point, not a smell.
- **Still be honest about tradeoffs.** Frame as "this is more complex but here's what it teaches / what it costs," not "do the simpler thing." If clever has real bug or maintenance hazards, say so — learning includes knowing when clever bites.
- **The frame raises the floor on acceptable complexity, not the ceiling on bad design.** Pushback still stands when a design is genuinely worse — couples a low-level reusable component to a global, harms reusability, contradicts a pinned rule. The learning lens doesn't override those.
