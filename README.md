# codepad

A live code playground in the browser — a CoderPad + LeetCode hybrid for personal use. Write React + TypeScript in the editor, watch [Vite](https://vite.dev) build it inside a [Sandpack](https://sandpack.codesandbox.io/) container, and see the live preview alongside the console.

Each pad has its own URL (`/pad/<id>`) and autosaves to localStorage in this browser. Persistence and a server-side LeetCode-style judge are planned next.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — `New pad` mints a fresh id and drops you into the workspace.

## Stack

- [Next.js 16](https://nextjs.org) App Router, React 19
- [Sandpack](https://sandpack.codesandbox.io/) for in-browser Vite bundling
- [shadcn/ui](https://ui.shadcn.com) (Base UI variant) on Tailwind v4
- [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) v4 for the split panes

## For agents and contributors

- Repo orientation, conventions, and routing to feature docs → [CLAUDE.md](CLAUDE.md)
- Next.js 16 specifics → [AGENTS.md](AGENTS.md)
- Doc layout + how docs grow with the codebase → [docs/README.md](docs/README.md)
