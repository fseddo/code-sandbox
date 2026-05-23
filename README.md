# Noodle

Noodle is a coding playground with two modes: solve leetcode-style algorithm problems, or take on codepad-style build prompts like "build a React app that does X." Bring your own problems, or let agents source them — scraped from the web, or generated from a one-line summary.

A live code playground in the browser — a CoderPad + LeetCode hybrid for personal use. Write React + TypeScript in the editor, watch [Vite](https://vite.dev) build it inside a [Sandpack](https://sandpack.codesandbox.io/) container, and see the live preview alongside the console.

Each pad has its own URL (`/pad/<id>`) and autosaves to localStorage in this browser. The algorithm side ships a **server-side judge** (a terminable worker thread running `node:vm`) and a typed problem bank of **100+ problems** spanning arrays, strings, linked lists, binary trees, DP, and backtracking. Server-side persistence is planned next.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — `New pad` mints a fresh id and drops you into the workspace.

## Testing

```bash
npm test           # vitest: io converters + every reference solution through the real judge worker
npm run test:watch # watch mode
node scripts/verifyProblems.mjs [slug]   # standalone problem verifier (optional slug filter)
```

The suite runs each problem's reference solution against its full example + hidden set (submit mode), so a broken problem or harness regression fails CI. See [docs/features/problem-authoring.md](docs/features/problem-authoring.md).

## Stack

- [Next.js 16](https://nextjs.org) App Router, React 19
- [Sandpack](https://sandpack.codesandbox.io/) for in-browser Vite bundling
- [shadcn/ui](https://ui.shadcn.com) (Base UI variant) on Tailwind v4
- [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) v4 for the split panes

## For agents and contributors

- Repo orientation, conventions, and routing to feature docs → [CLAUDE.md](CLAUDE.md)
- Next.js 16 specifics → [AGENTS.md](AGENTS.md)
- Doc layout + how docs grow with the codebase → [docs/README.md](docs/README.md)
