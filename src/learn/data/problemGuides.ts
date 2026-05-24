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
};
