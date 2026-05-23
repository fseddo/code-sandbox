# Database migration

Moving problems + per-user state off `localStorage` onto a real DB. **Not scheduled** — captured here so
it's not lost. The `data/` read API (`getProblem` / `listProblems` / `listProblemSummaries`) and the shared
store seam ([src/lib/localStore.ts](../../src/lib/localStore.ts)) are the swap points: keep their signatures
stable and the migration stays contained.

## Decide first (these block everything else)

### Source of truth — the central trade-off

`defineAlgoProblem<Args, Result>` type-checks every test case's `args`/`expected` against the solution
signature **at compile time**, and problems carry executable payloads (`starterCode`, `solutions[].code`, the
`checker` source string, build `files`). As DB **rows** they become runtime data and that compile-time safety
evaporates. Three options:

| Option | What it means | Trade |
| --- | --- | --- |
| **A. Modules stay source of truth; DB is a generated read-cache** *(recommended for v1)* | Keep authoring in `data/problems/*.ts` (keep `defineAlgoProblem` + the `verifyProblems` gate); a seed script writes rows to Postgres; the app reads from the DB. | Keeps all compile-time safety + the verifier. DB is for query/filter/scale, not authoring. Most faithful to today's design. |
| **B. DB is source of truth; runtime validation** | Author via admin UI / JSON; validate `args`/`expected` against a stored signature at write time (Zod) + re-run the reference solution server-side as the gate. | Enables user-authored problems without a deploy, but rebuilds in runtime code the safety net `defineAlgoProblem` gives for free. |
| **C. Hybrid** | Static/seed problems via modules (A); user/agent-authored via DB (B), unified behind the `data/` read API. | Most flexible, most surface area. Likely the eventual state once the company-sourcer writes to a DB. |

Severity: high — dictates the whole shape.

### ORM + host

Recommend **Drizzle + Postgres**: the schema *is* TypeScript, types are inferred (no codegen / generated
client to keep in sync), and query results flow types through like the existing generics
(`defineAlgoProblem`, `typedEntries`, the facet registry) — it matches the codebase's posture. Prisma is more
batteries-included but adds a generate step and a less TS-native query surface. If you'd rather not host
Postgres yourself, **Supabase** (managed Postgres + auth + row-level security) is worth it *because* the
per-user stores need auth anyway (below) — its RLS enforces "my progress is mine" at the database.
Severity: low — pick when starting.

## The work

- **Sync → async data flow** — the deepest rewrite. Every persisted read is synchronous today: `useState`
  lazy initializers ([useAlgoEditor.ts](../../src/problems/algo/useAlgoEditor.ts) `seed`,
  [useAlgoSubmission.ts](../../src/problems/algo/useAlgoSubmission.ts) `submittedSolution`,
  [useAlgoSettings.ts](../../src/problems/progress/useAlgoSettings.ts)) and `useSyncExternalStore`'s
  `getSnapshot` ([useCachedExternalStore.ts](../../src/lib/useCachedExternalStore.ts)). A DB read is async;
  none can call it directly. Move seed reads into the server component
  ([problems/[id]/page.tsx](../../src/app/problems/[id]/page.tsx)) as props, or a Suspense data layer;
  replace the external-store layer with Server Actions + revalidation (or an optimistic client cache).
  Severity: high.
- **Auth is a prerequisite.** Every per-user store ([progress.ts](../../src/problems/progress/progress.ts),
  [solution.ts](../../src/problems/progress/solution.ts), [settings.ts](../../src/problems/progress/settings.ts))
  is single-browser with no user scope. They can stay local even after `problems` moves to the DB — migrate
  them only once auth lands (a clean split: bank = server, my progress = client until then). Severity: medium.
- **Atomic writes.** `markInProgress` / `markComplete` / `toggleComplete` are read-modify-write — port as
  `UPSERT` / `UPDATE … WHERE`, not read-then-write (lost-update race against a DB). Replace `resetPad`'s
  `window.location.reload()` ([pad.ts](../../src/pad/pad.ts)) with a state reset + revalidation. Severity: medium.
- **`companyProblems` → join table.** [companies.ts](../../src/problems/data/companies.ts) keys associations
  by `ProblemId` (a compile-time FK). Ports to `company_problems(company_id, problem_id)` with a DB FK; the
  linear `problemsForCompany` / `companiesForProblem` scans become indexed queries. Severity: medium (clean port).
- **Per-user state, today → DB shape** (post-auth): `progress` (`noodle:progress` blob) →
  `progress(user_id, problem_id, status, completed_at, solution_json)`; `solution` buffers
  (`noodle:solution:<id>`) → `draft_solutions(user_id, problem_id, language, source)`; editor `settings`
  (`noodle:judge-settings`) → `user_settings(user_id, …)`. Keep the submission-of-record (`CompletedSolution`
  in progress) distinct from the working draft (`solution.ts`).
- **Already DB-friendly — no action.** `toClientProblem`'s `hiddenTests`/`checker` strip and the
  `ProblemSummary` (`Pick`) / `ClientProblem` (`Omit`) projections map straight onto SQL column selection.
