# noodle

> Learn it, practice it, or just start coding.

A self-contained interview-prep workspace — a [CoderPad](https://coderpad.io) + [LeetCode](https://leetcode.com) hybrid in a single [Next.js 16](https://nextjs.org) app — with three sides: **Learn**, **Problems**, and **Pad**. A personal learning project, built to explore generic, type-driven component design in React 19 + TypeScript.

## Features

### Learn
- Typed data-structures-&-algorithms topics rendered as structured articles — complexity tables, worked examples, and hand-rolled SVG diagrams (graphs, matrices, frame-by-frame walkthroughs).
- A sequenced **study guide** layered over the same topics: pick a track, step through patterns chapter by chapter, each with practice problems and an authored intuition → brute-force → walkthrough overlay.

### Problems
- 140 coding problems with a **client-side judge** that runs each submission in a terminable browser Web Worker and grades it against hidden tests, with a per-mode wall-clock timeout that kills infinite loops.
- A filterable catalog (by topic, difficulty, company, and progress) and a ⌘K command palette that searches pages, topics, and problems.
- Open-ended **build problems** ("build a React component that does X") solved in the in-browser bundler and human-evaluated, alongside the auto-graded ones.

### Pad
- Free-coding scratchpads: write React + TypeScript and watch [Vite](https://vite.dev) build it inside a [Sandpack](https://sandpack.codesandbox.io/) container.
- A file tree, live preview, and a custom console, with an event-driven save model that HMR-pushes edits without cold-restarting the dev server.

## How the problem bank was built

The 140 problems and the study-guide pages were sourced and authored with **Claude sub-agents** working against a fixed schema and rubric — one agent maps a problem to the typed model, another sources the problems a given company is known to ask, another authors study-guide pages and a paired agent audits them. Every result is gated through the real judge worker before it lands ([problem-authoring.md](docs/features/problem-authoring.md), [company-sourcing.md](docs/features/company-sourcing.md)).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Press <kbd>⌘K</kbd> to search.

## Testing

```bash
npm test                                 # vitest: I/O converters + every reference solution through the judge worker
node scripts/verifyProblems.mjs [slug]   # standalone problem verifier (optional slug filter)
```

`npm test` runs every problem's reference solution through the actual judge worker against its full visible + hidden test set, so a broken problem or harness regression fails CI.

## Stack

[Next.js 16](https://nextjs.org) App Router · React 19 · TypeScript · [Sandpack](https://sandpack.codesandbox.io/) + [CodeMirror 6](https://codemirror.net) · [shadcn/ui](https://ui.shadcn.com) (Base UI) on [Tailwind v4](https://tailwindcss.com) · [Shiki](https://shiki.style) · a terminable Web Worker for the in-browser judge · [Vitest](https://vitest.dev).

## Docs

Design rationale lives in [`docs/`](docs/), one doc per area: [pad](docs/features/pad.md), [algo + judge](docs/features/algo.md), [catalog & routing](docs/features/navigation.md), [Learn & study guide](docs/features/learn.md), [problem authoring](docs/features/problem-authoring.md), [company sourcing](docs/features/company-sourcing.md). Repo conventions are in [CLAUDE.md](CLAUDE.md); doc organization in [docs/README.md](docs/README.md).
