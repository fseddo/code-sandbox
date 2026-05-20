---
name: commit-review
description: Pre-commit review. Runs a two-agent pipeline (auditor → validator) over pending uncommitted work — staged + unstaged + untracked — and produces a verified audit + remediation plan. Use when the user types /commit-review or asks for a review/audit/check of pending changes before committing. Does not edit source code; does not commit.
---

# commit-review

Two-agent pipeline that reviews **pending uncommitted work** as a pre-commit gate. The user runs this *before* `git commit`; the output is a validated audit + plan they apply before staging the final commit.

## Pipeline

1. **commit-auditor** reads the rules and the pending work (staged + unstaged + untracked), walks each change, and writes a structured audit file.
2. **audit-validator** reads the audit, independently re-checks each finding against the same worktree, marks confirmed / amended / dismissed, and rewrites the file with a `## Plan` section.
3. You surface the path and the headline counts. The user reviews, applies plan items they accept, then commits when they're ready.

You do **not** apply the plan yourself in this skill, and you do **not** commit. The skill ends when the validator returns and you've reported the result.

## Steps

### 1. Confirm there's something to review

Run `git status --short` first. If the output is empty, there is no pending work — tell the user there's nothing to review and stop.

If the output is non-empty, note the breakdown (how many staged / unstaged / untracked files) so you can summarize at the end.

### 2. Establish the audit file path

The audit lives at the repo root:

```
commit-audit.md
```

A transient file — the user opens it in their editor while reviewing, and you delete it once they're done (see step 6). Make sure `commit-audit.md` is in `.gitignore` so a stray run never leaks into a commit; if it isn't, add it before spawning the auditor. If the file already exists from a previous run, it'll be overwritten by the auditor; don't prompt about it.

### 3. Spawn `commit-auditor`

Use `Agent(subagent_type="commit-auditor", ...)`. The prompt must be self-contained — the agent starts cold with no memory of this conversation. Include:

- The audit-file path it must write to (`commit-audit.md`).
- That it's auditing **pending uncommitted work** against `HEAD` — staged + unstaged + untracked — not the last commit itself.
- A one-sentence pointer that the project rules live in `CLAUDE.md` / `AGENTS.md` / `CLAUDE.local.md` and the docs in `docs/`.
- The expectation that it writes exactly one file and edits nothing else.

Wait for it to return. Don't run it in the background — the validator needs its output.

### 4. Spawn `audit-validator`

After the auditor returns, spawn `audit-validator` with a prompt that includes:

- The same audit-file path (the validator edits it in place).
- That it's validating against the current worktree (same staged + unstaged + untracked changes).
- A reminder that it should independently re-check each finding against the actual diff rather than rubber-stamping.

Wait for it to return.

### 5. Report to the user

After the validator returns, do **not** dump the audit's contents back at the user. Instead:

- Read the validated audit file yourself (a quick `Read` is enough — you need the header counts and the plan).
- Tell the user the audit path so they can open it.
- Surface: the audit date, the staged/unstaged/untracked file counts, confirmed/amended/dismissed counts, and a one-line preview of each plan item.
- If `## Open questions` has any entries, surface them directly — those want an answer before any plan item is applied.
- Ask whether they want to proceed with the plan, edit it, or stop.

### 6. Clean up the audit file

The audit is transient. Once the user has told you whether they want to proceed / edit / stop (i.e. after step 5's question is answered, regardless of their choice), delete `commit-audit.md`. Don't delete it before that — they may want to keep it open in their editor while they read the plan.

If the user picks "edit," wait for the editing pass to land and then delete. If they pick "stop," delete and end. If they pick "proceed" and you go on to apply the plan in a follow-up turn, delete after the apply lands.

Example shape of your final message:

```
Pre-commit audit ready at [commit-audit.md](commit-audit.md).

Pending: <n staged> · <n unstaged> · <n untracked>
Findings: <n confirmed> · <n amended> · <n dismissed>

Plan:
1. <one-line summary> (refs V1)
2. <one-line summary> (refs D1)
3. <one-line summary> (refs V2)

Open questions:
- <if any>

Want me to apply the plan, edit it first, or stop here?
```

### 7. Draft a commit message (after the plan has landed)

This step runs only if the user picked "proceed" in step 5 *and* you've finished applying the plan in the follow-up turn(s). It does not run if they picked "stop," "edit" without a subsequent apply, or interrupted the apply mid-way.

When the apply is complete (typecheck/build clean, all chosen plan items done):

- Look at the diff (`git diff` + `git diff --staged` + the untracked file list) — that's the **actual** scope of the commit, which may be narrower than the plan if the user dropped items mid-apply.
- Draft a commit message in the project's existing style. To check style, glance at `git log --oneline -5` and read 1–2 recent commit bodies if needed.
- **Length: 2–3 sentences, each ≤100 chars / one printed line.** If a sentence wraps past that, cut it — short clauses, simple verbs, no nested colons. Even when the pending work is large, the message stays tight: describe the arc, not the inventory. The diff is the inventory.
- Surface the draft to the user as text, not by running `git commit`. They edit or accept; you commit only on their explicit go-ahead.
- Do not commit on your own. The skill description still ends with "It does not run `git commit`" — the message is a *proposal* the user threads back to a manual or follow-up commit.

## Edge cases

- **Working tree clean** (`git status --short` is empty). Nothing to review — tell the user and stop. Don't spawn either agent.
- **Only docs / `.gitignore` / config changed.** Still run the pipeline — the auditor will check docs rules and the validator will produce a thin (or empty) plan. The user explicitly asked.
- **No commits yet on this branch** (initial state). The base is the empty tree; the diff is "everything." Still run; the auditor handles it.
- **One of the agents fails or returns an empty audit.** Don't retry silently. Report what happened and stop; the user decides whether to re-run.
- **User re-runs after applying some plan items.** Expected — the audit file is overwritten each run, so the second run sees only what's still pending.
- **Stale `commit-audit.md` from a crashed run.** If the file exists when the skill starts, treat it as leftover debris: it'll be overwritten by the auditor anyway. Don't prompt; don't try to resume from it.

## What this skill is not

- It's not a fix-it pass. The agents don't edit source. The plan in the audit is a *proposal*; applying it is a separate user-initiated action.
- It's not a substitute for tests, types, or builds. It checks pending work against the project's stated conventions and doc coverage — nothing else.
- It's not a post-commit review. The audit is of what's **about to be** committed, not what already was. (If you want to review the last commit instead, that's a different skill.)
- It does not run `git commit`. Even if the audit is clean.
