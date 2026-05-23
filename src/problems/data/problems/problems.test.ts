import { describe, it, expect } from "vitest";
import type { AlgoProblem } from "../problem";
import { listProblems, getProblem, problems } from "./index";
import { runTests } from "@/problems/algo/tester/runTests";

const algoProblems = listProblems().filter((p): p is AlgoProblem => p.kind === "algo");

// The repo-scale correctness gate: each reference solution must pass every example + hidden case
// against the real judge worker (submit mode). Mirrors scripts/verifyProblems.mjs as proper test cases
// so a failure points at the offending problem. See docs/features/problem-authoring.md.
describe("reference solutions pass their own cases (submit mode)", () => {
  for (const problem of algoProblems) {
    it(problem.id, async () => {
      const source = problem.solutions?.[0]?.code?.javascript;
      expect(source, `${problem.id}: missing JS reference solution`).toBeTruthy();
      const outcome = await runTests({ problem, language: "javascript", source: source!, mode: "submit" });
      expect(outcome.status, `${problem.id}: ${JSON.stringify(outcome)}`).toBe("ok");
      if (outcome.status === "ok") {
        const failed = outcome.results.filter((r) => !r.passed).map((r) => r.name);
        expect(failed, `${problem.id}: failing cases`).toEqual([]);
      }
    });
  }
});

// The registry key must equal the module's `id` — this is what lets `ProblemId = keyof typeof problems`
// be a real union of ids rather than a typo-prone duplicate. Cheap drift guard.
describe("registry integrity", () => {
  it("every key matches its problem's id", () => {
    const mismatched = Object.entries(problems).filter(([key, problem]) => key !== problem.id);
    expect(mismatched.map(([key, p]) => `${key} -> ${p.id}`)).toEqual([]);
  });

  it("every problem carries a unique positive integer number", () => {
    const numbers = algoProblems.map((p) => p.number).concat(
      listProblems().filter((p) => p.kind === "build").map((p) => p.number),
    );
    expect(numbers.every((n) => Number.isInteger(n) && n > 0)).toBe(true);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});

// Proves the in-place harness path: the checker sees post-call args, so a solution that returns a fresh
// array (instead of mutating in place) fails the `actual === args[0]` reference-equality assertion.
describe("in-place reference-equality gate", () => {
  it("rejects a sort-colors solution that returns a copy", async () => {
    const problem = getProblem("sort-colors") as AlgoProblem;
    const cheat = "function sortColors(nums) { return [...nums].sort((a, b) => a - b); }";
    const outcome = await runTests({ problem, language: "javascript", source: cheat, mode: "run" });
    expect(outcome.status).toBe("ok");
    if (outcome.status === "ok") {
      expect(outcome.results.some((r) => !r.passed)).toBe(true);
    }
  });
});
