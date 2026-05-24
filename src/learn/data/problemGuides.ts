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
        "The area between two lines is `min(height[left], height[right]) × (right − left)`, capped by the " +
        "**shorter** wall. The brute force tries every pair — O(n²). The insight: start at the widest pair " +
        "(both ends); moving the *taller* wall inward only shrinks the width without lifting the cap, so move " +
        "the **shorter** wall instead, hoping for a taller one.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — check every pair of lines: O(n²).",
      source:
        "function maxArea(height) {\n" +
        "  let best = 0;\n" +
        "  // Try every pair of lines as the container's two walls.\n" +
        "  for (let i = 0; i < height.length; i++) {\n" +
        "    for (let j = i + 1; j < height.length; j++) {\n" +
        "      // Water is capped by the shorter wall, spread over the width between them.\n" +
        "      const area = Math.min(height[i], height[j]) * (j - i);\n" +
        "      best = Math.max(best, area);\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "walkthrough",
      heading: "height = [1, 8, 6, 2, 5, 7] — the two-pointer idea",
      lane: [1, 8, 6, 2, 5, 7],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 5 }],
          action: "min(1,7)·5 = 5 → left++",
          caption: "Widest pair; the left wall (1) caps the area, so move it in.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 5 }],
          action: "min(8,7)·4 = 28 → right--",
          caption: "best = 28. Now the right wall (7) is the shorter one.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 2 }],
          action: "min(8,6)·1 = 6 → pointers meet",
          caption: "Nothing left can beat 28. Answer: 28.",
        },
      ],
    },
  ],

  "valid-palindrome": [
    {
      kind: "prose",
      body:
        "The simplest approach builds a cleaned, lowercased copy and compares it to its reverse — correct, but " +
        "O(n) extra space. The optimization keeps two pointers at the ends and walks inward in place: skip any " +
        "non-alphanumeric character, then compare the two ends case-insensitively. O(1) space.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — clean the string and compare to its reverse: O(n) time, O(n) space.",
      source:
        "function isPalindrome(s) {\n" +
        "  // Keep only letters and digits, all lower-cased.\n" +
        '  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n' +
        "  // A palindrome reads the same forwards and backwards.\n" +
        '  return cleaned === [...cleaned].reverse().join("");\n' +
        "}",
    },
    {
      kind: "walkthrough",
      heading: 's = "A b a." — the in-place two-pointer idea',
      lane: ["A", " ", "b", "a", "."],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 4 }],
          action: "'.' not alphanumeric → right--",
          caption: "Skip non-alphanumeric characters from the right.",
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 3 }],
          action: "'A' == 'a' → move both in",
          caption: "Lowercased ends match.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 2 }],
          action: "' ' not alphanumeric → left++",
          caption: "Skip the space.",
        },
        {
          pointers: [{ name: "left", at: 2 }, { name: "right", at: 2 }],
          action: "left ≥ right → palindrome",
          caption: "Pointers met with every pair matched → true.",
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

  "3sum-closest": [
    {
      kind: "prose",
      body:
        "The brute force tries every triple and tracks the closest sum — O(n³). The optimization is the 3Sum " +
        "shape: sort, fix one number, two-pointer the rest, but instead of an exact match you keep the sum whose " +
        "distance to `target` is smallest. Move `left` up when the sum is below target, `right` down when above. O(n²).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every triple, track the closest: O(n³).",
      source:
        "function threeSumClosest(nums, target) {\n" +
        "  // Seed the answer with any triple's sum.\n" +
        "  let best = nums[0] + nums[1] + nums[2];\n" +
        "  // Check every distinct triple.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        const sum = nums[i] + nums[j] + nums[k];\n" +
        "        // Keep whichever sum lands nearest the target.\n" +
        "        if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "walkthrough",
      heading: "sorted: [-4, -1, 1, 2] · target = 1",
      lane: [-4, -1, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 1 }, { name: "R", at: 3 }],
          action: "sum -3, dist 4 → -3 < 1, L++",
          caption: "Closest so far: -3.",
        },
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 2 }, { name: "R", at: 3 }],
          action: "sum -1, dist 2 → -1 < 1, L++",
          caption: "Closer: -1.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 3 }],
          action: "sum 2, dist 1 → best",
          caption: "Next pivot: [-1, 1, 2] sums to 2 — distance 1. Answer: 2.",
        },
      ],
    },
  ],

  "trapping-rain-water": [
    {
      kind: "prose",
      body:
        "Water above a bar is `min(tallestLeft, tallestRight) − height`. The brute force recomputes those two " +
        "maxima for every bar — O(n²). The optimization walks two pointers inward and always moves the side with " +
        "the **shorter** wall: that wall is the binding constraint, so a single running max per side suffices. O(n), O(1) space.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each bar, scan both sides for the tallest walls: O(n²).",
      source:
        "function trap(height) {\n" +
        "  let water = 0;\n" +
        "  // Water above each bar is bounded by the shorter of its two tallest walls.\n" +
        "  for (let i = 0; i < height.length; i++) {\n" +
        "    let left = 0, right = 0;\n" +
        "    // Tallest wall to the left of (and including) bar i.\n" +
        "    for (let j = 0; j <= i; j++) left = Math.max(left, height[j]);\n" +
        "    // Tallest wall to the right of (and including) bar i.\n" +
        "    for (let j = i; j < height.length; j++) right = Math.max(right, height[j]);\n" +
        "    // The lower wall sets the level; subtract the bar's own height.\n" +
        "    water += Math.min(left, right) - height[i];\n" +
        "  }\n" +
        "  return water;\n" +
        "}",
    },
    {
      kind: "walkthrough",
      heading: "height = [4, 2, 0, 3, 2, 5] — the two-pointer idea",
      lane: [4, 2, 0, 3, 2, 5],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "L", at: 0 }, { name: "R", at: 5 }],
          action: "4 < 5 · Lmax 4 → +0",
          caption: "Left wall is shorter and caps the left side. Nothing over a 4 when Lmax is 4.",
        },
        {
          pointers: [{ name: "L", at: 1 }, { name: "R", at: 5 }],
          action: "2 < 5 · Lmax 4 → +2",
          caption: "Add 4 − 2. Total 2.",
        },
        {
          pointers: [{ name: "L", at: 2 }, { name: "R", at: 5 }],
          action: "0 < 5 · Lmax 4 → +4",
          caption: "Add 4 − 0. Total 6.",
        },
        {
          pointers: [{ name: "L", at: 3 }, { name: "R", at: 5 }],
          action: "3 < 5 · Lmax 4 → +1",
          caption: "Add 4 − 3. Total 7.",
        },
        {
          pointers: [{ name: "L", at: 4 }, { name: "R", at: 5 }],
          action: "2 < 5 · Lmax 4 → +2",
          caption: "Add 4 − 2. Total 9 — the answer.",
        },
      ],
    },
  ],

  "remove-duplicates-from-sorted-array": [
    {
      kind: "prose",
      body:
        "Collecting the distinct values in a `Set` and copying them back is correct but uses O(n) extra space. " +
        "Because the array is **sorted**, duplicates are adjacent, so the optimization works in place with two " +
        "same-direction pointers: a slow *write* pointer marking the end of the unique prefix, and a fast *read* " +
        "pointer scanning ahead. The unique count is `slow + 1`. O(1) space.",
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
      kind: "walkthrough",
      heading: "nums = [0, 0, 1, 1, 2] · highlighted = unique prefix",
      lane: [0, 0, 1, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 1 }],
          range: [0, 0],
          action: "nums[fast] == kept → fast++",
          caption: "Duplicate — skip it.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 2 }],
          range: [0, 1],
          action: "nums[fast] ≠ kept → write nums[++slow] = 1",
          caption: "New value: extend the unique prefix.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 3 }],
          range: [0, 1],
          action: "nums[fast] == kept → fast++",
          caption: "Duplicate — skip.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: 4 }],
          range: [0, 2],
          action: "nums[fast] ≠ kept → write nums[++slow] = 2",
          caption: "k = slow + 1 = 3 → [0, 1, 2].",
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
};

/**
 * A row in a problem's "Test cases" table — an edge case worth thinking through, *not* a hidden judge test.
 * Stored as runnable `args`/`expected` (same shape the judge uses) so the auditor agent can execute each case
 * through the worker; the table's Input / Expected columns are *derived* from these, matching the Example
 * section's formatting. `args` is the argument tuple in call order; `expected` is the reference return.
 */
export type GuideTestCase = { args: unknown[]; expected: unknown; note: string };

/**
 * Post-optimization teaching content, shown *after* the Optimization section: a complexity write-up and a
 * table of edge cases worth considering. Authored (the test cases are deliberately not the real hidden tests,
 * so the page can't be used to game the judge). Keyed by problem id, same enrichment posture as PROBLEM_GUIDES.
 */
export const PROBLEM_EXTRAS: Record<string, { complexity?: Section[]; testCases?: GuideTestCase[] }> = {
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
};
