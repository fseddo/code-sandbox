import type { LearnTopic } from "@/learn/data/topic";

export const bitManipulation = {
  slug: "bit-manipulation",
  title: "Bit manipulation",
  category: "algorithms",
  summary: "Operate on binary directly with AND/OR/XOR/shifts — XOR cancels, masks encode small sets, and O(1)-space tricks replace O(n) structures.",
  tags: ["bit-manipulation"],
  priority: "mid",
  estimatedMinutes: 50,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Bit manipulation works on a number's binary representation directly, using AND (`&`), OR (`|`), XOR " +
          "(`^`), NOT (`~`), and shifts (`<<`, `>>`, `>>>`) instead of arithmetic or comparisons. A handful of " +
          "identities cover almost every interview problem in this chapter: **`x & (x - 1)` clears the lowest set " +
          "bit** (subtracting 1 flips every trailing zero to a 1 and the lowest 1 to a 0, so ANDing with the " +
          "original erases just that one bit); **XOR cancels equal values** (`x ^ x = 0`, `x ^ 0 = x`), which is " +
          "why folding an array through XOR isolates whatever doesn't have a pair; and **a bitmask packs up to " +
          "~32 booleans into one integer**, turning set-membership tests, unions, and intersections into O(1) " +
          "integer ops instead of an O(n) structure walk.\n\n" +
          "Every operator here works one bit position at a time, independent of the others — that's what makes " +
          "these tricks O(1) (or O(number of bits)) instead of O(n): there's no comparison, no branching per " +
          "element, just a fixed-width word processed all at once by the CPU.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for bit tricks on: **XOR/cancellation problems** (\"every element appears twice except one\"), " +
          "**subset or state enumeration** (iterating every combination of a small fixed set, or packing visited-" +
          "state into a DP key), and **space-tight flag sets** where a hash set or boolean array would work but a " +
          "single integer is faster and uses O(1) space instead of O(n). The recognition cue in the prompt is " +
          "often explicit — *\"every element appears twice except one\"*, *\"without using extra memory\"*, *\"set/" +
          "get/clear the ith bit\"*, *\"binary representation\"* — or implicit, when the input's universe is small " +
          "enough (≤ 32 elements) that a bitmask beats a `Set`.\n\n" +
          "**JavaScript's bitwise gotcha:** every bitwise operator coerces its operands to **signed 32-bit** " +
          "integers first. A value with bit 31 set (anything `>= 2^31`) reads as *negative* mid-computation even " +
          "though the problem means it as unsigned — `1 << 31` is `-2147483648`, not `2147483648`. The fix is " +
          "`>>> 0` (unsigned right-shift by zero), which reinterprets the same 32 bits as unsigned without " +
          "changing any of them. Forgetting this is the single most common bug in this chapter's problems.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**XOR fold** — combine every element of an array with XOR in one pass. Order doesn't matter (XOR is " +
          "commutative and associative), and any value appearing an even number of times cancels itself out " +
          "(`x ^ x = 0`), leaving only whatever appears an odd number of times. O(n) time, O(1) space — no hash " +
          "map needed.\n\n" +
          "**Bit masking (test / set / clear / toggle)** — `x & (1 << i)` tests bit `i`, `x | (1 << i)` sets it, " +
          "`x & ~(1 << i)` clears it, `x ^ (1 << i)` toggles it. A mask built this way turns a small set into one " +
          "integer, so membership, union (`|`), intersection (`&`), and difference (`& ~`) all become O(1) " +
          "integer ops.\n\n" +
          "**Brian Kernighan's bit count** — repeatedly apply `x &= (x - 1)` to clear the lowest set bit and " +
          "count how many clears it takes to reach zero. Runs in O(popcount(x)) — proportional to the number of " +
          "*set* bits, not the word's full bit width — which beats shifting through all 32 positions when `x` is " +
          "sparse.\n\n" +
          "**Subset / bitmask-state enumeration** — loop `mask` from `0` to `2^n - 1` to visit every subset of an " +
          "`n`-element set (`mask`'s bit `i` says whether element `i` is included), or use a mask as a compact DP " +
          "state key (\"which of these `n` items have I already used\") — the backbone of bitmask DP.\n\n" +
          "**Shift-and-merge (bit reordering)** — mask apart two interleaved groups of bits (even/odd positions, " +
          "byte groups), shift each group toward the other's original position, then OR the shifted groups back " +
          "together. This is how bit-reversal and swap-adjacent-bits problems work: isolate, shift, recombine.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Relation to hash maps and math",
        body:
          "A bitmask is [[hash-maps]]'s space-tight cousin for **small, fixed universes**: when there are at most " +
          "~32 possible elements, a single integer answers \"is this in the set?\", \"union these two sets\", and " +
          "\"intersect these two sets\" in O(1), where a `Set`/`Map` would need O(n) memory and per-element hashing " +
          "overhead. The trade only pays off below that ~32–64 element ceiling — past it, a hash structure (or a " +
          "`BigInt`-backed mask) takes back over.\n\n" +
          "The XOR-cancellation and shift identities in this chapter are really just [[math]]'s modular-arithmetic " +
          "toolkit specialized to base 2 — `x & (x - 1)` is a base-2 digit trick the same way \"drop the last " +
          "digit\" (`x = Math.floor(x / 10)`) is a base-10 one.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The reusable bit-op toolkit most problems in this chapter compose from.",
        source:
          "// Test / set / clear / toggle a single bit at position i (0 = least significant).\n" +
          "const testBit = (x, i) => (x & (1 << i)) !== 0;\n" +
          "const setBit = (x, i) => x | (1 << i);\n" +
          "const clearBit = (x, i) => x & ~(1 << i);\n" +
          "const toggleBit = (x, i) => x ^ (1 << i);\n" +
          "\n" +
          "// Brian Kernighan's popcount — one iteration per SET bit, not per bit position.\n" +
          "function countSetBits(x) {\n" +
          "  let count = 0;\n" +
          "  while (x !== 0) {\n" +
          "    x &= x - 1; // clear the lowest set bit\n" +
          "    count++;\n" +
          "  }\n" +
          "  return count;\n" +
          "}\n" +
          "\n" +
          "// Reinterpret a signed-32-bit result as unsigned — use whenever bit 31 might be set.\n" +
          "const toUnsigned32 = (x) => x >>> 0;",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Counting set bits with Brian Kernighan's trick** — the cleanest illustration of `x & (x - 1)`. " +
          "Subtracting 1 from `x` flips every trailing zero bit to a 1 and flips the lowest *set* bit to a 0; " +
          "ANDing that back against the original `x` keeps every bit unchanged except that lowest set bit, which " +
          "vanishes. Repeating this until `x` hits zero counts exactly as many iterations as `x` has set bits — " +
          "no need to shift through all 32 positions. Take `x = 13` (binary `1101`, three set bits).",
      },
      {
        kind: "walkthrough",
        heading: "x = 13 (0b1101) — clearing the lowest set bit each step",
        lane: [13, 12, 8, 0],
        frames: [
          {
            pointers: [{ name: "x", at: 0 }],
            action: "x = 13 (0b1101); count = 0",
            caption: "Start: 13 has three set bits (positions 0, 2, 3) still to clear.",
          },
          {
            pointers: [{ name: "x", at: 1 }],
            marked: [0],
            action: "x &= (x - 1) → 13 & 12 = 12 (0b1100); count = 1",
            caption: "13 - 1 = 12 (0b1100) flips bit 0 off; ANDing with 13 erases just that lowest set bit.",
          },
          {
            pointers: [{ name: "x", at: 2 }],
            marked: [0, 1],
            action: "x &= (x - 1) → 12 & 11 = 8 (0b1000); count = 2",
            caption: "12 - 1 = 11 (0b1011) flips the new lowest set bit (position 2) and every trailing zero below it.",
          },
          {
            pointers: [{ name: "x", at: 3 }],
            marked: [0, 1, 2],
            action: "x &= (x - 1) → 8 & 7 = 0; count = 3",
            caption: "One set bit left — clearing it drops x to 0, so the loop stops. popcount(13) = 3.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Brian Kernighan's bit count — O(popcount(x)) time, O(1) space.",
        source:
          "function countSetBits(x) {\n" +
          "  let count = 0;\n" +
          "  while (x !== 0) {\n" +
          "    x &= x - 1; // clear the lowest set bit\n" +
          "    count++;\n" +
          "  }\n" +
          "  return count;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each iteration clears exactly one set bit and nothing else, so the loop runs **popcount(x) times, not " +
          "32 times** — a sparse `x` (few set bits) finishes fast, unlike a naive \"shift and test all 32 " +
          "positions\" scan, which always pays for the full word width regardless of how many bits are actually " +
          "set. **O(popcount(x)) time, O(1) space.**",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**The signed/unsigned 32-bit trap.** JS's bitwise operators coerce to *signed* 32-bit integers, so " +
          "`1 << 31` is `-2147483648`, not `2^31`. Any problem whose values reach bit 31 needs `>>> 0` on the " +
          "final result (and on intermediates that could carry the sign bit) to read the answer as unsigned.",
          "**Shift amounts wrap modulo 32.** `x << 32` is a no-op (`x << (32 % 32) === x << 0`), not zero, and " +
          "`x << 35` behaves like `x << 3` — JS silently masks the shift count instead of erroring, so an " +
          "off-by-one in a computed shift amount produces a plausible-looking but wrong result.",
          "**Reaching for a hash set when a bitmask would do.** If the universe of possible elements is small " +
          "(≤ ~32), a `Set`'s O(n) memory and per-element hashing is strictly more expensive than one integer's " +
          "O(1) membership/union/intersection — a missed optimization interviewers often probe for directly.",
          "**Confusing bit *position* with bit *value*.** `1 << i` is the mask for position `i`; forgetting the " +
          "`1 <<` and using `i` directly as a mask (e.g. `x & i` instead of `x & (1 << i)`) tests the wrong bits " +
          "entirely and fails silently rather than erroring.",
          "**Assuming `x & (x - 1)` or XOR-fold generalizes to *any* count.** `x & (x - 1)` clears exactly one bit " +
          "per call — fine for popcount, wrong if you need to clear the *k* lowest bits without a loop. XOR-fold " +
          "only isolates a value that appears an *odd* number of times; two duplicates plus one unique value " +
          "works, three duplicates plus one unique does not.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "`n = 0` — no bits set; a popcount loop or DP-over-bits build must terminate immediately rather than " +
          "underflow or loop forever.",
          "All bits set (e.g. `0xFFFFFFFF`) — a good stress test for a mask/shift/merge problem, since every bit " +
          "pair or group is already \"matched\" and the operation should be a no-op or a clean full flip.",
          "The exact power-of-two boundary (`n = 2^k`) — carries exactly one set bit, which catches an off-by-one " +
          "in a DP-over-bits recurrence like `dp[x] = dp[x >> 1] + (x & 1)` faster than a random `x` would.",
          "The most significant bit (bit 31) set on an unsigned 32-bit value — the classic signed/unsigned trap " +
          "above; always include a test case that crosses `2^31` explicitly rather than assuming smaller values " +
          "generalize.",
          "A single unpaired/odd-count value sitting at the very start or end of an array, not just the middle — " +
          "an XOR fold is order-independent so this shouldn't matter, but it's a cheap check that no accidental " +
          "index-based logic snuck into the solution.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["single-number", "counting-bits"],
        recommended: ["swap-odd-even-bits"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "MDN — Bitwise operators", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND", type: "doc" },
          { label: "Wikipedia — Hamming weight (popcount)", url: "https://en.wikipedia.org/wiki/Hamming_weight", type: "article" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
