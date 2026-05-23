# Database migration

Moving problems + per-user state off `localStorage` onto a real DB. **Not scheduled** — captured here
so the active audit can close. Full analysis (options, trade-offs, what ports cleanly) lives in
[audits/2026-05-tech-debt.md §5](../audits/2026-05-tech-debt.md) and the second-opinion §5; this is the
punch list, not the explanation. The `data/` read API (`getProblem` / `listProblems` /
`listProblemSummaries`) and the `createLocalStore` seam ([src/lib/localStore.ts](../../src/lib/localStore.ts))
are the swap points — keep their signatures stable and the migration stays contained.

## Decide first (block everything else)

- **Source of truth (§5.2).** Pick A / B / C. Recommended **A**: TS modules stay authoritative +
  `defineAlgoProblem` safety + `verifyProblems` gate; DB is a generated read-cache for query/filter/scale.
  Severity: high (dictates the whole shape).
- **ORM + host (§5.9).** Recommended **Drizzle + Postgres** (schema-as-TS, inferred types, no codegen);
  reach for **Supabase** if you want bundled auth + RLS, which §5.4 needs anyway. Severity: low (pick when starting).

## The work

- **Sync → async data flow (§5.7).** Every persisted read is synchronous today — `useState` lazy
  initializers ([useAlgo.ts](../../src/problems/algo/useAlgo.ts) `seed`, [useAlgoSettings.ts](../../src/problems/progress/useAlgoSettings.ts))
  and `useSyncExternalStore`'s `getSnapshot` ([useCachedExternalStore.ts](../../src/lib/useCachedExternalStore.ts)).
  A DB read is async; none can call it directly. Move seed reads into the server component
  ([problems/[id]/page.tsx](../../src/app/problems/[id]/page.tsx)) as props, or a Suspense data layer;
  replace the external-store layer with Server Actions + revalidation. Severity: high (deepest rewrite).
- **Auth is a prerequisite (§5.4, §5.8).** Every per-user store ([progress.ts](../../src/problems/progress/progress.ts),
  [solution.ts](../../src/problems/progress/solution.ts), [settings.ts](../../src/problems/progress/settings.ts))
  is single-browser with no user scope. They can stay local even after `problems` moves to the DB —
  migrate them only once auth lands. Severity: medium.
- **Atomic writes (§5.8).** `markInProgress` / `markComplete` / `toggleComplete` are read-modify-write —
  port as `UPSERT` / `UPDATE … WHERE`, not read-then-write (lost-update race against a DB). Replace
  `resetPad`'s `window.location.reload()` ([pad.ts](../../src/pad/pad.ts)) with a state reset + revalidation.
  Severity: medium.
- **`companyProblems` → join table (§5.3).** [companies.ts](../../src/problems/data/companies.ts) keys
  associations by `ProblemId` (a compile-time FK). Ports to `company_problems(company_id, problem_id)`
  with a DB FK; linear scans become indexed queries. Severity: medium (clean port).
- **Already DB-friendly (§5.5) — no action.** `toClientProblem`'s `hiddenTests`/`checker` strip and the
  `ProblemSummary`/`ClientProblem` projections map straight onto SQL column selection.
