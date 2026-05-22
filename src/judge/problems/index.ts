import type { AnyProblem, ClientProblem, Problem } from "../problem";
import { twoSum } from "./twoSum";
import { addTwoNumbers } from "./addTwoNumbers";
import { lengthOfLongestSubstring } from "./lengthOfLongestSubstring";
import { findMedianSortedArrays } from "./findMedianSortedArrays";
import { longestPalindrome } from "./longestPalindrome";
import { zigzagConversion } from "./zigzagConversion";
import { reverseInteger } from "./reverseInteger";
import { myAtoi } from "./myAtoi";
import { palindromeNumber } from "./palindromeNumber";
import { isMatch } from "./isMatch";
import { fizzBuzz } from "./fizzBuzz";
import { isPalindrome } from "./isPalindrome";
import { mergeIntervals } from "./mergeIntervals";
import { groupAnagrams } from "./groupAnagrams";
import { makeStringSubsequenceCyclic } from "./makeStringSubsequenceCyclic";
import { buildStarRating } from "./buildStarRating";
import { buildDebouncedAutocomplete } from "./buildDebouncedAutocomplete";

/**
 * The problem bank, keyed by id. Authored modules keep their precise generics for
 * test-case safety; the registry erases them to `AnyProblem` so it can hold
 * heterogeneous signatures and both kinds. `satisfies` keeps the key/value relationship checked.
 */
export const problems = {
  [twoSum.id]: twoSum,
  [addTwoNumbers.id]: addTwoNumbers,
  [lengthOfLongestSubstring.id]: lengthOfLongestSubstring,
  [findMedianSortedArrays.id]: findMedianSortedArrays,
  [longestPalindrome.id]: longestPalindrome,
  [zigzagConversion.id]: zigzagConversion,
  [reverseInteger.id]: reverseInteger,
  [myAtoi.id]: myAtoi,
  [palindromeNumber.id]: palindromeNumber,
  [isMatch.id]: isMatch,
  [fizzBuzz.id]: fizzBuzz,
  [isPalindrome.id]: isPalindrome,
  [mergeIntervals.id]: mergeIntervals,
  [groupAnagrams.id]: groupAnagrams,
  [makeStringSubsequenceCyclic.id]: makeStringSubsequenceCyclic,
  [buildStarRating.id]: buildStarRating,
  [buildDebouncedAutocomplete.id]: buildDebouncedAutocomplete,
} satisfies Record<string, AnyProblem>;

export type ProblemId = keyof typeof problems;

/** Full problem incl. server-only fields — narrow on `kind` at the call site. Never hand this to a client component. */
export const getProblem = (id: string): AnyProblem | undefined =>
  (problems as Record<string, AnyProblem>)[id];

export const listProblems = (): AnyProblem[] => Object.values(problems);

/** Drop `keys` from `value`, keeping the result type *derived* (`Omit<T, K>`) rather than cast. */
const omit = <T extends object, K extends keyof T>(value: T, keys: readonly K[]): Omit<T, K> => {
  const copy = { ...value };
  for (const key of keys) delete (copy as Partial<T>)[key];
  return copy;
};

/** Strip the server-only fields (hidden tests, answer-checker), leaving a shape safe to serialize into client props. */
export const toClientProblem = (problem: Problem): ClientProblem => omit(problem, ["hiddenTests", "checker"]);
