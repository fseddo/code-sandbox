import type { Section } from "./topic";

/**
 * Optional authored *teaching* content for a problem's Study Guide page — the intuition, the brute-force
 * baseline, and a walkthrough that motivate the optimization. It sits between the (derived) problem statement
 * and the **Optimization** section, which the page builds automatically from the problem's stored `solutions`
 * (the canonical best approach + implementation). Keyed by problem id; rendered through the shared
 * `SectionRenderer`, so any Section kind works. A problem with no entry here still gets a useful page
 * (statement + examples + constraints + Optimization + CTA) — this is the enrichment layer.
 */
export const PROBLEM_GUIDES: Record<string, Section[]> = {
  "container-with-most-water": [
    {
      kind: "prose",
      body:
        "A first pass just measures every pair of lines as the container's two walls and keeps the largest. " +
        "The water a pair holds is `min(height[i], height[j]) × (j − i)` — the **shorter** wall caps the level, " +
        "the gap between them sets the width.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — measure every pair of lines: O(n²).",
      source:
        "function maxArea(height) {\n" +
        "  let best = 0;\n" +
        "  // Try every pair of lines as the container's two walls.\n" +
        "  for (let i = 0; i < height.length; i++) {\n" +
        "    for (let j = i + 1; j < height.length; j++) {\n" +
        "      // Water is capped by the shorter wall, spread over the width between them.\n" +
        "      const area = Math.min(height[i], height[j]) * (j - i);\n" +
        "      best = Math.max(best, area); // keep the largest seen\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — far more work than necessary. Can we do better?\n\n" +
        "Start at the **widest** pair, one line at each end. Width is at its maximum here, so any inward move can " +
        "only *shrink* it. Notice the area is capped by the shorter wall: moving the **taller** wall in keeps that " +
        "same cap while losing width, so it can never improve. The only move that might help is advancing the " +
        "**shorter** wall, hoping to trade a little width for a taller cap.\n\n" +
        "That converging-from-both-ends sweep is the [Two pointers](/learn/guide/algos/topic/two-pointers) " +
        "pattern: one O(n) pass that safely discards a wall at every step instead of re-measuring every pair.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "height = [1, 8, 6, 2, 5, 7] — converging two pointers",
      lane: [1, 8, 6, 2, 5, 7],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 5 }],
          action: "min(1,7)·5 = 5 → left shorter, left++",
          caption: "Widest pair: best = 5. The left wall (1) caps it, so move the shorter wall in.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 5 }],
          action: "min(8,7)·4 = 28 → right shorter, right--",
          caption: "best = 28. Now the right wall (7) is the shorter one.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 4 }],
          action: "min(8,5)·3 = 15 → right shorter, right--",
          caption: "A failing move: 15 < 28. Narrower and no taller — keep moving the shorter (right) wall.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
          action: "min(8,2)·2 = 4 → right shorter, right--",
          caption: "Still short of 28; the right wall stays the binding constraint.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 2 }],
          action: "min(8,6)·1 = 6 → right--, pointers meet",
          caption: "Last pair before they cross. Nothing beat 28. Answer: 28.",
        },
      ],
    },
  ],

  "valid-palindrome": [
    {
      kind: "prose",
      body:
        "The most direct approach normalizes the string — lowercase it and drop every non-alphanumeric character — " +
        "then reverses that cleaned copy and checks whether the two strings are identical. A palindrome reads the " +
        "same forwards and backwards, so it equals its own reverse.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — clean the string, then compare it to its reverse: O(n) time, O(n) space.",
      source:
        "function isPalindrome(s) {\n" +
        "  // Normalize: lowercase, then keep only letters and digits.\n" +
        '  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n' +
        "  // Build the reversed copy and compare the whole strings.\n" +
        '  const reversed = [...cleaned].reverse().join("");\n' +
        "  return cleaned === reversed; // equal iff it's a palindrome\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) time, but the reversed copy is a second O(n) string we never really need. Can we do better " +
        "on space?\n\n" +
        "Notice that comparing a string to its reverse just pairs up the **first character with the last, the " +
        "second with the second-to-last**, and so on. We can check those pairs directly on the cleaned string with " +
        "two pointers — one at each end, walking inward — which is exactly the " +
        "[Two pointers](/learn/guide/algos/topic/two-pointers) converging-ends pattern. The moment a pair " +
        "disagrees we can stop early and return `false`.\n\n" +
        "Cleaning still costs O(n) space here (we keep the cleaned string), but the comparison itself drops to " +
        "O(1) extra and short-circuits on the first mismatch instead of always building a full reversed copy.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 'cleaned: "abca" — a mismatch (returns false)',
      lane: ["a", "b", "c", "a"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "j", at: 3 }],
          action: "'a' == 'a' → i++, j--",
          caption: "The outer pair matches, so move both pointers inward.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "j", at: 2 }],
          action: "'b' != 'c' → return false",
          caption: "The next pair disagrees — stop early, this is not a palindrome.",
        },
      ],
    },
    {
      kind: "walkthrough",
      heading: 'cleaned: "abba" — a palindrome (returns true)',
      lane: ["a", "b", "b", "a"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "j", at: 3 }],
          action: "'a' == 'a' → i++, j--",
          caption: "The outer pair matches, so move both pointers inward.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "j", at: 2 }],
          action: "'b' == 'b' → i++, j--",
          caption: "The inner pair matches too; the pointers now cross.",
        },
        {
          pointers: [{ name: "i", at: 2 }, { name: "j", at: 1 }],
          action: "i ≥ j → return true",
          caption: "Every pair matched before the pointers met → it's a palindrome.",
        },
      ],
    },
  ],

  "valid-sudoku": [
    {
      kind: "prose",
      body:
        "The rules are three independent checks, so the plainest approach runs three sweeps. For each of the nine " +
        "rows collect its filled digits and look for a repeat; do the same for each column; then for each of the " +
        "nine `3 x 3` boxes. If any group repeats a digit the board is invalid.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — nine rows + nine columns + nine boxes, each re-scanned: O(1) for 9x9, but three full passes.",
      source:
        "function isValidSudoku(board) {\n" +
        "  // True if a group of cells repeats any digit (ignoring '.').\n" +
        "  const hasDup = (cells) => {\n" +
        "    const seen = new Set();\n" +
        "    for (const d of cells) {\n" +
        "      if (d === '.') continue;       // empty cells never conflict\n" +
        "      if (seen.has(d)) return true;  // digit already in this group\n" +
        "      seen.add(d);\n" +
        "    }\n" +
        "    return false;\n" +
        "  };\n" +
        "  // Pass 1: every row.\n" +
        "  for (let r = 0; r < 9; r++) {\n" +
        "    if (hasDup(board[r])) return false;\n" +
        "  }\n" +
        "  // Pass 2: every column (gather the 9 cells down each column).\n" +
        "  for (let c = 0; c < 9; c++) {\n" +
        "    const col = [];\n" +
        "    for (let r = 0; r < 9; r++) col.push(board[r][c]);\n" +
        "    if (hasDup(col)) return false;\n" +
        "  }\n" +
        "  // Pass 3: every 3x3 box (top-left corners at multiples of 3).\n" +
        "  for (let br = 0; br < 9; br += 3) {\n" +
        "    for (let bc = 0; bc < 9; bc += 3) {\n" +
        "      const box = [];\n" +
        "      for (let r = br; r < br + 3; r++)\n" +
        "        for (let c = bc; c < bc + 3; c++) box.push(board[r][c]);\n" +
        "      if (hasDup(box)) return false;\n" +
        "    }\n" +
        "  }\n" +
        "  return true;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That works, but it walks the board three separate times and re-derives a fresh `Set` for every group. " +
        "Can we do it in one pass and keep it cleaner?\n\n" +
        "Notice the only thing each group cares about is: *has this digit already appeared in my row, my column, " +
        "or my box?* A repeat is a [duplicate-detection](/learn/guide/algos/topic/hash-maps) problem, and a hash " +
        "**set** answers \"have I seen this before?\" in O(1). So we don't need to gather groups at all — we can " +
        "scan the 81 cells once and, at each filled cell, test three memberships at once.\n\n" +
        "Keep three kinds of seen-marker, tagged so they can't collide: `row-r-d`, `col-c-d`, and `box-b-d`, where " +
        "the box index `b = floor(r/3) * 3 + floor(c/3)` (0–8). For a digit `d` at `(r, c)`, if any of its three " +
        "keys is already in the set, that digit repeats in that row, column, or box — return `false` immediately. " +
        "Otherwise add all three keys and move on. The same digit `5` is free to appear all over the board; only a " +
        "*matching* key (same line or same box) is a conflict.\n\n" +
        "The set check is the same one-line `seen.has(...)` for all three rules — no special-casing per group. " +
        "Here's the left-to-right, top-to-bottom scan over a board whose column 0 hides a repeated 5:",
    },
    {
      kind: "gridWalkthrough",
      heading: "scan order: row by row, testing three keys at each filled cell",
      showIndices: true,
      grid: [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["5", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ],
      frames: [
        {
          cursor: [0, 0],
          action: "5 @ (0,0) · keys new → add",
          caption: "First filled cell: stamp `row-0-5`, `col-0-5`, and `box-0-5`. All three are new.",
        },
        {
          cursor: [1, 0],
          action: "6 @ (1,0) · keys new → add",
          caption: "Routine: every filled cell stamps its three keys. Column 0 now holds a 5 and a 6.",
        },
        {
          cursor: [1, 5],
          action: "5 @ (1,5) · keys new → add",
          caption: "A second 5 — but row 1, column 5, box 1 are all different from the first 5's groups, so no key collides. The same digit is free to repeat elsewhere.",
        },
        {
          cursor: [3, 0],
          marked: [[0, 0]],
          active: [[1, 0], [2, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]],
          action: "5 @ (3,0) · col-0-5 already seen → false",
          caption: "Down column 0, this 5 matches the 5 at (0,0): `col-0-5` is already in the set. The board is invalid — stop immediately.",
        },
      ],
    },
  ],

  "3sum": [
    {
      kind: "prose",
      body:
        "A first pass just checks every possible triple of numbers and keeps the ones that sum to zero, using a " +
        "set to throw out duplicate triplets.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every triple, deduped by sorted key: O(n³).",
      source:
        "function threeSum(nums) {\n" +
        "  // A set of triplet keys, so the same triple is never added twice.\n" +
        "  const seen = new Set();\n" +
        "  const res = [];\n" +
        "  // Check every distinct triple of indexes.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        if (nums[i] + nums[j] + nums[k] === 0) {\n" +
        "          // Sort the values so [-1,0,1] and [1,-1,0] map to the same key.\n" +
        "          const key = [nums[i], nums[j], nums[k]].sort((a, b) => a - b).join(',');\n" +
        "          if (!seen.has(key)) {\n" +
        "            seen.add(key);\n" +
        "            res.push(key.split(',').map(Number)); // key string -> numbers\n" +
        "          }\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return res;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — far more work than necessary. Can we do better?\n\n" +
        "Notice that if we **fix one number** `nums[i]`, the rest of the job is just finding a *pair* that sums " +
        "to `-nums[i]` — which is exactly the [Two pointers](/learn/guide/algos/topic/two-pointers) pair-sum problem.\n\n" +
        "Pair Sum's two-pointer trick only works on a **sorted** array, so sort the input first. Then, for each " +
        "fixed `i`, converge two pointers over the suffix: move `left` up when the pair sum is too small, `right` " +
        "down when it's too large, skipping equal neighbours so duplicates don't slip in.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "sorted: [-4, -1, -1, 0, 1, 2]",
      lane: [-4, -1, -1, 0, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 1 }, { name: "R", at: 5 }],
          action: "-1 + 2 = 1 < 4 → L++",
          caption: "Fix i = -4: we need a pair summing to 4.",
        },
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 4 }, { name: "R", at: 5 }],
          action: "1 + 2 = 3 < 4 → no pair, advance i",
          caption: "Even the two largest values fall short — nothing pairs with -4 to reach 0.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 5 }],
          action: "-1 + 2 = 1 = -nums[i] ✓",
          caption: "Fix i = -1: record the triplet [-1, -1, 2], then move both pointers in.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 3 }, { name: "R", at: 4 }],
          action: "0 + 1 = 1 ✓",
          caption: "Another hit: [-1, 0, 1]. Record, move both in. (L and R then cross — this pivot is done.)",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [2],
          action: "nums[2] == nums[1] → skip",
          caption: "Index 2 is another -1; skip it as a pivot, or we'd emit [-1, -1, 2] and [-1, 0, 1] a second time.",
        },
      ],
    },
  ],

  "geometric-sequence-triplets": [
    {
      kind: "prose",
      body:
        "A first pass checks every index triple `(i, j, k)` with `i < j < k` and counts the ones that step up by the " +
        "ratio `r` — `nums[j] === nums[i] * r` and `nums[k] === nums[j] * r`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every ordered triple, count the geometric ones: O(n³).",
      source:
        "function geometricTriplets(nums, r) {\n" +
        "  let count = 0;\n" +
        "  // Check every distinct triple of indexes in order.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        // A geometric step needs the middle to be i × r and the last to be the middle × r.\n" +
        "        if (nums[j] === nums[i] * r && nums[k] === nums[j] * r) {\n" +
        "          count++; // each qualifying index combination is its own triplet\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return count;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — far more work than necessary. Can we do better?\n\n" +
        "Notice that a triplet is pinned down by its **middle** element. If we fix `nums[j]` as the middle, a valid " +
        "triplet just needs a left partner equal to `nums[j] / r` somewhere *before* `j`, and a right partner equal " +
        "to `nums[j] * r` somewhere *after* `j`. The number of triplets centred on `j` is then simply " +
        "`(# of nums[j]/r on the left) × (# of nums[j]*r on the right)` — every left partner can pair with every " +
        "right partner.\n\n" +
        "Counting *how many* of a given value sit on each side is what a frequency map does in O(1), so this is a " +
        "[Hash map](/learn/guide/algos/topic/hash-maps) problem. Keep two maps: `left` (values strictly before `j`) " +
        "and `right` (values strictly after `j`). Seed `right` with the whole array, then sweep `j` left to right — " +
        "before counting, move `nums[j]` out of `right`; after counting, add it into `left`. Because the left partner " +
        "must be the *exact* integer `nums[j] / r`, guard the division with `nums[j] % r === 0`. (The stored " +
        "solution iterates the middle directly and names it `mid` rather than indexing `nums[j]`.)\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 2, 2, 4], r = 2",
      lane: [1, 2, 2, 4],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "j", at: 0 }],
          action: "1 % 2 ≠ 0 → skip",
          caption:
            "right = {2:2, 4:1}, left = {}. Middle 1 would need a left partner of 1/2 — not an integer, so the guard rejects it. Contributes 0.",
        },
        {
          pointers: [{ name: "j", at: 1 }],
          action: "left[1] × right[4] = 1 × 1 = 1",
          caption:
            "left = {1:1}, right = {2:1, 4:1}. Middle 2 needs 2/2 = 1 on the left (one) and 2×2 = 4 on the right (one). count = 1.",
        },
        {
          pointers: [{ name: "j", at: 2 }],
          action: "left[1] × right[4] = 1 × 1 = 1",
          caption:
            "left = {1:1, 2:1}, right = {4:1}. The second 2 is its own middle — same partners (the 1 and the 4), counted again by index. count = 2.",
        },
        {
          pointers: [{ name: "j", at: 3 }],
          action: "left[2] × right[8] = 2 × 0 = 0",
          caption:
            "left = {1:1, 2:2}, right = {}. Middle 4 has two left partners (the 2s) but needs a 4×2 = 8 after it — none exist. Contributes 0.",
        },
        {
          action: "total = 2",
          caption: "Sweep done: triplets (0,1,3) and (0,2,3), one per choice of middle 2. Answer: 2.",
        },
      ],
    },
  ],

  "3sum-closest": [
    {
      kind: "prose",
      body:
        "A first pass just adds up every possible triple of numbers and remembers whichever sum lands nearest the " +
        "target, comparing distances with `Math.abs`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every triple, track the closest: O(n³).",
      source:
        "function threeSumClosest(nums, target) {\n" +
        "  // Seed the answer with any triple's sum so the first comparison has something to beat.\n" +
        "  let best = nums[0] + nums[1] + nums[2];\n" +
        "  // Check every distinct triple of indexes.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        const sum = nums[i] + nums[j] + nums[k];\n" +
        "        // Keep whichever sum sits closer to the target on the number line.\n" +
        "        if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — far more work than necessary. Can we do better?\n\n" +
        "It's the same shape as 3Sum: if we **fix one number** `nums[i]`, the rest of the job is finding the *pair* " +
        "in the suffix whose sum brings `nums[i] + pair` closest to `target` — which is exactly the " +
        "[Two pointers](/learn/guide/algos/topic/two-pointers) pair-sum problem.\n\n" +
        "That two-pointer trick only works on a **sorted** array, so sort the input first. For each fixed `i`, " +
        "converge two pointers over the suffix: when the triple sum is below `target` move `left` up to grow it, " +
        "when it's above move `right` down to shrink it. The difference from 3Sum is the goal — instead of waiting " +
        "for an exact zero, we track the smallest `|sum − target|` seen, and return early only if we hit `target` " +
        "exactly.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "sorted: [-4, -1, 1, 2] · target = 1",
      lane: [-4, -1, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 1 }, { name: "R", at: 3 }],
          action: "sum −3 · |−3−1| = 4 → best = −3, −3 < 1 so L++",
          caption: "Fix i = −4. First candidate −3 seeds the best distance.",
        },
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 2 }, { name: "R", at: 3 }],
          action: "sum −1 · |−1−1| = 2 → closer, best = −1, −1 < 1 so L++",
          caption: "Still short of target, so left keeps climbing — but −1 is nearer than −3.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 3 }],
          action: "sum 2 · |2−1| = 1 → closer, best = 2, 2 > 1 so R−−",
          caption: "Fix i = −1: [−1, 1, 2] sums to 2, distance 1 — overshoots, so right would retreat.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 2 }],
          marked: [3],
          action: "L = R → suffix exhausted, no exact hit",
          caption: "Pointers meet; no triple ever equals target. Final answer: the closest sum, 2.",
        },
      ],
    },
  ],

  "trapping-rain-water": [
    {
      kind: "prose",
      body:
        "Water sitting above a bar is capped by `min(tallestLeft, tallestRight) − height`. A first pass just " +
        "computes that directly: for every bar, scan all the way left for the tallest wall and all the way right " +
        "for the tallest wall, then add whatever sits on top.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each bar, rescan both sides for the tallest walls: O(n²).",
      source:
        "function trap(height) {\n" +
        "  let water = 0;\n" +
        "  // For each bar, find the walls that bound the water above it.\n" +
        "  for (let i = 0; i < height.length; i++) {\n" +
        "    let left = 0, right = 0;\n" +
        "    // Tallest wall to the left of (and including) bar i.\n" +
        "    for (let j = 0; j <= i; j++) left = Math.max(left, height[j]);\n" +
        "    // Tallest wall to the right of (and including) bar i.\n" +
        "    for (let j = i; j < height.length; j++) right = Math.max(right, height[j]);\n" +
        "    // The shorter wall sets the water level; subtract the bar's own height.\n" +
        "    water += Math.min(left, right) - height[i];\n" +
        "  }\n" +
        "  return water;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — every bar triggers two full rescans for maxima we keep recomputing. Can we do better?\n\n" +
        "The key observation: a bar's water level is set by the **shorter** of its two bounding walls. So if we " +
        "watch from both ends with two pointers and compare the two current bars, the side with the *shorter* bar " +
        "is the one whose answer we can already commit. Whatever taller wall waits beyond the far pointer can only " +
        "*raise* the other side's max, never the shorter side's binding wall — so the shorter side's running max " +
        "is already its true left-or-right wall.\n\n" +
        "That converge-from-both-ends move is the [Two pointers](/learn/guide/algos/topic/two-pointers) pattern: " +
        "advance whichever side is shorter, fold its bar into that side's running max, and bank `runningMax − " +
        "height` as trapped water. One linear pass, no rescans, O(1) space.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "height = [3, 0, 1, 0, 5, 2] — move the shorter side",
      lane: [3, 0, 1, 0, 5, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "L", at: 0 }, { name: "R", at: 5 }],
          action: "h[L] 3 ≥ h[R] 2 → Rmax 2, +0, R−−",
          caption:
            "Right bar is the shorter side, so we settle it first. Its running max is just itself (2), so no water — move right inward.",
        },
        {
          pointers: [{ name: "L", at: 0 }, { name: "R", at: 4 }],
          action: "h[L] 3 < h[R] 5 → Lmax 3, +0, L++",
          caption:
            "Now the left bar (3) is the shorter side, so the move flips to the left. Lmax becomes 3; the bar fills its own wall, so +0.",
        },
        {
          pointers: [{ name: "L", at: 1 }, { name: "R", at: 4 }],
          action: "h[L] 0 < h[R] 5 → Lmax 3, +3",
          caption: "A dip below Lmax 3. Add 3 − 0 = 3. Total 3.",
        },
        {
          pointers: [{ name: "L", at: 2 }, { name: "R", at: 4 }],
          action: "h[L] 1 < h[R] 5 → Lmax 3, +2",
          caption: "Add 3 − 1 = 2. Total 5. Lmax is the safe wall — the 5 still parked at R guarantees the right wall is at least as tall.",
        },
        {
          pointers: [{ name: "L", at: 3 }, { name: "R", at: 4 }],
          action: "h[L] 0 < h[R] 5 → Lmax 3, +3",
          caption: "Another dip. Add 3 − 0 = 3. Total 8 — the pointers now meet, so that's the answer.",
        },
      ],
    },
  ],

  "remove-duplicates-from-sorted-array": [
    {
      kind: "prose",
      body:
        "The most direct approach leans on a `Set`: feed every value through it to drop repeats, then copy the " +
        "distinct values back into the front of `nums` and return how many there were. A `Set` preserves " +
        "first-seen order, so the sorted ordering survives.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — collect uniques in a Set, copy back: O(n) time, O(n) extra space.",
      source:
        "function removeDuplicates(nums) {\n" +
        "  // A Set drops duplicates while keeping first-seen (sorted) order.\n" +
        "  const unique = [...new Set(nums)];\n" +
        "  // Write the distinct values back into the front of nums.\n" +
        "  for (let i = 0; i < unique.length; i++) nums[i] = unique[i];\n" +
        "  return unique.length; // the new logical length, k\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) time, but the `Set` is a whole second copy of the data — O(n) extra space on a problem that " +
        "asks for O(1). Can we do better?\n\n" +
        "The key observation: the array is already **sorted**, so equal values are always *adjacent*. We never " +
        "need a `Set` to spot a duplicate — a value is new exactly when it differs from the one right before it. " +
        "That means we can compact in place with two same-direction pointers walking the array: a slow *write* " +
        "pointer marking the end of the unique prefix, and a fast *read* pointer scanning ahead for the next new " +
        "value. This same-direction slow/fast pairing is the [Two pointers](/learn/guide/algos/topic/two-pointers) " +
        "pattern.\n\n" +
        "Seed `slow` at index 0 (the first element is always kept). Each time `fast` lands on a value different " +
        "from `nums[slow]`, advance `slow` and write that value there. The unique count is `slow + 1`.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [0, 0, 1, 1, 2] · highlighted = unique prefix",
      lane: [0, 0, 1, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 1 }],
          range: [0, 0],
          action: "nums[fast] 0 == nums[slow] 0 → fast++",
          caption: "A duplicate of the kept value — skip it, slow stays put.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 2 }],
          range: [0, 1],
          action: "nums[fast] 1 ≠ last kept 0 → ++slow, write nums[slow] = 1",
          caption: "A new value: advance slow and write it, extending the unique prefix to [0, 1].",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 3 }],
          range: [0, 1],
          action: "nums[fast] 1 == nums[slow] 1 → fast++",
          caption: "Another duplicate, this time of the 1 we just kept — skip again.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: 4 }],
          range: [0, 2],
          action: "nums[fast] 2 ≠ last kept 1 → ++slow, write nums[slow] = 2",
          caption: "Last new value written. fast falls off the end next.",
        },
        {
          pointers: [{ name: "slow", at: 2 }],
          range: [0, 2],
          action: "fast past end → return slow + 1 = 3",
          caption: "Prefix [0, 1, 2] holds the distinct values; k = 3.",
        },
      ],
    },
  ],

  "longest-substring-without-repeating-characters": [
    {
      kind: "prose",
      body:
        "The most direct approach takes every substring and checks whether it has a repeated character, keeping " +
        "the length of the longest one that doesn't. Comparing a substring against itself for uniqueness is what " +
        "makes it slow.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring for uniqueness: O(n³).",
      source:
        "function lengthOfLongestSubstring(s) {\n" +
        "  // A substring has no repeat when its set of chars is as big as the substring.\n" +
        "  const allUnique = (str) => new Set(str).size === str.length;\n" +
        "  let best = 0;\n" +
        "  // Try every substring s[i..j] and keep the longest distinct one.\n" +
        "  for (let i = 0; i < s.length; i++) {\n" +
        "    for (let j = i; j < s.length; j++) {\n" +
        "      if (allUnique(s.slice(i, j + 1))) best = Math.max(best, j - i + 1);\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — there are O(n²) substrings and each uniqueness check is O(n). Can we do better?\n\n" +
        "The key observation: as we extend a substring to the right, it stays valid until the *first* repeated " +
        "character. Once a duplicate appears, every substring that keeps the earlier copy is also invalid — so " +
        "instead of restarting, we can just move the left edge *past* that earlier copy. That's a " +
        "[sliding window](/learn/guide/algos/topic/sliding-window): a window `[start, i]` that always holds " +
        "distinct characters.\n\n" +
        "To know *where* the earlier copy was, store each character's most recent index in a map. When `s[i]` was " +
        "last seen at some index `>= start`, that copy is inside the window, so jump `start` to one past it. The " +
        "answer is the widest `i - start + 1` seen.\n\n" +
        "*(The walkthrough below frames the window as `left`/`right`; in the stored solution `right` is the loop " +
        "index `i` and `left` is `start` — same window, different names.)*\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 's = "abcabcbb" — window [start, i], start jumps past the last duplicate',
      lane: ["a", "b", "c", "a", "b", "c", "b", "b"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 2 }],
          range: [0, 2],
          action: 'best = 3',
          caption: 'Window "abc" — all distinct. lastSeen = {a:0, b:1, c:2}.',
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
          range: [1, 3],
          marked: [0],
          action: '"a" last seen at 0 ≥ start → start = 1',
          caption: 'right = 3 is "a", whose last index 0 sits in the window — jump start past it to 1.',
        },
        {
          pointers: [{ name: "left", at: 2 }, { name: "right", at: 4 }],
          range: [2, 4],
          marked: [0, 1],
          action: '"b" last seen at 1 ≥ start → start = 2',
          caption: 'right = 4 is "b" (last at 1, in-window) → start jumps to 2. Window "cab", still width 3.',
        },
        {
          pointers: [{ name: "left", at: 6 }, { name: "right", at: 6 }],
          range: [6, 6],
          marked: [0, 1, 2, 3, 4, 5],
          action: '"b" last seen at 4 ≥ start → start = 6',
          caption: 'right = 6 is "b" again (last at 4) → start leaps to 6. The window collapses to one char.',
        },
        {
          pointers: [{ name: "left", at: 7 }, { name: "right", at: 7 }],
          range: [7, 7],
          marked: [0, 1, 2, 3, 4, 5, 6],
          action: '"b" last seen at 6 ≥ start → start = 7',
          caption: "The trailing run of b's keeps width at 1. Nothing beat the early \"abc\". Final best = 3.",
        },
      ],
    },
  ],

  "find-all-anagrams-in-a-string": [
    {
      kind: "prose",
      body:
        "An anagram of `p` is just a window of `s` with the same letter counts as `p`. The most direct approach " +
        "slides a length-`p.length` window across `s` and, at each position, recomputes the window's counts from " +
        "scratch and compares them to `p`'s.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — recount each window from scratch: O(n · k) with a fresh count per window.",
      source:
        "function findAnagrams(s, p) {\n" +
        "  const result = [];\n" +
        "  // Letter counts that p requires.\n" +
        "  const need = {};\n" +
        "  for (const c of p) need[c] = (need[c] ?? 0) + 1;\n" +
        "  // Try every window of width p.length.\n" +
        "  for (let i = 0; i + p.length <= s.length; i++) {\n" +
        "    // Recount this whole window, then compare to need.\n" +
        "    const have = {};\n" +
        "    for (let j = i; j < i + p.length; j++) have[s[j]] = (have[s[j]] ?? 0) + 1;\n" +
        "    const isAnagram = Object.keys(need).length === Object.keys(have).length &&\n" +
        "      Object.keys(need).every((c) => need[c] === have[c]);\n" +
        "    if (isAnagram) result.push(i);\n" +
        "  }\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Rebuilding the window's counts every step throws away work — consecutive windows differ by only **one " +
        "letter in and one letter out**. Can we do better?\n\n" +
        "Keep a single `have` count and update it incrementally: as the window advances, increment the entering " +
        "letter and decrement the leaving one. That's a fixed-size " +
        "[sliding window](/learn/guide/algos/topic/sliding-window) of width `p.length`.\n\n" +
        "Comparing all 26 counts each step would still cost O(26) per window. So track one number, `matches` — how " +
        "many of the 26 letter-counts currently *agree* with `p`. Each letter that enters or leaves changes only " +
        "its own slot, so `matches` is nudged up or down in O(1). The window is an anagram exactly when " +
        "`matches === 26`.\n\n" +
        "*(In the walkthrough `right` is the entering index and `left = right - p.length` is the leaving index — " +
        "the same two edges the stored solution uses.)*\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 's = "cbaebabacd", p = "abc" — width-3 window, need {a:1, b:1, c:1}',
      lane: ["c", "b", "a", "e", "b", "a", "b", "a", "c", "d"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 2 }],
          range: [0, 2],
          action: "have {c:1,b:1,a:1} → matches = 26 ✓ push 0",
          caption: 'First full window "cba" — every count agrees with "abc". Record start index 0.',
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
          range: [1, 3],
          marked: [0],
          action: '"e" enters, "c" leaves → matches < 26',
          caption: 'Window "bae" — the stray "e" (and missing "c") break the match. Not an anagram.',
        },
        {
          pointers: [{ name: "left", at: 4 }, { name: "right", at: 6 }],
          range: [4, 6],
          marked: [0, 1, 2, 3],
          action: 'have {b:2,a:1} → matches < 26',
          caption: 'Window "bab" has two b\'s and no c — counts disagree, skip.',
        },
        {
          pointers: [{ name: "left", at: 6 }, { name: "right", at: 8 }],
          range: [6, 8],
          marked: [0, 1, 2, 3, 4, 5],
          action: "have {b:1,a:1,c:1} → matches = 26 ✓ push 6",
          caption: 'Window "bac" matches again — record start index 6.',
        },
        {
          pointers: [{ name: "left", at: 7 }, { name: "right", at: 9 }],
          range: [7, 9],
          marked: [0, 1, 2, 3, 4, 5, 6],
          action: '"d" enters → matches < 26',
          caption: 'Last window "acd" — "d" isn\'t in "abc". Result: [0, 6].',
        },
      ],
    },
  ],

  "longest-repeating-character-replacement": [
    {
      kind: "prose",
      body:
        "We may rewrite up to `k` characters; we want the longest run we can turn into a single repeated letter. " +
        "The most direct approach tries every substring and asks whether it can be made uniform: keep the most " +
        "common letter in it and replace the rest, which is feasible when the count of *other* letters is `<= k`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring's replaceability: O(n³).",
      source:
        "function characterReplacement(s, k) {\n" +
        "  let best = 0;\n" +
        "  // Try every substring s[i..j].\n" +
        "  for (let i = 0; i < s.length; i++) {\n" +
        "    for (let j = i; j < s.length; j++) {\n" +
        "      // Count letters in this substring to find the most frequent one.\n" +
        "      const count = {};\n" +
        "      let maxFreq = 0;\n" +
        "      for (let m = i; m <= j; m++) {\n" +
        "        count[s[m]] = (count[s[m]] ?? 0) + 1;\n" +
        "        maxFreq = Math.max(maxFreq, count[s[m]]);\n" +
        "      }\n" +
        "      const len = j - i + 1;\n" +
        "      // Replaceable when the non-dominant letters fit within the k budget.\n" +
        "      if (len - maxFreq <= k) best = Math.max(best, len);\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-counting every substring is O(n³). Can we do better?\n\n" +
        "The replaceability test for a window is `windowLength - maxFreq <= k`, where `maxFreq` is the count of " +
        "its most frequent letter. That's a property of a contiguous run — so use a " +
        "[sliding window](/learn/guide/algos/topic/sliding-window) and maintain the letter counts incrementally " +
        "as the edges move, instead of rebuilding them.\n\n" +
        "Grow `right` each step. When `windowLength - maxFreq > k` the window is too costly to make uniform, so " +
        "advance `left` by **one** — and that's the elegant part: we never need to shrink more than one step, " +
        "because we only care about the *largest* window ever seen. The width is monotonically non-decreasing, so " +
        "the final `right - left + 1` is the answer. (We let `maxFreq` go stale when `left` moves; a bigger answer " +
        "would require an even bigger `maxFreq`, so this never overcounts.)\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 's = "AABABBA", k = 1 — grow right; left nudges forward when cost > k',
      lane: ["A", "A", "B", "A", "B", "B", "A"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 2 }],
          range: [0, 2],
          action: "len 3, maxFreq 2 (A) → 3−2 = 1 ≤ 1 ✓ best = 3",
          caption: '"AAB": replace the single B → all A. Cost 1 fits the budget.',
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 3 }],
          range: [0, 3],
          action: "len 4, maxFreq 3 (A) → 4−3 = 1 ≤ 1 ✓ best = 4",
          caption: '"AABA": three A\'s, one B to replace. Still within k = 1. best grows to 4.',
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 4 }],
          range: [0, 4],
          action: "len 5, maxFreq 3 → 5−3 = 2 > 1 ✗ left++",
          caption: '"AABAB": now two B\'s must change — over budget. Slide left one step.',
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 4 }],
          range: [1, 4],
          marked: [0],
          action: "len 4 ≤ best, keep scanning",
          caption: "Window width holds at 4 (left moved once, right once). best stays 4.",
        },
        {
          pointers: [{ name: "left", at: 3 }, { name: "right", at: 6 }],
          range: [3, 6],
          marked: [0, 1, 2],
          action: "len 4, maxFreq stays 3 → 4−3 = 1 ≤ 1 ✓",
          caption: 'left kept pace with right, holding width 4 (maxFreq is the stale 3, which never overcounts). Final best = 4.',
        },
      ],
    },
  ],

  "minimum-window-substring": [
    {
      kind: "prose",
      body:
        "The brute force tests every substring for coverage of `t` — O(n²·m). The optimization is a variable " +
        "window with a *need* count: expand `right` to cover required characters, then once the window covers " +
        "all of `t`, **contract** `left` as far as it stays valid, recording the smallest valid window seen.",
    },
    {
      kind: "prose",
      body:
        "The trick is one `missing` counter: decrement it only when a still-needed character gets covered, and " +
        "the window is valid exactly when `missing === 0` — no re-scanning the counts each step. O(n).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring for coverage: O(n²·m).",
      source:
        "function minWindow(s, t) {\n" +
        "  // Does this window contain every character t needs, counting repeats?\n" +
        "  const covers = (win) => {\n" +
        "    const need = new Map();\n" +
        "    for (const c of t) need.set(c, (need.get(c) ?? 0) + 1); // what t requires\n" +
        "    for (const c of win) if (need.has(c)) need.set(c, need.get(c) - 1); // what win supplies\n" +
        "    return [...need.values()].every((v) => v <= 0); // every requirement met\n" +
        "  };\n" +
        '  let best = "";\n' +
        "  // Try every substring; keep the shortest one that still covers t.\n" +
        "  for (let i = 0; i < s.length; i++) {\n" +
        "    for (let j = i + 1; j <= s.length; j++) {\n" +
        "      const win = s.slice(i, j);\n" +
        '      if (covers(win) && (best === "" || win.length < best.length)) best = win;\n' +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
  ],

  "two-sum": [
    {
      kind: "prose",
      body:
        "The most direct approach checks every pair of numbers: for each index `i`, walk every later index " +
        "`j` and test whether `nums[i] + nums[j]` equals `target`. The first matching pair is the answer, " +
        "and because `j` always starts after `i` the two indices come out in ascending order for free.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every pair: O(n²).",
      source:
        "function twoSum(nums, target) {\n" +
        "  // Try every distinct pair (i, j) with i < j.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      // First pair that hits target wins; i < j keeps indices ascending.\n" +
        "      if (nums[i] + nums[j] === target) return [i, j];\n" +
        "    }\n" +
        "  }\n" +
        "  return []; // problem guarantees a solution, so this is unreachable\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — for each element we rescan the whole rest of the array. Can we do better?\n\n" +
        "The inner loop is really asking one narrow question: *have I already seen the number that completes " +
        "this pair?* For a value `x`, that partner is exactly `target − x` — there is only **one** number that " +
        "works. So instead of scanning for it, we can remember every value we've passed in a hash map keyed by " +
        "value, and look the partner up in O(1).\n\n" +
        "Storing `value → index` lets that lookup also hand back *where* the partner was, which is what we need " +
        "to return. This is the core [hash maps](/learn/guide/algos/topic/hash-maps) trick: trade O(n) space for " +
        "O(1) membership-and-recall, collapsing the nested scan into a single pass.\n\n" +
        "One pass suffices if we check **before** we insert: at index `i` we ask whether `target − nums[i]` is " +
        "already stored, and only then add `nums[i]` ourselves. Checking first means we never pair an element " +
        "with itself, and the stored partner is always at an earlier index — so `[seen, i]` is already ascending.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [3, 8, 2, 7, 5], target = 9 — one-pass seen-map",
      lane: [3, 8, 2, 7, 5],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          action: "need 9 − 3 = 6 → not seen, store 3 → seen = {3:0}",
          caption: "Partner of 3 is 6; nothing stored yet, so record value 3 at index 0.",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          marked: [0],
          action: "need 9 − 8 = 1 → not seen, store 8 → seen = {3:0, 8:1}",
          caption: "A miss: 1 was never seen. Add value 8 at index 1 and move on.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [0, 1],
          action: "need 9 − 2 = 7 → not seen, store 2 → seen = {3:0, 8:1, 2:2}",
          caption: "Still no partner — 7 hasn't appeared. Record value 2 at index 2.",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          marked: [0, 1, 2],
          action: "need 9 − 7 = 2 → seen at index 2 → return [2, 3]",
          caption: "Hit: the partner 2 was stored back at index 2. The pair is [2, 3], already ascending.",
        },
      ],
    },
  ],

  "set-matrix-zeroes": [
    {
      kind: "prose",
      body:
        "We can't zero a cell's row and column the instant we see a `0` — those freshly written zeros would " +
        "look like original zeros to the rest of the scan and cascade outward, eventually wiping the whole " +
        "matrix. The fix is to **decide first, write second**: one pass records *which* rows and *which* " +
        "columns contain a zero into two sets, and a second pass zeroes a cell only if its row or column was " +
        "marked. No write can corrupt a decision, because every decision is already made.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — two sets remember the marked rows and columns: O(m·n) time, O(m + n) space.",
      source:
        "function setZeroes(matrix) {\n" +
        "  const zeroRows = new Set();\n" +
        "  const zeroCols = new Set();\n" +
        "  // Pass 1: only *record* which rows and columns had a zero — write nothing yet.\n" +
        "  for (let i = 0; i < matrix.length; i++) {\n" +
        "    for (let j = 0; j < matrix[0].length; j++) {\n" +
        "      if (matrix[i][j] === 0) {\n" +
        "        zeroRows.add(i);\n" +
        "        zeroCols.add(j);\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  // Pass 2: zero a cell iff its row or column was marked — decisions are frozen.\n" +
        "  for (let i = 0; i < matrix.length; i++) {\n" +
        "    for (let j = 0; j < matrix[0].length; j++) {\n" +
        "      if (zeroRows.has(i) || zeroCols.has(j)) matrix[i][j] = 0;\n" +
        "    }\n" +
        "  }\n" +
        "  return matrix;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This runs in O(m·n) time, which is optimal — we have to look at every cell at least once. But the two " +
        "sets cost O(m + n) extra space. Can we do better on space?\n\n" +
        "The key observation: the matrix already contains `m + n` cells we could repurpose as marker storage — " +
        "its **first row and first column**. Let `matrix[0][j]` stand in for `zeroCols.has(j)` and `matrix[i][0]` " +
        "for `zeroRows.has(i)`. Scanning the *interior* (rows and columns from index 1), whenever a cell is `0` " +
        "we stamp a `0` into its column's header `matrix[0][j]` and its row's header `matrix[i][0]`. That is the " +
        "[hash maps](/learn/guide/algos/topic/hash-maps) marker idea — membership flags — pushed down to O(1) " +
        "extra space by storing the flags inside the data itself.\n\n" +
        "The catch is the first row and first column overlap at `matrix[0][0]` and double as both data and " +
        "markers, so we can't let them encode their own fate. We track *those two* with a pair of booleans " +
        "(`firstRowZero`, `firstColZero`) scanned up front, mark and apply the interior from the headers, then " +
        "zero the first row and first column **last** from the two booleans. So the stored solution keeps the " +
        "two-pass *decide-then-write* spine of the brute force; it just swaps the two `Set`s for the matrix's " +
        "own border plus two flags.\n\n" +
        "Here's that marker scan on a 3x4 grid — the highlighted **border** holds the flags; watch interior zeros " +
        "stamp their row and column headers, then the apply pass clear every flagged cell:",
    },
    {
      kind: "gridWalkthrough",
      heading: "matrix = [[1,2,3,4],[5,0,7,8],[9,1,2,0]] — border row/column store the flags",
      showIndices: true,
      grid: [
        [1, 2, 3, 4],
        [5, 0, 7, 8],
        [9, 1, 2, 0],
      ],
      frames: [
        {
          active: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [2, 0]],
          action: "firstRowZero = false · firstColZero = false",
          caption: "Neither the first row nor the first column holds an original zero, so the border (highlighted) is free to repurpose as marker storage.",
        },
        {
          grid: [
            [1, 0, 3, 4],
            [0, 0, 7, 8],
            [9, 1, 2, 0],
          ],
          cursor: [1, 1],
          marked: [[0, 1], [1, 0]],
          action: "0 @ (1,1) → stamp headers (0,1) and (1,0)",
          caption: "Interior zero at (1,1): write 0 into its column header (0,1) and its row header (1,0). The data zero stays put.",
        },
        {
          grid: [
            [1, 0, 3, 0],
            [0, 0, 7, 8],
            [0, 1, 2, 0],
          ],
          cursor: [2, 3],
          marked: [[0, 3], [2, 0]],
          action: "0 @ (2,3) → stamp headers (0,3) and (2,0)",
          caption: "Second interior zero at (2,3) stamps header (0,3) and (2,0). The border now flags rows 1, 2 and columns 1, 3.",
        },
        {
          grid: [
            [1, 0, 3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ],
          marked: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3]],
          action: "apply: zero each interior cell with a flagged header",
          caption: "Second pass clears every interior cell whose row or column header is 0. Both border flags were false, so the first row and column keep their non-marker values — the matrix is done.",
        },
      ],
    },
  ],

  "longest-consecutive-sequence": [
    {
      kind: "prose",
      body:
        "The most direct way to find the longest run of consecutive values is to **sort** the array, then walk it " +
        "once: every time the next value is exactly one more than the previous, the current run grows; otherwise " +
        "the run resets. Track the longest run seen. Sorting lines the values up so consecutive numbers sit next " +
        "to each other, and a single pass measures every run.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — sort, then scan for the longest consecutive run: O(n log n).",
      source:
        "function longestConsecutive(nums) {\n" +
        "  if (nums.length === 0) return 0;\n" +
        "  // Sort so consecutive values become adjacent.\n" +
        "  const sorted = [...nums].sort((a, b) => a - b);\n" +
        "  let longest = 1;\n" +
        "  let run = 1;\n" +
        "  for (let i = 1; i < sorted.length; i++) {\n" +
        "    if (sorted[i] === sorted[i - 1]) continue; // duplicate counts once\n" +
        "    if (sorted[i] === sorted[i - 1] + 1) {\n" +
        "      run++; // extends the current run\n" +
        "    } else {\n" +
        "      run = 1; // gap — start a fresh run\n" +
        "    }\n" +
        "    longest = Math.max(longest, run);\n" +
        "  }\n" +
        "  return longest;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n log n) — the sort dominates, and the prompt asks for O(n). Can we do better than sorting?\n\n" +
        "The only reason we sorted was to ask *\"is the next number present?\"* — but a hash set answers exactly " +
        "that in O(1), no ordering required. Dump every value into a `Set` (which also drops duplicates for free), " +
        "and consecutiveness becomes a membership test: a run containing `n` simply means `n`, `n+1`, `n+2`, … are " +
        "all in the set.\n\n" +
        "The key observation that keeps this linear: **only start counting a run from its smallest value** — a value " +
        "`n` whose predecessor `n - 1` is *absent* from the set. Any value in the middle of a run has its predecessor " +
        "present, so we skip it rather than re-walking the same run from the inside. That guard means each run is " +
        "walked exactly once, and across all runs every value is visited at most twice — so despite the nested-looking " +
        "while loop, the total work is O(n). This trading of O(n) space for O(1) lookups is the core " +
        "[hash maps](/learn/guide/algos/topic/hash-maps) move.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "set of nums = [100, 4, 200, 1, 3, 2] — walk forward only from run starts",
      lane: [100, 4, 200, 1, 3, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "n", at: 0 }],
          action: "has(99)? no → run start; has(101)? no",
          caption: "100 is a run start (99 absent), but 101 is missing too — a lone run of length 1.",
        },
        {
          pointers: [{ name: "n", at: 1 }],
          marked: [1],
          action: "has(3)? yes → skip",
          caption: "A skip step: 4 has predecessor 3 in the set, so it sits inside a run — don't start here.",
        },
        {
          pointers: [{ name: "n", at: 3 }],
          action: "has(0)? no → run start",
          caption: "1 is a run start (0 absent). Begin walking forward: length = 1, look for 2.",
        },
        {
          pointers: [{ name: "n", at: 3 }, { name: "current", at: 1 }],
          marked: [3, 5, 4, 1],
          action: "has(2),has(3),has(4) ✓ → length 4; has(5)? no",
          caption: "Walk 1 → 2 → 3 → 4 (all present, scattered across the lane), stop at the missing 5. Run length 4. longest = 4.",
        },
        {
          pointers: [{ name: "n", at: 4 }],
          marked: [4],
          action: "has(2)? yes → skip",
          caption: "3 has predecessor 2 present — skip. Same for 2 (1 present). They were already counted by the walk.",
        },
      ],
    },
  ],

  "reverse-linked-list": [
    {
      kind: "prose",
      body:
        "The most direct approach sidesteps pointer surgery entirely: walk the list collecting the values into " +
        "an array, then build a brand-new list from that array read back-to-front.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — collect values, rebuild reversed: O(n) time, O(n) extra space.",
      source:
        "function reverseList(head) {\n" +
        "  // Walk once, copying every value into an array.\n" +
        "  const values = [];\n" +
        "  for (let node = head; node; node = node.next) {\n" +
        "    values.push(node.val);\n" +
        "  }\n" +
        "  // Build a fresh list from the values, last value first.\n" +
        "  let newHead = null;\n" +
        "  for (const val of values) {\n" +
        "    newHead = new ListNode(val, newHead); // prepend → reverses order\n" +
        "  }\n" +
        "  return newHead;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This works, but it allocates a whole second list plus the values array — O(n) extra space for a problem " +
        "that's really just *relinking* nodes we already have. Can we do better?\n\n" +
        "The key observation: reversing a list means flipping the direction of every `next` pointer. Node by " +
        "node, `1 -> 2 -> 3` becomes `1 <- 2 <- 3`. We don't need new nodes at all — we can rewire the existing " +
        "ones in a single pass.\n\n" +
        "The catch is that the moment we set `curr.next = prev`, we've destroyed the link to the *rest* of the " +
        "list. So before flipping, stash `curr.next` in a temporary `next`. Carry three pointers — `prev` (the " +
        "reversed part so far, starting at `null`), `curr` (the node being flipped), and the saved `next` — and " +
        "slide them forward together.\n\n" +
        "Walking it through on `1 -> 2 -> 3`:",
    },
    {
      kind: "listWalkthrough",
      heading: "reversing 1 -> 2 -> 3 in place",
      nodes: [1, 2, 3],
      frames: [
        {
          pointers: [{ name: "prev", at: null }, { name: "curr", at: 0 }],
          action: "save next = 2; curr.next = prev",
          caption: "Start: prev = null, curr = node 1. Stash node 1's next (node 2), then flip node 1's link to null.",
        },
        {
          pointers: [{ name: "prev", at: 0 }, { name: "curr", at: 1 }],
          links: { 0: null },
          action: "save next = 3; curr.next = prev",
          caption: "Slide forward: prev = node 1, curr = node 2. Node 1 now points at null. Flip node 2's link back to node 1.",
        },
        {
          pointers: [{ name: "prev", at: 1 }, { name: "curr", at: 2 }],
          links: { 0: null, 1: 0 },
          action: "save next = null; curr.next = prev",
          caption: "prev = node 2, curr = node 3. Node 2 points back at node 1. Flip node 3's link back to node 2.",
        },
        {
          pointers: [{ name: "prev", at: 2 }, { name: "curr", at: null }],
          links: { 0: null, 1: 0, 2: 1 },
          action: "curr = null → stop",
          caption: "curr fell off the end. Every link now faces backward: 3 -> 2 -> 1 -> null. prev (node 3) is the new head.",
        },
      ],
    },
  ],

  "remove-nth-node-from-end-of-list": [
    {
      kind: "prose",
      body:
        "Counting from the *end* is awkward in a singly linked list — you can only walk forward. The obvious fix " +
        "is two passes: walk once to measure the length `L`, then walk again to the `(L - n)`-th node (the one " +
        "just before the target) and splice the target out.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — measure length, then walk to the predecessor: two passes, O(L).",
      source:
        "function removeNthFromEnd(head, n) {\n" +
        "  // First pass: count the nodes.\n" +
        "  let length = 0;\n" +
        "  for (let node = head; node; node = node.next) length++;\n" +
        "  // A dummy before the head lets us delete the head uniformly.\n" +
        "  const dummy = new ListNode(0, head);\n" +
        "  // Second pass: stop on the node just before the target.\n" +
        "  let prev = dummy;\n" +
        "  for (let i = 0; i < length - n; i++) prev = prev.next;\n" +
        "  prev.next = prev.next.next; // skip the target\n" +
        "  return dummy.next;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Two passes is fine — O(L) — but interviewers usually want the *one-pass* version, which also reveals a " +
        "reusable trick. Can we find the predecessor without first knowing `L`?\n\n" +
        "The key observation: fix a **gap** between two pointers. If `fast` is exactly `n + 1` nodes ahead of " +
        "`slow`, then when `fast` walks off the end, `slow` is sitting `n + 1` from the end — i.e. on the node " +
        "*just before* the one to remove. This is the [Two pointers](/learn/guide/algos/topic/two-pointers) " +
        "gap technique applied to nodes.\n\n" +
        "Start both at a `dummy` before the head, advance `fast` by `n + 1`, then move both together until `fast` " +
        "is null. One splice and we're done.\n\n" +
        "**Note on the model:** the stored solution opens the gap with the loop `for (i = 0; i <= n; i++) fast = " +
        "fast.next` — that's `n + 1` iterations, the same `n + 1` gap described here. Walking it through on " +
        "`1 -> 2 -> 3 -> 4 -> 5` with `n = 2` (remove the `4`):",
    },
    {
      kind: "listWalkthrough",
      heading: "remove 2nd-from-end of 1 -> 2 -> 3 -> 4 -> 5",
      nodes: ["d", 1, 2, 3, 4, 5],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 0 }],
          caption: "Both start on the dummy `d` (index 0). We'll open a gap of n + 1 = 3 between them.",
        },
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 3 }],
          action: "advance fast n + 1 = 3 steps",
          caption: "fast jumps to node 3 (value 3). The gap from slow to fast is now 3 nodes.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 4 }],
          action: "move both together",
          caption: "Lockstep step 1: slow → value 1, fast → value 4. The gap is preserved.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: 5 }],
          action: "move both together",
          caption: "Lockstep step 2: slow → value 2, fast → value 5 (the last node).",
        },
        {
          pointers: [{ name: "slow", at: 3 }, { name: "fast", at: null }],
          action: "fast = null → splice",
          caption: "fast fell off the end. slow sits on value 3 — exactly the node before the target.",
        },
        {
          pointers: [{ name: "slow", at: 3 }],
          links: { 3: 5 },
          marked: [4],
          action: "slow.next = slow.next.next",
          caption: "Skip node 4 by relinking value 3 straight to value 5. Result: 1 -> 2 -> 3 -> 5.",
        },
      ],
    },
  ],

  "palindrome-linked-list": [
    {
      kind: "prose",
      body:
        "A palindrome reads the same both ways, so the simplest check copies every value into an array and " +
        "compares it against its reverse with two indices closing in from the ends.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — dump to an array, compare ends inward: O(n) time, O(n) extra space.",
      source:
        "function isPalindrome(head) {\n" +
        "  // Copy the values out so we can index from both ends.\n" +
        "  const values = [];\n" +
        "  for (let node = head; node; node = node.next) values.push(node.val);\n" +
        "  // Two pointers converging — the classic palindrome check.\n" +
        "  let left = 0;\n" +
        "  let right = values.length - 1;\n" +
        "  while (left < right) {\n" +
        "    if (values[left] !== values[right]) return false;\n" +
        "    left++;\n" +
        "    right--;\n" +
        "  }\n" +
        "  return true;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That's a clean O(n) check, but it spends O(n) extra space on the array. Can we do better and use O(1) " +
        "space, working on the list itself?\n\n" +
        "The key observation: to compare the front half against the back half we need to read the back half " +
        "*forward*. A list only goes one way — so **reverse the back half in place**, then walk the two halves " +
        "toward the middle.\n\n" +
        "Two sub-techniques combine here, both from the [Two pointers](/learn/guide/algos/topic/two-pointers) " +
        "toolkit: **fast/slow** finds the midpoint (`fast` moves two nodes per one of `slow`, so when `fast` " +
        "hits the end, `slow` is at the middle), and the three-pointer **reversal** flips the second half. Then " +
        "compare the original front with the reversed back in lockstep.\n\n" +
        "**Note on the model:** in the stored solution `slow` does double duty — first as the midpoint finder, " +
        "then it's consumed by the reversal loop, leaving `prev` as the head of the reversed back half (the " +
        "`right` walker below). Walking it through on `1 -> 2 -> 2 -> 1`:",
    },
    {
      kind: "listWalkthrough",
      heading: "is 1 -> 2 -> 2 -> 1 a palindrome?",
      nodes: [1, 2, 2, 1],
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 0 }],
          caption: "Both start at the head. fast will move twice as fast as slow to locate the midpoint.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 2 }],
          action: "slow += 1, fast += 2",
          caption: "One step: slow → index 1, fast → index 2. fast.next is the last node, so the loop stops next.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: null }],
          active: [2, 3],
          action: "fast off end → slow at 2nd half",
          caption: "slow lands at index 2, the start of the back half (indices 2..3). Now reverse from here.",
        },
        {
          pointers: [{ name: "right", at: 3 }, { name: "left", at: 0 }],
          links: { 3: 2 },
          active: [2, 3],
          action: "reverse back half",
          caption: "The back half is reversed: index 3 now points to index 2. `right` heads it; `left` is the original head.",
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 3 }],
          links: { 3: 2 },
          action: "1 == 1 ✓, then 2 == 2 ✓",
          caption: "Compare in lockstep: left value 1 == right value 1, then 2 == 2. The reversed half ends — all matched → palindrome.",
        },
      ],
    },
  ],

  "intersection-of-two-linked-lists": [
    {
      kind: "prose",
      body:
        "Two lists *intersect* when, from some node on, they share the exact same tail. The brute-force check is " +
        "the nested one: for every node in list A, walk all of list B looking for the same node (here, the same " +
        "position in the shared suffix).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each A-node, scan all of B: O(m × n).",
      source:
        "function getIntersectionValue(a, b, skipA, skipB) {\n" +
        "  if (skipA < 0 || skipB < 0) return null; // no merge\n" +
        "  // For each node in A, look for a matching shared-suffix node in B.\n" +
        "  for (let i = 0; i < a.length; i++) {\n" +
        "    for (let j = 0; j < b.length; j++) {\n" +
        "      // Same node iff both sit in the shared suffix at the same offset.\n" +
        "      if (i >= skipA && j >= skipB && i - skipA === j - skipB) {\n" +
        "        return a[i]; // first such match is the intersection\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return null;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "The nested scan is O(m × n). Can we do better?\n\n" +
        "The key observation: if the lists merge, they share a common *tail*, so they have the same number of " +
        "nodes *after* the intersection. The only thing in the way is that the two lists can have different " +
        "lengths before the merge, so a node at distance `d` from head A isn't at distance `d` from head B.\n\n" +
        "The elegant fix is the **length-alignment** [two-pointer](/learn/guide/algos/topic/two-pointers) walk: " +
        "send pointer `pa` through A *then* B, and `pb` through B *then* A. Each covers `m + n` nodes total, so " +
        "after the switch they're aligned and arrive at the first shared node on the same step (or both hit " +
        "`null` together if there's no merge). No length pre-count, O(1) space.\n\n" +
        "**Note on the model:** this page is the array-encoded form of the classic node-identity problem (a node " +
        "is `(list, index)`, the same node when both lie in the shared suffix at the same offset). The encoding " +
        "makes the first shared node's value simply `a[skipA]`, so the stored solution returns that directly — " +
        "but the alignment walk below is the idea you'd run on real shared nodes.\n\n" +
        "*(Two lists sharing a tail aren't a single chain, so a node-chain diagram would misrepresent them — the " +
        "alignment is shown as a trace instead.)* Take A = `4 -> 1 -> 8 -> 4 -> 5` (length 5) and " +
        "B = `5 -> 6 -> 1 -> 8 -> 4 -> 5` (length 6), sharing the tail `8 -> 4 -> 5`:",
    },
    {
      kind: "prose",
      body:
        "- **Step 0** — `pa` at A's head (`4`), `pb` at B's head (`5`). pa is 2 nodes before the shared `8`; pb is 3 before it. Misaligned by the length gap (6 − 5 = 1).\n" +
        "- **pa reaches A's end** after 5 steps and **switches to B's head**. pb reaches B's end after 6 steps and **switches to A's head**. Each has now walked 5 + 6 = 11 nodes.\n" +
        "- From the switch, `pa` is 3 nodes into the combined walk's second leg and `pb` is 2 — and because each will walk the *other* list's prefix, the leftover distance to the shared `8` is now identical for both.\n" +
        "- **They meet** on the same physical node — the first shared `8`. That's the intersection. (Had the lists not merged, both would reach `null` on the same step and we'd report no intersection.)",
    },
  ],
};

/**
 * A row in a problem's "Test cases" table — an edge case worth thinking through, *not* a hidden judge test.
 * Stored as runnable `args`/`expected` (same shape the judge uses) so the auditor agent can execute each case
 * through the worker; the table's Input / Expected columns are *derived* from these, matching the Example
 * section's formatting. `args` is the argument tuple in call order; `expected` is the reference return.
 */
export type GuideTestCase = { args: unknown[]; expected: unknown; note: string };

/** Fresh 9x9 board of empty cells, for building small single-conflict test boards. */
const emptyBoard = () => Array.from({ length: 9 }, () => Array<string>(9).fill("."));

/**
 * Post-optimization teaching content, shown *after* the Optimization section: a complexity write-up and a
 * table of edge cases worth considering. Authored (the test cases are deliberately not the real hidden tests,
 * so the page can't be used to game the judge). Keyed by problem id, same enrichment posture as PROBLEM_GUIDES.
 */
export const PROBLEM_EXTRAS: Record<string, { complexity?: Section[]; testCases?: GuideTestCase[] }> = {
  "set-matrix-zeroes": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m·n). Here's why:\n\n" +
          "- A first sweep over every cell records which rows and columns must be zeroed — `m × n` cells.\n" +
          "- A second sweep over every cell applies the marks — another `m × n` cells.\n\n" +
          "Both passes are linear in the cell count and run one after the other, so the total is " +
          "2 × O(m·n) = **O(m·n)**, where `m` and `n` are the matrix's dimensions. We can't do better — any " +
          "correct solution must inspect every cell at least once.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The brute-force baseline keeps two sets, `zeroRows` and `zeroCols`, holding up to `m` and `n` " +
          "entries — that's O(m + n) extra space.\n" +
          "- The stored solution drops both sets: it reuses the matrix's own first row and first column as the " +
          "marker storage and adds only two booleans (`firstRowZero`, `firstColZero`) — O(1) extra space.\n\n" +
          "So the optimization trades the O(m + n) sets for **O(1)** extra space. Nothing new is allocated — the " +
          "result is the same matrix mutated in place, so there is no output array to count.",
      },
    ],
    testCases: [
      {
        args: [[[1, 2, 3], [4, 5, 6]]],
        expected: [[1, 2, 3], [4, 5, 6]],
        note: "No zero anywhere — the matrix is returned unchanged.",
      },
      {
        args: [[[2, 3, 4], [5, 0, 7], [8, 9, 1]]],
        expected: [[2, 0, 4], [0, 0, 0], [8, 0, 1]],
        note: "A single interior zero at (1,1) clears row 1 and column 1, leaving the corners intact.",
      },
      {
        args: [[[0, 3, 3], [4, 5, 6]]],
        expected: [[0, 0, 0], [0, 5, 6]],
        note: "Zero in the top-left corner — the tricky case for the marker trick, since (0,0) is both a header and data. firstRowZero and firstColZero handle it: row 0 and column 0 both clear.",
      },
      {
        args: [[[1, 2], [0, 0]]],
        expected: [[0, 0], [0, 0]],
        note: "An all-zero row marks both columns, so its zeros cascade upward and the whole matrix clears.",
      },
      {
        args: [[[2, 0, 4, 5]]],
        expected: [[0, 0, 0, 0]],
        note: "Single-row 1xN matrix — the only row contains a zero, so the entire row clears.",
      },
      {
        args: [[[2], [0], [5]]],
        expected: [[0], [0], [0]],
        note: "Single-column Nx1 matrix — the zero at (1,0) clears the lone column top to bottom.",
      },
    ],
  },

  "valid-sudoku": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(1) for this problem. Here's why:\n\n" +
          "- The board is a fixed `9 x 9`, so the scan always visits exactly 81 cells.\n" +
          "- Each cell does a constant amount of work: derive three keys and do three O(1) set probes.\n\n" +
          "There is no loop whose length grows with an input size, so the work is bounded by a constant — **O(1)**. " +
          "Phrased for a general `n x n` board it would be **O(n²)**: one visit per cell over the n² cells, with " +
          "O(1) per cell.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1) for this problem. Here's why:\n\n" +
          "- The `seen` set holds at most three keys per filled cell, so at most 3 × 81 = 243 keys — a fixed bound.\n" +
          "- No other storage grows with the board.\n\n" +
          "So the extra space is constant, **O(1)**. For a general `n x n` board the set holds up to O(n²) keys, " +
          "so it would be **O(n²)**. Nothing is returned but a boolean, so there is no output array to count.",
      },
    ],
    testCases: [
      {
        args: [emptyBoard()],
        expected: true,
        note: "Empty board — no filled cells means no constraints, so it is trivially valid.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[4][4] = "9"; return b; })()],
        expected: true,
        note: "A single filled cell can never conflict with itself.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[2][0] = "6"; b[2][7] = "6"; return b; })()],
        expected: false,
        note: "Row conflict — two 6s in row 2 (different boxes), caught by the shared `row-2-6` key.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[0][3] = "2"; b[5][3] = "2"; return b; })()],
        expected: false,
        note: "Column conflict — two 2s down column 3 (different rows and boxes).",
      },
      {
        args: [(() => { const b = emptyBoard(); b[3][3] = "4"; b[5][5] = "4"; return b; })()],
        expected: false,
        note: "Box-only conflict — two 4s in the centre box at different rows and columns.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[0][0] = "7"; b[4][4] = "7"; b[8][8] = "7"; return b; })()],
        expected: true,
        note: "Same digit, distinct row/column/box each time — repeats across the board are allowed.",
      },
    ],
  },

  "valid-palindrome": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Cleaning the string scans every character once to lowercase it and drop non-alphanumerics — O(n).\n" +
          "- The two pointers then start at opposite ends and only move toward each other, touching each cleaned " +
          "character at most once — O(n).\n\n" +
          "Both passes are linear and run one after the other, so the overall time is **O(n)**, where `n` is the " +
          "length of `s`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The cleaned, lowercased copy of the string can be as long as the input — O(n).\n" +
          "- The two-pointer scan over it adds only a couple of index variables — O(1).\n\n" +
          "The cleaned copy dominates, so the extra space is **O(n)**. (Skipping non-alphanumerics in place on the " +
          "original string instead of copying would bring this down to O(1).)",
      },
    ],
    testCases: [
      { args: ["?!#"], expected: true, note: "All non-alphanumeric — cleans to the empty string, which counts as a palindrome." },
      { args: ["Z"], expected: true, note: "Single character — trivially reads the same both ways." },
      { args: ["ab"], expected: false, note: "Smallest non-palindrome: two distinct letters, 'a' != 'b'." },
      { args: ["AaA"], expected: true, note: "Mixed case that lowercases to 'aaa' — all-equal, so a palindrome." },
      { args: ["Madam, I'm Adam"], expected: true, note: "Mixed case and punctuation cleaned away leaves 'madamimadam'." },
      { args: ["1a2"], expected: false, note: "Alphanumeric mix where the ends '1' and '2' differ." },
    ],
  },

  "container-with-most-water": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The two pointers start at opposite ends and only ever move toward each other.\n" +
          "- Each step measures one pair in O(1) and then advances exactly one pointer.\n\n" +
          "The pointers together cover the array once before they meet, so the whole scan is **O(n)** — no sort, " +
          "no nesting.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- It keeps only the two pointers and a running `best`.\n" +
          "- The input is read in place — nothing is copied or accumulated.\n\n" +
          "There is no auxiliary structure that grows with the input, so the extra space is constant — **O(1)**.",
      },
    ],
    testCases: [
      { args: [[2, 0]], expected: 0, note: "Smallest input, zero-area: a flat end caps the shorter wall — min(2,0)·1." },
      { args: [[3, 3, 3]], expected: 6, note: "All equal: width wins, so the outermost pair is best — min(3,3)·2." },
      { args: [[1, 9, 1]], expected: 2, note: "A tall middle wall is wasted — the short ends cap the level — min(1,1)·2." },
      { args: [[4, 1, 4]], expected: 8, note: "Duplicate end walls beat the deep valley between them — min(4,4)·2." },
      { args: [[6, 0, 6]], expected: 12, note: "Tall ends over a flat middle — min(6,6)·2." },
    ],
  },

  "geometric-sequence-triplets": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- One pass seeds the `right` frequency map with every value — O(n).\n" +
          "- The main sweep visits each index once; per index it does a constant number of map operations (one " +
          "removal from `right`, two lookups, one insertion into `left`), each O(1) on average.\n\n" +
          "There is no nested loop — the brute force's inner two loops are replaced by two constant-time map probes — " +
          "so the whole thing is **O(n)**, where `n` is the length of `nums`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `right` map starts with one entry per distinct value, up to O(n) of them.\n" +
          "- As the sweep proceeds, values shift into the `left` map, which together with `right` holds at most O(n) " +
          "entries.\n\n" +
          "Both maps together are bounded by the number of distinct values, so the auxiliary space is **O(n)**. The " +
          "running `count` is a single integer and isn't counted.",
      },
    ],
    testCases: [
      { args: [[9, 3], 3], expected: 0, note: "Only two elements — a triplet needs three indices." },
      { args: [[2, 6, 10], 3], expected: 0, note: "No-solution case: 2×3 = 6, but 6×3 = 18 ≠ 10." },
      { args: [[1, 10, 100], 10], expected: 1, note: "Smallest exact chain with r > 1 — one triplet." },
      {
        args: [[4, 4, 4, 4, 4, 4], 1],
        expected: 20,
        note: "All equal with r = 1 — every i < j < k qualifies: C(6, 3) = 20.",
      },
      {
        args: [[2, 4, 4, 8, 8], 2],
        expected: 4,
        note: "Overlapping repeats: each of the two 4s pairs with one 2 on the left and two 8s on the right → 2 + 2.",
      },
    ],
  },

  "longest-substring-without-repeating-characters": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The loop visits each index `i` once, left to right.\n" +
          "- Per step the work is O(1): one map lookup, one map write, and a constant comparison — `start` only " +
          "ever moves forward, so it isn't a nested scan.\n\n" +
          "The whole pass is **O(n)**, where `n` is the length of `s` — versus the O(n³) of the brute force.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(min(n, σ)). Here's why:\n\n" +
          "- The `lastSeen` map holds at most one entry per *distinct* character.\n" +
          "- That can't exceed the alphabet size σ, nor the string length n.\n\n" +
          "So the extra space is **O(min(n, σ))** — bounded by the alphabet for a fixed character set.",
      },
    ],
    testCases: [
      { args: [""], expected: 0, note: "Empty string — the loop never runs." },
      { args: ["z"], expected: 1, note: "Single character — window of width 1." },
      { args: ["bbbb"], expected: 1, note: "All identical — start keeps jumping, width stays 1." },
      { args: ["abcde"], expected: 5, note: "All distinct — the whole string is the window." },
      { args: ["abccba"], expected: 3, note: "start must not rewind: after the \"cc\" repeat the leading \"ab\" sits outside the window." },
      { args: ["tmmzuxt"], expected: 5, note: "Answer \"mzuxt\" is in the middle; the early \"t\" is correctly skipped." },
    ],
  },

  "find-all-anagrams-in-a-string": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Building `p`'s counts is O(p.length), and the one-time comparison of the 26 slots is O(1).\n" +
          "- The window then slides across `s` once; each step adds one letter and removes one, updating `matches` " +
          "in O(1) rather than re-scanning all 26 counts.\n\n" +
          "So the scan is **O(n)** where `n = s.length` (the `p` pre-pass is dominated by it).",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- `need` and `have` are fixed 26-slot arrays regardless of input size.\n" +
          "- The `matches` counter is a single integer.\n\n" +
          "The extra space is **O(1)** for a fixed alphabet. The output array isn't counted; it can hold up to " +
          "O(n) indices in the worst case.",
      },
    ],
    testCases: [
      { args: ["xy", "xyz"], expected: [], note: "Pattern longer than the text — early return, no windows." },
      { args: ["az", "za"], expected: [0], note: "Single window, reordered letters — an anagram at index 0." },
      { args: ["abcabc", "abc"], expected: [0, 1, 2, 3], note: "A periodic string — every length-3 window is an anagram." },
      { args: ["hello", "ll"], expected: [2], note: "Repeated letters in the pattern — only the \"ll\" window matches counts." },
      { args: ["pqrs", "tu"], expected: [], note: "Pattern letters never appear — no match anywhere." },
      { args: ["abcba", "abc"], expected: [0, 2], note: "Two anagrams (\"abc\" and \"cba\") around a non-matching middle window." },
    ],
  },

  "longest-repeating-character-replacement": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- `right` advances across the string once; `left` only ever moves forward and at most as far as `right`.\n" +
          "- Each step does O(1) work — one count update, a `maxFreq` comparison, and at most one left eviction " +
          "(the alphabet is a fixed 26 letters, so `maxFreq` is read directly, never re-scanned).\n\n" +
          "Both pointers traverse the string at most once, so the whole pass is **O(n)** where `n = s.length`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The `count` array has a fixed 26 slots, one per uppercase letter.\n" +
          "- A handful of integers (`left`, `maxFreq`, `best`) round it out.\n\n" +
          "Independent of input size, the extra space is **O(1)**.",
      },
    ],
    testCases: [
      { args: ["B", 0], expected: 1, note: "Single character — already uniform." },
      { args: ["CCCC", 0], expected: 4, note: "All same with no budget — the whole string." },
      { args: ["XYZW", 0], expected: 1, note: "All distinct, no replacements — best run is a single letter." },
      { args: ["XYXY", 2], expected: 4, note: "Budget covers the two minority letters — whole string becomes uniform." },
      { args: ["AABBA", 1], expected: 3, note: "k = 1 can't unify all five; the best window is width 3." },
      { args: ["AAABBB", 2], expected: 5, note: "k = 2 stretches across the boundary for a width-5 window." },
    ],
  },

  "3sum": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n²). Here's why:\n\n" +
          "- Sorting the array takes O(n log n).\n" +
          "- Then, for each of the `n` values, a two-pointer scan over the suffix runs in O(n).\n\n" +
          "So the scans cost n × O(n) = O(n²), which dominates the sort — the overall time is **O(n²)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The sorted copy of the input takes O(n) (plus the sort's own bookkeeping).\n" +
          "- The two-pointer scan itself uses only a handful of variables — O(1).\n\n" +
          "The output array isn't counted as auxiliary space; if it were, it could hold up to O(n²) triplets in the worst case.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty array — nothing to pair." },
      { args: [[0]], expected: [], note: "Single element; a triplet needs three." },
      { args: [[0, 0]], expected: [], note: "Two elements — still no triplet." },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]], note: "All zeros — exactly one valid triplet." },
      { args: [[1, 2, 3]], expected: [], note: "All positive; nothing can sum to 0." },
      {
        args: [[-2, 0, 1, 1, 2]],
        expected: [[-2, 0, 2], [-2, 1, 1]],
        note: "Duplicates that must not yield repeated triplets.",
      },
    ],
  },

  "two-sum": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The array is scanned once, left to right, visiting each element a single time.\n" +
          "- Per element the work is O(1): one hash-map lookup for the partner and at most one insertion.\n\n" +
          "There is no nested loop — the inner scan of the brute force is replaced by a constant-time map probe " +
          "— so the whole pass is **O(n)**, where `n` is the length of `nums`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `seen` map can hold up to one entry per element if the answer is the final pair.\n" +
          "- Each entry is a `value → index` mapping taking O(1), so the map grows linearly with the input.\n\n" +
          "That extra map is the cost of the speed-up — we spend **O(n)** space to drop the time from O(n²) to " +
          "O(n). The returned two-index array isn't counted as auxiliary space.",
      },
    ],
    testCases: [
      { args: [[1, 4], 5], expected: [0, 1], note: "Smallest valid input — two elements that sum to target." },
      { args: [[1, 2, 4], 8], expected: [], note: "No pair sums to target — the unreachable fallback returns []." },
      { args: [[-4, -1, -3, -8], -7], expected: [0, 2], note: "Negatives — −4 + −3 = −7, found by a later index." },
      { args: [[5, 5, 3], 10], expected: [0, 1], note: "Duplicate values — two equal 5s pair up; second is the partner." },
      { args: [[6, 2, 8, 1, 5], 6], expected: [3, 4], note: "Target reached only by a later pair: 1 + 5 at the end." },
    ],
  },

  "3sum-closest": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n²). Here's why:\n\n" +
          "- Sorting the array takes O(n log n).\n" +
          "- Then, for each of the `n` choices of the fixed element `i`, a two-pointer scan sweeps the suffix in O(n).\n\n" +
          "So the scans cost n × O(n) = O(n²), which dominates the sort — the overall time is **O(n²)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1) auxiliary. Here's why:\n\n" +
          "- The scan keeps only a handful of variables — `best`, `lo`, `hi`, and the running `sum`.\n" +
          "- No extra arrays or maps are built; the answer is a single number, not a collection.\n\n" +
          "Sorting in place adds at most O(log n) for the sort's own stack, and the input array itself isn't counted as auxiliary space.",
      },
    ],
    testCases: [
      { args: [[3, 7, 1], 12], expected: 11, note: "Smallest input — the only triple, so its sum 3+7+1 is the answer." },
      { args: [[4, 4, 4, 4], 5], expected: 12, note: "All equal — every triple sums to 12; closest is forced." },
      { args: [[-6, -3, 0, 2], -7], expected: -7, note: "Negative target hit exactly — −6+−3+2 = −7 returns early." },
      { args: [[0, 1, 3, 5], 5], expected: 4, note: "Tie: sums 4 and 6 are equidistant; strict `<` keeps the first-seen 4." },
      { args: [[-1, -1, 3, 3], 2], expected: 1, note: "Duplicate values — closest sum −1+−1+3 = 1 sits one below target." },
    ],
  },

  "trapping-rain-water": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The two pointers start at opposite ends and only ever move toward each other.\n" +
          "- Each step compares the two current bars, updates one running max, and banks any water in O(1) before " +
          "advancing exactly one pointer.\n\n" +
          "Together the pointers cover every bar once before they meet, so the whole pass is **O(n)** — no rescans, " +
          "no nesting, where `n` is the number of bars.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- It keeps only the two pointers, the two running maxima, and a running `total`.\n" +
          "- The input is read in place; nothing is copied or accumulated into an auxiliary structure.\n\n" +
          "No storage grows with the input, so the extra space is constant — **O(1)**. (The classic " +
          "prefix-max / suffix-max solution computes the same answer but stores two O(n) arrays.)",
      },
    ],
    testCases: [
      { args: [[]], expected: 0, note: "Empty elevation map — no bars, so nothing to trap." },
      { args: [[7]], expected: 0, note: "Single bar — water needs a wall on both sides." },
      { args: [[1, 2, 3]], expected: 0, note: "Strictly increasing — every bar's left wall is shorter than itself, so nothing collects." },
      { args: [[4, 4, 4]], expected: 0, note: "Flat profile — equal walls leave no dip to fill." },
      { args: [[3, 0, 2, 0, 4]], expected: 7, note: "A valley between rising walls — the two dips fill to the shorter bounding wall." },
      { args: [[6, 1, 1, 1, 6]], expected: 15, note: "Tall equal ends over a flat trench — each of the three inner bars holds 6 − 1 = 5." },
    ],
  },

  "remove-duplicates-from-sorted-array": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The fast *read* pointer makes a single left-to-right pass over the array, visiting each element once.\n" +
          "- Each step is O(1): one comparison against the last kept value, and at most one write plus a pointer " +
          "bump.\n\n" +
          "There is no nesting and no second pass, so the overall time is **O(n)**, where `n` is the length of " +
          "`nums`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The compaction happens *in place* — distinct values are written back into the front of the same array.\n" +
          "- The only extra storage is the two index variables, the slow *write* pointer and the fast *read* " +
          "pointer.\n\n" +
          "Nothing grows with the input — no `Set`, no copy — so the extra space is constant, **O(1)**. (The " +
          "Set-based brute force builds a whole second array of the uniques, which is O(n).)",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty array — no values, so k = 0 and the prefix is empty." },
      { args: [[9]], expected: [9], note: "Single element — already unique, kept as the only distinct value." },
      { args: [[1, 2, 3, 4]], expected: [1, 2, 3, 4], note: "No duplicates — every element is new, so the prefix is unchanged." },
      { args: [[4, 4, 4, 4]], expected: [4], note: "All equal — every later value is a duplicate of the first, leaving one." },
      { args: [[-3, -3, -1, -1, -1, 6]], expected: [-3, -1, 6], note: "Repeated runs of varying length collapse to one each." },
      { args: [[2, 2, 5, 8, 8]], expected: [2, 5, 8], note: "Duplicates at both ends with a unique value between them." },
    ],
  },

  "longest-consecutive-sequence": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Building the `Set` from the input is one O(n) pass.\n" +
          "- The outer loop visits each distinct value once, doing an O(1) `has(n - 1)` check.\n" +
          "- The inner `while` only runs for *run starts*, and it walks each value of a run at most once across " +
          "the whole algorithm.\n\n" +
          "The nested `while` looks like it could make this O(n²), but the run-start guard means a value is " +
          "touched by an inner walk only when its run is counted, once — so every value is visited at most twice " +
          "total, and the overall time is **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `Set` holds up to one entry per distinct value, so it grows linearly with the input.\n" +
          "- The loop itself uses only a few counters (`longest`, `length`, `current`) — O(1).\n\n" +
          "That set is the price of dropping the time from the sort's O(n log n) to **O(n)**: we spend **O(n)** " +
          "extra space to buy O(1) membership tests.",
      },
    ],
    testCases: [
      { args: [[]], expected: 0, note: "Empty array — no numbers, so the longest run is 0." },
      { args: [[99]], expected: 1, note: "Single element — a run of length 1 with no neighbours." },
      { args: [[5, 5, 5]], expected: 1, note: "All duplicates collapse to one value in the set — run of 1." },
      { args: [[20, 21, 22, 50, 51]], expected: 3, note: "Two separate runs; the longer is {20,21,22}, length 3." },
      { args: [[9, 1, 4, 7, 3, 2, 6, 8, 5]], expected: 9, note: "Shuffled 1..9 — order doesn't matter, the whole set is one run." },
      { args: [[-10, -8, -9, -7, 5]], expected: 4, note: "Negatives — {-10,-9,-8,-7} form a run of 4; 5 is isolated." },
    ],
  },

  "reverse-linked-list": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The loop visits each of the `n` nodes exactly once.\n" +
          "- Per node the work is O(1): save `next`, flip one pointer, advance two variables.\n\n" +
          "There's no nested traversal, so the whole reversal is a single pass — **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only three pointers (`prev`, `curr`, `next`) are kept, regardless of list length.\n" +
          "- The nodes are rewired in place — no new list is allocated.\n\n" +
          "This is the win over the brute force, which built a second list and a values array for **O(n)** space.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty list — nothing to reverse, returns empty." },
      { args: [[1]], expected: [1], note: "Single node is its own reverse." },
      { args: [[1, 2]], expected: [2, 1], note: "Smallest case where pointers actually move." },
      { args: [[7, 7, 7]], expected: [7, 7, 7], note: "All-equal values — reversed list looks identical, but every link was still flipped." },
      { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1], note: "Even length." },
      { args: [[-1, 0, 2]], expected: [2, 0, -1], note: "Negative and zero values reverse like any other." },
    ],
  },

  "remove-nth-node-from-end-of-list": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(L). Here's why:\n\n" +
          "- Advancing `fast` by `n + 1` is at most `L` steps.\n" +
          "- The lockstep walk then covers the remaining nodes — at most `L` more.\n\n" +
          "Both phases are linear and there's no nested loop, so the single pass is **O(L)**, where `L` is the list length. (The two-pass brute force is also O(L), just with two traversals.)",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only the `dummy` node and the `fast`/`slow` pointers are allocated, independent of `L`.\n" +
          "- The list is edited in place by one pointer reassignment.\n\n" +
          "No array or copy of the list is made — **O(1)** auxiliary space.",
      },
    ],
    testCases: [
      { args: [[1], 1], expected: [], note: "Single node, n = 1 — removing it leaves the empty list (the dummy makes this uniform)." },
      { args: [[1, 2], 2], expected: [2], note: "n = length removes the head; returning `dummy.next` handles it." },
      { args: [[1, 2], 1], expected: [1], note: "Remove the last node of a two-node list." },
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5], note: "The worked example — remove the 2nd-from-end (4)." },
      { args: [[2, 2, 2, 2], 2], expected: [2, 2, 2], note: "Duplicate values — removal is by position, not value." },
      { args: [[1, 2, 3], 3], expected: [2, 3], note: "n = length again on an odd list — removes the head." },
    ],
  },

  "palindrome-linked-list": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Finding the midpoint with fast/slow is one pass over `n` nodes.\n" +
          "- Reversing the second half touches each of those nodes once.\n" +
          "- The final lockstep comparison walks the two halves once.\n\n" +
          "Three sequential linear passes is still **O(n)** — no nesting.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The midpoint, reversal, and comparison each use only a handful of pointers.\n" +
          "- The second half is reversed *in place* rather than copied.\n\n" +
          "This is the improvement over the array-dump brute force, which spends **O(n)** on the values array.",
      },
    ],
    testCases: [
      { args: [[1]], expected: true, note: "Single node — trivially a palindrome." },
      { args: [[1, 2]], expected: false, note: "Two distinct values — reversing gives 2 -> 1, which differs." },
      { args: [[1, 1]], expected: true, note: "Two equal values — the smallest even palindrome." },
      { args: [[1, 2, 1]], expected: true, note: "Odd length — the lone middle node never needs to match." },
      { args: [[1, 2, 2, 1]], expected: true, note: "Even-length palindrome — both halves mirror exactly." },
      { args: [[1, 2, 3, 4, 2, 1]], expected: false, note: "Looks symmetric at the ends but breaks in the middle (3 vs 4)." },
    ],
  },

  "intersection-of-two-linked-lists": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m + n). Here's why:\n\n" +
          "- The alignment walk sends each pointer through both lists once — at most `m + n` steps before they meet or both reach the end.\n" +
          "- The array-encoded form resolves the answer in O(1) from `skipA`, but the underlying node-identity algorithm is the linear walk.\n\n" +
          "Either way there's no nested scan, so it's **O(m + n)** — versus the brute force's O(m × n).",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The alignment walk keeps only two pointers; nothing scales with the list sizes.\n" +
          "- A hash-set alternative (store all of A's nodes, scan B) would cost O(m) — the two-pointer walk avoids it.\n\n" +
          "So the optimal approach is **O(1)** auxiliary space.",
      },
    ],
    testCases: [
      { args: [[2, 6, 4], [1, 5], -1, -1], expected: null, note: "No merge point supplied — the lists never intersect." },
      { args: [[1], [1], 0, 0], expected: 1, note: "Smallest intersection — both single-node lists share that node." },
      { args: [[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3], expected: 8, note: "Different lengths before the shared tail [8,4,5] — answer is the first shared value, 8." },
      { args: [[], [1, 2, 3], -1, -1], expected: null, note: "Empty list A can't intersect anything." },
      { args: [[1, 2, 3, 4, 5], [99, 4, 5], 3, 1], expected: 4, note: "Shared tail [4,5] begins at index 3 in A and 1 in B." },
      { args: [[8, 8, 8], [8, 8, 8], 0, 0], expected: 8, note: "Identical lists that merge at the head — duplicate values don't fool the position-based identity." },
    ],
  },
};
