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
        "Checking every substring for uniqueness is O(n³). The optimization slides a window holding only distinct " +
        "characters: extend `right` to grow it; the moment the new character is already inside, advance `left` " +
        "(dropping characters) until the duplicate is gone. Each index enters and leaves once → O(n).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring for uniqueness: O(n³).",
      source:
        "function lengthOfLongestSubstring(s) {\n" +
        "  // A substring has no repeat when its Set of chars is as big as the substring.\n" +
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
      kind: "walkthrough",
      heading: 's = "abcabcbb" — the sliding-window idea',
      lane: ["a", "b", "c", "a", "b", "c", "b", "b"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "L", at: 0 }, { name: "R", at: 2 }],
          range: [0, 2],
          action: "best = 3",
          caption: 'Window "abc" — all distinct.',
        },
        {
          pointers: [{ name: "L", at: 1 }, { name: "R", at: 3 }],
          range: [1, 3],
          marked: [0],
          action: '"a" repeats → left++',
          caption: 'The new "a" duplicates index 0; drop from the left.',
        },
        {
          pointers: [{ name: "L", at: 2 }, { name: "R", at: 4 }],
          range: [2, 4],
          marked: [0, 1],
          action: '"b" repeats → left++',
          caption: 'Window "cab" stays width 3; best is still 3.',
        },
        {
          pointers: [{ name: "L", at: 7 }, { name: "R", at: 7 }],
          range: [7, 7],
          marked: [0, 1, 2, 3, 4, 5, 6],
          action: '"b" repeats → shrink',
          caption: "The trailing run of b's collapses the window. Final best = 3.",
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
};
