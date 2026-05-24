import type { AnyProblem, ClientProblem, AlgoProblem, ProblemBase, ProblemKind } from "../problem";
import { type CompanyTag, companiesForProblem } from "../companies";
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
import { inorderTraversal } from "./inorderTraversal";
import { mergeKLists } from "./mergeKLists";
import { sortColors } from "./sortColors";
import { maxArea } from "./maxArea";
import { integerToRoman } from "./integerToRoman";
import { romanToInteger } from "./romanToInteger";
import { longestCommonPrefix } from "./longestCommonPrefix";
import { threeSum } from "./threeSum";
import { threeSumClosest } from "./threeSumClosest";
import { letterCombinations } from "./letterCombinations";
import { fourSum } from "./fourSum";
import { removeNthNodeFromEndOfList } from "./removeNthNodeFromEndOfList";
import { validParentheses } from "./validParentheses";
import { mergeTwoSortedLists } from "./mergeTwoSortedLists";
import { generateParentheses } from "./generateParentheses";
import { swapNodesInPairs } from "./swapNodesInPairs";
import { reverseNodesInKGroup } from "./reverseNodesInKGroup";
import { removeDuplicatesFromSortedArray } from "./removeDuplicatesFromSortedArray";
import { removeElement } from "./removeElement";
import { strStr } from "./strStr";
import { divide } from "./divide";
import { findSubstring } from "./findSubstring";
import { nextPermutation } from "./nextPermutation";
import { longestValidParentheses } from "./longestValidParentheses";
import { search } from "./search";
import { searchRange } from "./searchRange";
import { searchInsert } from "./searchInsert";
import { isValidSudoku } from "./isValidSudoku";
import { solveSudoku } from "./solveSudoku";
import { countAndSay } from "./countAndSay";
import { combinationSum } from "./combinationSum";
import { combinationSum2 } from "./combinationSum2";
import { firstMissingPositive } from "./firstMissingPositive";
import { trap } from "./trap";
import { multiply } from "./multiply";
import { wildcardMatching } from "./wildcardMatching";
import { jump } from "./jump";
import { permute } from "./permute";
import { permuteUnique } from "./permuteUnique";
import { rotateImage } from "./rotateImage";
import { myPow } from "./myPow";
import { solveNQueens } from "./solveNQueens";
import { totalNQueens } from "./totalNQueens";
import { maxSubArray } from "./maxSubArray";
import { spiralOrder } from "./spiralOrder";
import { canJump } from "./canJump";
import { insert } from "./insert";
import { lengthOfLastWord } from "./lengthOfLastWord";
import { generateMatrix } from "./generateMatrix";
import { getPermutation } from "./getPermutation";
import { rotateRight } from "./rotateRight";
import { uniquePaths } from "./uniquePaths";
import { uniquePathsWithObstacles } from "./uniquePathsWithObstacles";
import { minPathSum } from "./minPathSum";
import { isNumber } from "./isNumber";
import { plusOne } from "./plusOne";
import { addBinary } from "./addBinary";
import { fullJustify } from "./fullJustify";
import { mySqrt } from "./mySqrt";
import { climbingStairs } from "./climbingStairs";
import { simplifyPath } from "./simplifyPath";
import { editDistance } from "./editDistance";
import { setZeroes } from "./setZeroes";
import { searchMatrix } from "./searchMatrix";
import { minWindow } from "./minWindow";
import { combine } from "./combine";
import { subsets } from "./subsets";
import { exist } from "./exist";
import { removeDuplicates } from "./removeDuplicates";
import { searchInRotatedSortedArrayII } from "./searchInRotatedSortedArrayII";
import { deleteDuplicatesII } from "./deleteDuplicatesII";
import { deleteDuplicates } from "./deleteDuplicates";
import { largestRectangleArea } from "./largestRectangleArea";
import { maximalRectangle } from "./maximalRectangle";
import { partitionList } from "./partitionList";
import { scrambleString } from "./scrambleString";
import { mergeSortedArray } from "./mergeSortedArray";
import { grayCode } from "./grayCode";
import { subsetsWithDup } from "./subsetsWithDup";
import { decodeWays } from "./decodeWays";
import { reverseBetween } from "./reverseBetween";
import { restoreIpAddresses } from "./restoreIpAddresses";
import { generateTrees } from "./generateTrees";
import { numTrees } from "./numTrees";
import { isInterleave } from "./isInterleave";
import { isValidBST } from "./isValidBST";
import { recoverTree } from "./recoverTree";
import { isSameTree } from "./isSameTree";
import { buildStarRating } from "./buildStarRating";
import { buildDebouncedAutocomplete } from "./buildDebouncedAutocomplete";
import { numberOfProvinces } from "./numberOfProvinces";

/**
 * The problem bank, keyed by id. Authored modules keep their precise generics for
 * test-case safety; the registry erases them to `AnyProblem` so it can hold
 * heterogeneous signatures and both kinds. `satisfies` keeps the key/value relationship checked.
 */
export const problems = {
  "two-sum": twoSum,
  "add-two-numbers": addTwoNumbers,
  "longest-substring-without-repeating-characters": lengthOfLongestSubstring,
  "median-of-two-sorted-arrays": findMedianSortedArrays,
  "longest-palindromic-substring": longestPalindrome,
  "zigzag-conversion": zigzagConversion,
  "reverse-integer": reverseInteger,
  "string-to-integer-atoi": myAtoi,
  "palindrome-number": palindromeNumber,
  "regular-expression-matching": isMatch,
  "fizz-buzz": fizzBuzz,
  "valid-palindrome": isPalindrome,
  "merge-intervals": mergeIntervals,
  "group-anagrams": groupAnagrams,
  "make-string-a-subsequence-using-cyclic-increments": makeStringSubsequenceCyclic,
  "binary-tree-inorder-traversal": inorderTraversal,
  "merge-k-sorted-lists": mergeKLists,
  "sort-colors": sortColors,
  "container-with-most-water": maxArea,
  "integer-to-roman": integerToRoman,
  "roman-to-integer": romanToInteger,
  "longest-common-prefix": longestCommonPrefix,
  "3sum": threeSum,
  "3sum-closest": threeSumClosest,
  "letter-combinations-of-a-phone-number": letterCombinations,
  "4sum": fourSum,
  "remove-nth-node-from-end-of-list": removeNthNodeFromEndOfList,
  "valid-parentheses": validParentheses,
  "merge-two-sorted-lists": mergeTwoSortedLists,
  "generate-parentheses": generateParentheses,
  "swap-nodes-in-pairs": swapNodesInPairs,
  "reverse-nodes-in-k-group": reverseNodesInKGroup,
  "remove-duplicates-from-sorted-array": removeDuplicatesFromSortedArray,
  "remove-element": removeElement,
  "find-the-index-of-the-first-occurrence-in-a-string": strStr,
  "divide-two-integers": divide,
  "substring-with-concatenation-of-all-words": findSubstring,
  "next-permutation": nextPermutation,
  "longest-valid-parentheses": longestValidParentheses,
  "search-in-rotated-sorted-array": search,
  "find-first-and-last-position-of-element-in-sorted-array": searchRange,
  "search-insert-position": searchInsert,
  "valid-sudoku": isValidSudoku,
  "sudoku-solver": solveSudoku,
  "count-and-say": countAndSay,
  "combination-sum": combinationSum,
  "combination-sum-ii": combinationSum2,
  "first-missing-positive": firstMissingPositive,
  "trapping-rain-water": trap,
  "multiply-strings": multiply,
  "wildcard-matching": wildcardMatching,
  "jump-game-ii": jump,
  "permutations": permute,
  "permutations-ii": permuteUnique,
  "rotate-image": rotateImage,
  "powx-n": myPow,
  "n-queens": solveNQueens,
  "n-queens-ii": totalNQueens,
  "maximum-subarray": maxSubArray,
  "spiral-matrix": spiralOrder,
  "jump-game": canJump,
  "insert-interval": insert,
  "length-of-last-word": lengthOfLastWord,
  "spiral-matrix-ii": generateMatrix,
  "permutation-sequence": getPermutation,
  "rotate-list": rotateRight,
  "unique-paths": uniquePaths,
  "unique-paths-ii": uniquePathsWithObstacles,
  "minimum-path-sum": minPathSum,
  "valid-number": isNumber,
  "plus-one": plusOne,
  "add-binary": addBinary,
  "text-justification": fullJustify,
  "sqrtx": mySqrt,
  "climbing-stairs": climbingStairs,
  "simplify-path": simplifyPath,
  "edit-distance": editDistance,
  "set-matrix-zeroes": setZeroes,
  "search-a-2d-matrix": searchMatrix,
  "minimum-window-substring": minWindow,
  "combinations": combine,
  "subsets": subsets,
  "word-search": exist,
  "remove-duplicates-from-sorted-array-ii": removeDuplicates,
  "search-in-rotated-sorted-array-ii": searchInRotatedSortedArrayII,
  "remove-duplicates-from-sorted-list-ii": deleteDuplicatesII,
  "remove-duplicates-from-sorted-list": deleteDuplicates,
  "largest-rectangle-in-histogram": largestRectangleArea,
  "maximal-rectangle": maximalRectangle,
  "partition-list": partitionList,
  "scramble-string": scrambleString,
  "merge-sorted-array": mergeSortedArray,
  "gray-code": grayCode,
  "subsets-ii": subsetsWithDup,
  "decode-ways": decodeWays,
  "reverse-linked-list-ii": reverseBetween,
  "restore-ip-addresses": restoreIpAddresses,
  "unique-binary-search-trees-ii": generateTrees,
  "unique-binary-search-trees": numTrees,
  "interleaving-string": isInterleave,
  "validate-binary-search-tree": isValidBST,
  "recover-binary-search-tree": recoverTree,
  "same-tree": isSameTree,
  "build-star-rating": buildStarRating,
  "build-debounced-autocomplete": buildDebouncedAutocomplete,
  "number-of-provinces": numberOfProvinces,
} satisfies Record<string, AnyProblem>;

export type ProblemId = keyof typeof problems;

/** Full problem incl. server-only fields — narrow on `kind` at the call site. Never hand this to a client component. */
export const getProblem = (id: string): AnyProblem | undefined =>
  (problems as Record<string, AnyProblem>)[id];

/** The problem's stable 1-based catalog number (a stored field) — shown as `#NN` in the UI. */
export const problemNumber = (id: string): number => getProblem(id)?.number ?? 0;

export const listProblems = (): AnyProblem[] => Object.values(problems);

/**
 * The catalog row's view of a problem: identity, difficulty, `kind`, topics, and the companies it's
 * associated with (resolved from [companies.ts](../companies.ts)). Derived from `ProblemBase` so it
 * tracks the problem shape, and deliberately free of any algo server-only field — safe to serialize
 * into the client catalog.
 */
export type ProblemSummary = Pick<ProblemBase, "id" | "number" | "title" | "difficulty" | "tags"> & {
  kind: ProblemKind;
  companies: CompanyTag[];
};

export const listProblemSummaries = (): ProblemSummary[] =>
  listProblems().map(({ id, number, title, difficulty, tags, kind }) => ({
    id,
    number,
    title,
    difficulty,
    tags,
    kind,
    companies: companiesForProblem(id as ProblemId),
  }));

/** Drop `keys` from `value`, keeping the result type *derived* (`Omit<T, K>`) rather than cast. */
const omit = <T extends object, K extends keyof T>(value: T, keys: readonly K[]): Omit<T, K> => {
  const copy = { ...value };
  for (const key of keys) delete (copy as Partial<T>)[key];
  return copy;
};

/** Strip the server-only fields (hidden tests, answer-checker), leaving a shape safe to serialize into client props. */
export const toClientProblem = (problem: AlgoProblem): ClientProblem => omit(problem, ["hiddenTests", "checker"]);
