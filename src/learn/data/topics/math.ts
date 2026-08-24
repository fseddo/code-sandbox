import type { LearnTopic } from "@/learn/data/topic";

export const math = {
  slug: "math",
  title: "Math & geometry",
  category: "algorithms",
  summary: "Digit manipulation, GCD/modular arithmetic, and boundary-shrinking grid traversal — mostly O(1)/O(n) tricks, if you dodge overflow and float precision.",
  tags: ["math"],
  priority: "mid",
  estimatedMinutes: 55,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "This chapter is a grab bag by design — it's every problem that's solved by **a property of numbers or " +
          "shapes**, not by a data structure. Four tools cover almost everything in it: **digit manipulation** " +
          "(peel a number apart with `% 10` / `Math.floor(x / 10)`, rebuild it in reverse, and guard the rebuild " +
          "against overflow); **the Euclidean GCD algorithm** (reduce a fraction or a slope to its simplest integer " +
          "form so two equal ratios always hash to the same key); **boundary-shrinking traversal** (walk a grid's " +
          "outer ring, then shrink the ring and repeat — the mechanism behind spiral order, matrix rotation, and " +
          "\"set the border\" problems); and **closed-form reduction** (spot that a brute-force simulation has a " +
          "recurrence or a periodic pattern hiding in it, and replace an O(n) or O(n²) simulation with O(1) or " +
          "O(log n) arithmetic).\n\n" +
          "The cost model here isn't a single Big-O the way a data structure has one — it's **\"how much of the " +
          "input do you actually have to touch?\"** A digit-reversal is O(log₁₀ x) (one pass per digit); a spiral " +
          "traversal is O(rows × cols) (every cell, once); a closed-form Josephus or parity trick is O(n) or " +
          "better *precisely because* it replaces a simulation that would otherwise need to walk the whole " +
          "structure explicitly.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for this chapter's tools when a prompt is about **numbers as numbers** — digits, divisibility, " +
          "primes, powers, GCD/LCM — or about **shapes on a grid** — spiral/diagonal order, rotating a matrix in " +
          "place, tracing a boundary. The recognition cues are usually explicit: *\"reverse the digits\"*, " +
          "*\"in spiral order\"*, *\"rotate the matrix 90°\"*, *\"the greatest common divisor\"*, *\"the result may " +
          "be very large, return it modulo 10⁹+7\"*, or a phrasing that describes a physical process (people in a " +
          "circle, points on a plane) rather than an array operation.\n\n" +
          "It's also the chapter to reach for when a problem *looks* like it needs a full simulation but the " +
          "question only asks for a single number or position — that's the tell that a closed-form shortcut " +
          "exists underneath the brute force, the way the Josephus problem's O(n·k) circle simulation collapses " +
          "to an O(n) recurrence, or a triangle's row-by-row parity pattern collapses to an O(1) formula.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Digit manipulation** — extract digits with `x % 10` (last digit) and `Math.floor(x / 10)` (drop it), " +
          "then rebuild a new number by multiplying the accumulator by 10 and adding the next digit. Every " +
          "digit-reversal, palindrome-number check, and digit-sum problem is this loop with a different thing " +
          "done per digit.\n\n" +
          "**GCD reduction (Euclidean algorithm)** — `gcd(a, b) = gcd(b, a % b)`, bottoming out at `gcd(a, 0) = " +
          "a`. Divide a fraction's numerator and denominator (or a slope's rise and run) by their GCD to get a " +
          "canonical reduced form — the trick behind representing a slope as an integer pair `(rise, run)` " +
          "instead of a float, so two equal slopes always produce the same hash key.\n\n" +
          "**Boundary-shrinking grid traversal** — track four bounds (`top`, `bottom`, `left`, `right`), walk the " +
          "current outer ring (across the top row, down the right column, back across the bottom row, up the " +
          "left column), then shrink each bound inward by one and repeat until the bounds cross. This is spiral " +
          "order's engine, and the same four-bound bookkeeping drives in-place matrix rotation and \"traverse the " +
          "border\" variants.\n\n" +
          "**Sieve of Eratosthenes** — to test primality for *many* numbers up to `n` at once, mark every " +
          "multiple of each prime as composite in a single O(n log log n) pass, instead of trial-dividing each " +
          "number individually (O(n√n) total). Only worth the setup cost when the same range gets queried " +
          "repeatedly.\n\n" +
          "**Closed-form / recurrence reduction** — simulate a *small* case by hand, notice the answer for `n` " +
          "depends on the answer for `n - 1` by a fixed rule (a recurrence), or that the answer only depends on " +
          "`n`'s residue mod some small number (a periodic pattern), and replace the full simulation with that " +
          "rule. The Josephus problem's `J(n) = (J(n - 1) + k) mod n` is the recurrence case; a formula that only " +
          "checks `n % 2` and `n % 4` is the periodicity case.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Relation to bit manipulation and hash maps",
        body:
          "[[bit-manipulation]] is this chapter's base-2 specialization — `x & (x - 1)` clearing the lowest set " +
          "bit is the same *digit-peeling* idea as `x % 10` / `x = Math.floor(x / 10)`, just in binary instead of " +
          "decimal, and a bitmask is a fixed-size integer the same way a reduced `(rise, run)` pair is a " +
          "fixed-shape key.\n\n" +
          "The **focal-point slope-counting** technique (bucket points by the slope from a fixed point, keep the " +
          "biggest bucket) leans directly on [[hash-maps]] — the GCD reduction here exists specifically so that " +
          "equal slopes become equal hash-map keys, which is the same \"canonicalize before you hash\" move as " +
          "sorting an anagram's letters before using it as a key.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The boundary-shrinking traversal template — spiral order, matrix rotation, and border-walk problems all reuse this bookkeeping.",
        source:
          "function spiralOrder(matrix) {\n" +
          "  const result = [];\n" +
          "  if (matrix.length === 0) return result;\n" +
          "\n" +
          "  // Four bounds mark the current outer ring; they shrink inward each full lap.\n" +
          "  let top = 0, bottom = matrix.length - 1;\n" +
          "  let left = 0, right = matrix[0].length - 1;\n" +
          "\n" +
          "  while (top <= bottom && left <= right) {\n" +
          "    for (let col = left; col <= right; col++) result.push(matrix[top][col]);\n" +
          "    top++;\n" +
          "    for (let row = top; row <= bottom; row++) result.push(matrix[row][right]);\n" +
          "    right--;\n" +
          "    // Guard each remaining side — a single row or column left mid-shrink would\n" +
          "    // otherwise get walked twice.\n" +
          "    if (top <= bottom) {\n" +
          "      for (let col = right; col >= left; col--) result.push(matrix[bottom][col]);\n" +
          "      bottom--;\n" +
          "    }\n" +
          "    if (left <= right) {\n" +
          "      for (let row = bottom; row >= top; row--) result.push(matrix[row][left]);\n" +
          "      left++;\n" +
          "    }\n" +
          "  }\n" +
          "  return result;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Spiral order on a non-square grid** — the boundary-shrinking template's trickiest case, since a " +
          "rectangular (not square) matrix is where a missing \"has this side already been fully consumed?\" " +
          "guard shows up as a duplicated or dropped cell. Take a 4-row, 3-column grid:\n\n" +
          "`[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]`",
      },
      {
        kind: "gridWalkthrough",
        heading: "spiral order over a 4×3 grid",
        showIndices: true,
        grid: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        frames: [
          {
            active: [[0, 0], [0, 1], [0, 2]],
            action: "top row → right: 1, 2, 3; top-- (top = 1)",
            caption: "Walk the current top row left to right, then move the top bound down past it.",
          },
          {
            active: [[1, 2], [2, 2], [3, 2]],
            action: "right col → down: 6, 9, 12; right-- (right = 1)",
            caption: "Walk the right column top to bottom (row 0's corner was already taken), then pull the right bound in.",
          },
          {
            active: [[3, 1], [3, 0]],
            action: "bottom row → left: 11, 10; bottom-- (bottom = 2)",
            caption: "top (1) ≤ bottom (3), so the bottom row still has unvisited cells — walk it right to left, then pull the bottom bound up.",
          },
          {
            active: [[2, 0], [1, 0]],
            action: "left col → up: 7, 4; left++ (left = 1)",
            caption: "left (0) ≤ right (1), so the left column still has cells above the ones already taken — walk it bottom to top.",
          },
          {
            active: [[1, 1], [2, 1]],
            action: "top (1) ≤ bottom (2), left (1) ≤ right (1) → one column left: 5, 8",
            caption: "Only a single middle column remains. The bounds now describe a 2×1 sliver, not a full ring, but the same top-row-then-guarded-sides logic still walks it correctly.",
          },
          {
            action: "top (3) > bottom (2) → loop ends",
            caption: "After that last column, top has crossed bottom — the ring is empty, so the loop stops. Result: 1, 2, 3, 6, 9, 12, 11, 10, 7, 4, 5, 8.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Same template as above, applied to the 4×3 grid.",
        source:
          "spiralOrder([\n" +
          "  [1, 2, 3],\n" +
          "  [4, 5, 6],\n" +
          "  [7, 8, 9],\n" +
          "  [10, 11, 12],\n" +
          "]);\n" +
          "// → [1, 2, 3, 6, 9, 12, 11, 10, 7, 4, 5, 8]",
      },
      {
        kind: "prose",
        body:
          "Every cell is visited exactly once, so this is **O(rows × cols) time**. The `if (top <= bottom)` / " +
          "`if (left <= right)` guards before the bottom-row and left-column passes are what keep a non-square " +
          "grid's last remaining sliver — a single row or a single column — from being walked twice. **O(1) " +
          "extra space** beyond the output array.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Digit-reversal overflow.** Rebuilding a reversed number without a bounds check can silently exceed " +
          "the problem's integer range (classically 32-bit signed) partway through the loop — check `accumulator " +
          "> (INT_MAX - digit) / 10` *before* the multiply-and-add, not after, since the overflowed value itself " +
          "can't be trusted once it happens.",
          "**Comparing slopes as floats.** `dy / dx` loses precision for close-but-distinct fractions (`1/3` and " +
          "`33/100` can round to the same float, or `1/3` and `2/6` can fail to compare equal due to floating-" +
          "point representation) — always reduce to an integer pair via GCD before using a slope as a hash key.",
          "**Off-by-one boundary bugs in a shrinking traversal.** Forgetting to re-check `top <= bottom` (or " +
          "`left <= right`) before the third and fourth sides of a ring re-walks or skips cells on a " +
          "non-square grid — a square matrix won't expose this bug, so test on a rectangular one.",
          "**JavaScript's `%` keeps the sign of the dividend, not the divisor.** `-7 % 3` is `-1` in JS, not the " +
          "mathematical `2` — a modular-arithmetic formula ported from math notation needs `((x % m) + m) % m` " +
          "to normalize into `[0, m)` whenever `x` might be negative.",
          "**A recurrence that only works from the *base case* up.** `J(n) = (J(n - 1) + k) mod n` requires " +
          "building from `J(1) = 0` forward — computing it top-down without memoizing the chain (or getting the " +
          "base case wrong) is the usual bug, not the formula itself.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "A single row or single column matrix — the boundary-shrink loop's very first ring *is* the whole " +
          "grid, so the `top <= bottom` / `left <= right` guards must correctly skip the sides that don't exist.",
          "`n = 1` in a recurrence-based problem (one person in the Josephus circle, one row in a triangle) — " +
          "usually the recurrence's own base case, and worth testing explicitly rather than assuming the general " +
          "formula degrades gracefully.",
          "Negative numbers in a digit-reversal or digit-sum problem — the sign needs to be peeled off (and " +
          "re-applied at the end) before the digit loop, not folded into the modulo.",
          "A vertical line (every point shares the same x-coordinate) in a slope-counting problem — `run = 0` " +
          "makes the raw slope undefined, so it needs a dedicated sentinel key instead of falling into the " +
          "general GCD-reduction path.",
          "`k` larger than the remaining circle size in a Josephus-style elimination — the recurrence's `mod n` " +
          "handles the wraparound automatically, but a hand-rolled simulation that doesn't wrap the count index " +
          "will index out of bounds.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["spiral-matrix", "reverse-integer"],
        recommended: ["max-points-on-a-line", "josephus-problem", "triangle-numbers"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "Wikipedia — Euclidean algorithm", url: "https://en.wikipedia.org/wiki/Euclidean_algorithm", type: "article" },
          { label: "Wikipedia — Sieve of Eratosthenes", url: "https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes", type: "article" },
          { label: "Wikipedia — Josephus problem", url: "https://en.wikipedia.org/wiki/Josephus_problem", type: "article" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
