import type { ClientProblem, Problem } from "../problem";
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

/** Full problem incl. hidden tests — server-only (the registry, the judge route). Never hand this to a client component. */
export const getProblem = (id: string): Problem | undefined =>
  (problems as Record<string, Problem>)[id];

export const listProblems = (): Problem[] => Object.values(problems);

/** Strip the server-only hidden tests, leaving the shape safe to serialize into a client component's props. */
export const toClientProblem = (problem: Problem): ClientProblem => {
  const clientProblem: Problem = { ...problem };
  delete clientProblem.hiddenTests;
  return clientProblem;
};
