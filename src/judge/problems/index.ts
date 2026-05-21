import type { Problem } from "../problem";
import { twoSum } from "./twoSum";
import { fizzBuzz } from "./fizzBuzz";
import { isPalindrome } from "./isPalindrome";

/**
 * The problem bank, keyed by id. Authored modules keep their precise generics for
 * test-case safety; the registry erases them to the base `Problem` so it can hold
 * heterogeneous signatures. `satisfies` keeps the key/value relationship checked.
 */
export const problems = {
  [twoSum.id]: twoSum,
  [fizzBuzz.id]: fizzBuzz,
  [isPalindrome.id]: isPalindrome,
} satisfies Record<string, Problem>;

export type ProblemId = keyof typeof problems;

export const getProblem = (id: string): Problem | undefined =>
  (problems as Record<string, Problem>)[id];

export const listProblems = (): Problem[] => Object.values(problems);
