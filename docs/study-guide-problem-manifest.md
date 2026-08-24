# ByteByteGo problem manifest (Study Guide section-builder cache)

**Purpose.** This is a **cache for the `study-guide-section-builder` workflow** (see [docs/features/study-guide-authoring.md](features/study-guide-authoring.md) → Step 1). When building a chapter, the section-builder can read the relevant chapter table here instead of re-sourcing the problem list from the web. Treat the mappings as **moderate confidence** — the BBG names are authoritative (sourced from the repo tree), but the LeetCode/bank mapping is a judgement call and is annotated per row.

**Sources (authoritative for the BBG problem names):**
- BBG "Coding Interview Patterns" repo, per-chapter directories — [github.com/ByteByteGoHq/coding-interview-patterns](https://github.com/ByteByteGoHq/coding-interview-patterns) (the chapter→problem lists below are the deduped `python3/<Chapter>/` filenames; `_brute_force` / `_optimized` / `_naive` / `_iterative` / `_recursive` / `_dp` suffixes are alternate solutions of the *same* problem, collapsed into one row).
- Book landing / TOC — [bytebytego.com/exercises/coding-patterns](https://bytebytego.com/exercises/coding-patterns), [Amazon listing](https://www.amazon.com/Coding-Interview-Patterns-Nail-Your/dp/1736049135).

**Chapter → topic-slug map (algos track, curriculum order):**

| BBG chapter | topic slug | built? |
| --- | --- | --- |
| Two Pointers | `two-pointers` | yes |
| Hash Maps and Sets | `hash-maps` | yes |
| Linked Lists | `linked-lists` | yes |
| (Fast and Slow Pointers) | folded into `linked-lists` | yes |
| Sliding Windows | `sliding-window` | yes |
| Binary Search | `binary-search` | yes |
| Stacks | `stacks` | yes |
| Heaps | `heaps` | yes |
| Intervals | `intervals` | yes |
| Prefix Sums | `prefix-sum` | yes |
| Trees | `trees` | yes |
| Tries | `tries` | yes |
| Graphs | `graphs` | yes |
| Backtracking | `backtracking` | yes |
| Dynamic Programming | `dynamic-programming` | yes |
| Greedy | `greedy` | yes |
| Sort and Search | `sorting` | yes |
| Bit Manipulation | `bit-manipulation` | yes |
| Math and Geometry | `math` | yes |

Per-chapter problem counts (deduped BBG problems): Intervals 3 · Prefix Sums 4 · Trees 14 · Tries 3 · Graphs 11 · Backtracking 5 · Dynamic Programming 9 BBG + 1 non-BBG extra (10 built) · Greedy 3 (confirmed) · Sort and Search 4 (confirmed) · Bit Manipulation 3 (confirmed) · Math and Geometry 5 (confirmed).

> Column legend — **In bank already?** is true iff the *suggested* bank id already exists as a key in `src/problems/data/problems/index.ts`. "off-catalog" = a BBG-original problem with no clean public LeetCode twin (lower mapping confidence; import from a self-contained spec). "sandbox concern" flags problems whose I/O shape (streaming, design/class, randomized, graph-build) may be awkward for the judge harness.

---

## Intervals (3)

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Merge Overlapping Intervals | `merge-intervals` | yes | high | LC 56 Merge Intervals. Reference sort-then-sweep. |
| Identify All Interval Overlaps | `interval-intersections` | no | high | LC 986 Interval List Intersections — two sorted interval lists, two-pointer sweep emitting overlaps. Off-LC-id naming but a standard problem. Import. |
| Largest Overlap of Intervals | `max-overlapping-intervals` | no | high | "Max concurrent intervals" / sweep-line (a.k.a. Meeting Rooms II count, LC 253-style). Return the max number of intervals overlapping at any point. Sort starts & ends, sweep. Import (off-catalog naming, standard sweep-line). |

*Note:* `insert-interval` (LC 57) already exists in the bank but is **not** a BBG Intervals-chapter problem — leave it out of the chapter unless padding is wanted.

---

## Prefix Sums (4)

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Sum Between Range | `range-sum-query-immutable` | yes | high | LC 303 Range Sum Query – Immutable. No design/class harness in this sandbox, so **reframed as a batch function** `rangeSum(nums, queries)` → one sum per `[i, j]` query (the manifest's suggested reframe). Imported #126. |
| K Sum Subarrays | `subarray-sum-equals-k` | yes | high | LC 560 Subarray Sum Equals K. Prefix-sum + hash map. Clean function import #127. |
| Product Array Without Current Element | `product-of-array-except-self` | yes | high | LC 238 Product of Array Except Self. Clean import #128. |
| (continuous range / 2D variant) | `range-sum-query-2d-immutable` | yes | low | **Resolved (2026-05):** the 4th BBG row could not be pinned to a *distinct* BBG problem — it collapses to a variant of the 1D Range Sum Query in the repo. Rather than invent a problem, included LC 304 Range Sum Query 2D – Immutable as a real, pattern-faithful 4th member (it teaches the 2D prefix-sum extension the topic's `definition` already names). **Same design→batch-function reframe** as row 1: `rangeSum2D(matrix, queries)` → one sum per `[r1,c1,r2,c2]` rectangle. Imported #129. BBG-distinctness remains unconfirmed; kept on pattern-coverage grounds, not as a verified BBG match. |

---

## Trees (14)

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Invert Binary Tree | `invert-binary-tree` | no | high | LC 226. Tree reference type. |
| Balanced Binary Tree Validation | `balanced-binary-tree` | no | high | LC 110. |
| Binary Tree Symmetry | `symmetric-tree` | no | high | LC 101. |
| Binary Tree Columns | `binary-tree-vertical-order-traversal` | no | mid | LC 314 (premium). Group nodes by column index. |
| Build Binary Tree | `construct-binary-tree-from-preorder-and-inorder-traversal` | no | high | LC 105. |
| Binary Search Tree Validation | `validate-binary-search-tree` | yes | high | LC 98 — already in bank. |
| Kth Smallest Number in BST | `kth-smallest-element-in-a-bst` | no | high | LC 230. |
| Lowest Common Ancestor | `lowest-common-ancestor-of-a-binary-tree` | no | high | LC 236. |
| Maximum Path Sum | `binary-tree-maximum-path-sum` | no | high | LC 124. |
| Rightmost Nodes of a Binary Tree | `binary-tree-right-side-view` | no | high | LC 199. |
| Widest Binary Tree Level | `maximum-width-of-binary-tree` | no | high | LC 662. |
| Serialize and Deserialize a Binary Tree | `serialize-and-deserialize-binary-tree` | no | high | LC 297. **Two-method / codec** shape — sandbox concern (round-trip via two functions). |
| (Tree traversal foundation) | `binary-tree-inorder-traversal` | yes | high | LC 94 — already in bank; chapter foundation. |
| (Tree-of-the-chapter extra) | `same-tree` | yes | low | **Resolved (2026-05):** could not pin a *distinct* 14th BBG problem — the surplus repo files are iterative/recursive variants of Invert and Kth-Smallest, already collapsed into their rows above. Rather than fabricate a BBG match, included LC 100 Same Tree (already in the bank) as a genuine on-pattern 14th member: it's the canonical recursive two-tree structural-comparison problem and the natural pair to Symmetric Tree (which is "is this tree a mirror of itself"). **Kept on pattern-coverage grounds, not as a verified BBG match** — BBG-distinctness unconfirmed. No import needed. |

*Sandbox note:* all Tree problems require the binary-tree reference-type harness (documented in problem-authoring.md). Confirm tree I/O is supported before importing the batch.

---

## Tries (3)

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Design a Trie | `implement-trie-prefix-tree` | no | high | LC 208. **Design/class** shape — sandbox concern (multi-method `insert`/`search`/`startsWith`). |
| Insert and Search Words with Wildcards | `design-add-and-search-words-data-structure` | no | high | LC 211. Design/class + wildcard DFS. Sandbox concern. |
| Find All Words on a Board | `word-search-ii` | no | high | LC 212. Trie + grid backtracking. Clean function shape (board + words → found words). |

---

## Graphs (11)

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Graph Deep Copy | `clone-graph` | **yes (#144)** | high | LC 133. Imported with the new `"graph"` `IoShape` (adjacency-list ↔ cyclic `GraphNode`, added to the io harness 2026-06). **Structure-only grading caveat** stated in the prompt: serialization erases object identity, so the tests verify the clone's shape but can't catch a solution returning the original graph. A bespoke identity `checker` is the documented follow-up. |
| Count Islands | `number-of-islands` | no | high | LC 200. Grid DFS/BFS. Clean. |
| Matrix Infection | `rotting-oranges` | no | high | LC 994. Multi-source BFS over grid. Clean. |
| Bipartite Graph Validation | `is-graph-bipartite` | no | high | LC 785. Adjacency-list input. |
| Longest Increasing Path | `longest-increasing-path-in-a-matrix` | no | high | LC 329. Grid DFS + memo. |
| Shortest Transformation Sequence | `word-ladder` | no | high | LC 127. BFS over word graph. |
| Merging Communities | `number-of-provinces` | yes | high | LC 547 — already in bank (union-find). |
| Prerequisites | `course-schedule` | no | high | LC 207. Topological sort / cycle detection. |
| Shortest Path | `network-delay-time` | no | mid | LC 743 Dijkstra — or a generic weighted shortest-path; verify the exact framing. Sandbox concern: weighted-edge input shape. |
| Connect the Dots | `min-cost-to-connect-all-points` | no | mid | LC 1584 (MST / Prim). Sandbox concern: returns total cost. |
| (Graph foundation extra) | — | — | low | 11 repo files; confirm the 11th distinct problem against the book. |

*Sandbox note:* `clone-graph` needs a graph reference-type harness; confirm support before importing. Grid-based ones (islands, oranges, longest-path) are plain matrix functions and are the safest to start with.

---

## Backtracking (5)

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Find All Permutations | `permutations` | yes | high | LC 46 — already in bank. |
| Find All Subsets | `subsets` | yes | high | LC 78 — already in bank. |
| Combinations of Sum K | `combination-sum` | yes | high | LC 39 — already in bank (BBG uses a target-sum combinations framing). |
| Phone Keypad Combinations | `letter-combinations-of-a-phone-number` | yes | high | LC 17 — already in bank. |
| N Queens | `n-queens` | yes | high | LC 51 — already in bank. |

*Note:* this chapter is **fully covered by existing bank problems** — no imports needed, just intro + guide pages.

---

## Dynamic Programming (10 — built)

**Resolved (2026-08):** the original 11-row estimate below was wrong on two counts, corrected by directly re-fetching `python3/Dynamic Programming/` from the BBG repo during the build. The BBG chapter has **9 distinct problems**, not 11 — the manifest's 11th-row padding never existed. `edit-distance` is **not** a BBG Dynamic Programming chapter file at all (contradicts this row's original "high confidence"); it was kept anyway as a documented non-BBG pattern-coverage addition (same precedent as Trees' `same-tree` and Prefix Sums' 2D range-sum), giving **10 built pages** total. The 0/1 Knapsack row's LC 416 suggestion was also dropped — BBG's `knapsack.py` is a generic value-maximization knapsack, not LC 416's subset-sum framing — and imported as a faithful off-catalog `knapsack(cap, weights, values)` instead.

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Climbing Stairs | `climbing-stairs` | yes | high | LC 70 — already in bank. |
| Min Coin Combination | `coin-change` | **imported #153** | high | LC 322. Unbounded knapsack DP. |
| Matrix Pathways | `unique-paths` | yes | high | LC 62 — already in bank. |
| Neighborhood Burglary | `house-robber` | **imported #154** | high | LC 198. |
| Longest Common Subsequence | `longest-common-subsequence` | **imported #155** | high | LC 1143. 2D DP. |
| Longest Palindrome in a String | `longest-palindromic-substring` | yes | high | LC 5 — already in bank. |
| Maximum Subarray Sum | `maximum-subarray` | yes | high | LC 53 — already in bank (Kadane). |
| 0/1 Knapsack | `knapsack` (off-catalog) | **imported #157** | high | BBG's generic `(cap, weights, values)` knapsack, ported faithfully — not LC 416. |
| Largest Square in a Matrix | `maximal-square` | **imported #156** | high | LC 221. 2D DP over grid. |
| *(non-BBG pattern-coverage extra)* | `edit-distance` | yes | — | LC 72 — already in bank. **Not a confirmed BBG DP-chapter file**; kept as a genuinely distinct alignment-DP recurrence (3-way min + replace vs. LCS's 2-way max), flagged honestly rather than presented as a verified BBG match. |

---

## Greedy (3 — built)

**Resolved (2026-08):** re-fetched `python3/Greedy/` directly from the BBG repo tree during the build (per-file check, not the manifest estimate). The directory contains exactly **3 files** — `jump_to_the_end.py`, `gas_stations.py`, `candies.py` — no hidden 4th problem, no `_brute_force`/`_optimized` variants to collapse. The original 3-row estimate below was **correct**, and the LC mappings were verified against the actual BBG source (read, not guessed): `jump_to_the_end` reverse-greedy-reachability is exactly LC 55 Jump Game; `gas_stations` is LC 134's start-index/tank-reset greedy; `candies` is LC 135's two-pass (left-to-right, then right-to-left) greedy. All three imported/confirmed at **high** confidence — no corrections needed to this chapter's row.

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Jump to the End | `jump-game` | yes | high | LC 55 — already in bank. |
| Gas Stations | `gas-station` | **imported #158** | high | LC 134. Start-index reset + running-tank greedy; -1 if total gas < total cost. |
| Candies | `candy` | **imported #159** | high | LC 135. Two-pass greedy (left-to-right "greater than left neighbor", then right-to-left "greater than right neighbor", taking the max). |

---

## Sort and Search (4 — confirmed)

**Resolved (2026-08):** re-fetched `python3/Sort and Search/` directly from the BBG repo tree (GitHub API directory listing, not the manifest estimate) during the build. The directory contains exactly **7 files**, but they collapse to **4 distinct problems** — the original 7-row estimate below double-counted every multi-solution problem as a separate row:

- `sort_array_counting_sort.py`, `sort_array_quicksort.py`, `sort_array_quicksort_optimized.py` — three solutions (counting sort, quicksort, randomized-pivot quicksort) of **one** problem, `sort_array(nums)` → sort an integer array. This is LC 912 Sort an Array, **not** LC 75 — the original manifest's "Counting Sort" row wrongly mapped this BBG problem to `sort-colors`. Corrected to `sort-an-array`.
- `dutch_national_flag.py` — one problem, in-place 3-way partition on a `{0,1,2}` array. This **is** the genuine LC 75 Sort Colors match.
- `kth_largest_integer_min_heap.py`, `kth_largest_integer_quickselect.py` — two solutions of one problem, `kth_largest_integer(nums, k)` → LC 215.
- `sort_linked_list.py` — one problem, merge sort on a linked list → LC 148.

So the chapter is genuinely **4 problems**, confirmed by reading file contents (not just filenames) to verify which files share a function/problem identity.

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Sort Array (counting sort / quicksort / optimized quicksort) | `sort-an-array` | no | high | LC 912. Three BBG solution files, one problem. Corrected from the original manifest, which wrongly split this into a separate "Counting Sort" row mapped to `sort-colors`. |
| Dutch National Flag | `sort-colors` | yes | high | LC 75 — already in bank (in-place 3-way partition). |
| Kth Largest Integer (min-heap / quickselect) | `kth-largest-element-in-an-array` | no | high | LC 215. Two BBG solution files, one problem. |
| Sort a Linked List | `sort-list` | no | high | LC 148. Merge sort on a list. Linked-list reference type. |

---

## Bit Manipulation (3 — confirmed)

**Resolved (2026-08):** re-fetched `python3/Bit Manipulation/` directly from the BBG repo tree (GitHub API directory listing + file contents, not the manifest estimate) during the build. The directory contains exactly **4 files** collapsing to **3 distinct problems** — `hamming_weights_of_integers.py` and `hamming_weights_of_integers_dp.py` are two solutions (linear count-bits loop, and an O(n) DP-over-all-integers-up-to-n build) of **one** problem. The original manifest's 4-row estimate, including "Reverse Bits", was wrong: `reverse_32_bit_integer.py` **lives in `python3/Math and Geometry/`, not `python3/Bit Manipulation/`** — confirmed by directory listing. It is **not** a Bit Manipulation-chapter member and was correctly excluded from this chapter (it's already tracked as a Math and Geometry row via `reverse-integer`, LC 7, already in the bank — note that's *reverse the integer's value*, not *reverse its bits*; LC 190 Reverse Bits is not a BBG chapter file in either directory and is out of scope for this build).

Read each file's contents (not just filenames) to confirm the exact function signature BBG uses:

- `hamming_weights_of_integers(n) -> List[int]` — returns the set-bit count for every integer `0..n` (an array result, not a single count). This is exactly **LC 338 Counting Bits**, confirming the manifest's original `counting-bits` mapping — not LC 191 (single-int `number-of-1-bits`), which was only offered as a "simpler twin," not the actual BBG signature.
- `lonely_integer(nums) -> int` — XOR fold over an int array. Exactly **LC 136 Single Number**, confirming `single-number`.
- `swap_odd_and_even_bits(n) -> int` — mask (`0x55555555`/`0xAAAAAAAA`) + shift + OR on a 32-bit int. Off-catalog (no standard LC id), confirming `swap-odd-even-bits` as a faithful off-catalog import.

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Hamming Weights of Integers (loop / DP) | `counting-bits` | no | high | LC 338. Two BBG solution files, one problem — `hamming_weights_of_integers(n)` returns `List[int]` of set-bit counts for `0..n`. |
| Lonely Integer | `single-number` | no | high | LC 136. XOR fold, `lonely_integer(nums) -> int`. |
| Swap Odd and Even Bits | `swap-odd-even-bits` | no | high | Off-catalog (no standard LC id) but the BBG source was read directly — faithful spec: `swap_odd_and_even_bits(n) -> int`, mask odd/even bits, shift each toward the other, OR merge. |

*Confirmed exclusion:* "Reverse Bits" / `reverse_32_bit_integer.py` is a **Math and Geometry** chapter file, not Bit Manipulation — do not pull it into this chapter.

---

## Math and Geometry (5 — confirmed)

**Resolved (2026-08):** re-fetched `python3/Math and Geometry/` directly from the BBG repo tree (GitHub API directory listing + file contents) during the build, and cross-checked lesson numbering against the book's own table of contents (an offline mirror of the "Coding Interview Patterns" practice site lists all 120 lessons by number/title — chapter 19 "Math and Geometry" is lessons 115–120: one intro + **5** problems, not 6). The original 6-row estimate was wrong on two counts:

- The directory has 6 files, but `josephus.py` (recursive) and `josephus_optimized.py` (iterative O(n)) are two solutions of **one** problem — same collapsing pattern as every other chapter. So 6 files → 5 distinct problems, matching the book's own lesson count exactly. There is no "unconfirmed 6th member" — the row was padding.
- **"Triangle Numbers" is *not* LC 611 Valid Triangle Number.** Reading `triangle_numbers.py` shows a 3-line closed-form `n → {2,3,4}` function that doesn't match LC 611's signature (a triple-counting problem) at all. Reverse-engineered against a HackerRank problem of the same name and mechanics (found via web search, then independently verified by simulation for n=3..200 with zero mismatches): it's a **trinomial-triangle parity puzzle** — row 1 is the single vertex `[1]`; each further row is built by summing, for every position, the value directly above plus its two upper diagonal neighbors (missing neighbors = 0), so row `n` has `2n-1` entries; given `n`, return the 1-indexed position (from the left) of the first even number in that row, or `-1` if the row has none (true only for n=1, n=2 — every row n≥3 has one). BBG's O(1) formula (`n%2!=0→2`; `n%4==0→3`; else→4) is a closed-form shortcut for this, valid for n≥3. Off-catalog, no LC twin; imported from this self-derived spec, not scraped verbatim from either source.
- `reverse_32_bit_integer.py`'s presence here (not in Bit Manipulation) was already confirmed during the Bit Manipulation chapter build — re-confirmed here: it's LC 7 Reverse Integer (value reversal, not bit reversal), already in the bank as `reverse-integer`.

| BBG problem name | Suggested bank id/slug | In bank already? | Mapping confidence | Notes |
| --- | --- | --- | --- | --- |
| Spiral Traversal | `spiral-matrix` | yes | high | LC 54 — already in bank. |
| Reverse 32-Bit Integer | `reverse-integer` | yes | high | LC 7 — already in bank. Reverses the integer's *value* (with INT32 overflow → 0), not its bits — not LC 190. |
| Maximum Collinear Points | `max-points-on-a-line` | no | high | LC 149. Slope-counting via hash map, focal-point technique; slope stored as a reduced `(rise, run)` integer pair (via GCD) to avoid float-precision collisions — read directly from BBG source. |
| The Josephus Problem | `josephus-problem` | no | high | Off-catalog (no single LC id; LC 1823 "Find the Winner of the Circular Game" is a close cousin but distinct framing). Two BBG solution files (recursive `O(n)` recurrence `f(n,k) = (f(n-1,k)+k) % n`, and its iterative unwind) collapse to one problem: `josephus(n, k) -> int`. |
| Triangle Numbers | `triangle-numbers` (off-catalog) | no | high (definition reverse-engineered + independently verified, see above) | Not LC 611. Trinomial-triangle first-even-position puzzle; `triangleNumbers(n) -> int`, 1-indexed position or `-1`. |

---

*Last sourced: 2026-08 (Math and Geometry re-verified against the BBG repo tree + book TOC). Re-source if the BBG repo restructures its chapter directories.*
