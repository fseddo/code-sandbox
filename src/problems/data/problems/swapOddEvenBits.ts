import { defineAlgoProblem } from "../problem";

export const swapOddEvenBits = defineAlgoProblem<[number], number>({
  id: "swap-odd-even-bits",
  number: 165,
  title: "Swap Odd and Even Bits",
  difficulty: "medium",
  tags: ["bit-manipulation"],
  functionName: "swapOddEvenBits",
  prompt: `Treat \`n\` as a **32-bit unsigned integer**. Number its bit positions from \`0\` (least significant) to \`31\` (most significant): positions \`0, 2, 4, …, 30\` are the "even" positions, and \`1, 3, 5, …, 31\` are the "odd" positions.

Swap every adjacent pair of bits — the bit at even position \`2k\` trades places with the bit at odd position \`2k + 1\`, for each \`k\` from \`0\` to \`15\` — and return the resulting integer.

For example, for \`n = 23\` (binary \`...00010111\`), pairing bits from the low end gives \`(bit0, bit1) = (1, 1)\`, \`(bit2, bit3) = (1, 0)\`, \`(bit4, bit5) = (1, 0)\`. Swapping each pair yields bits \`1, 1, 0, 1, 0, 1\` (positions 0 through 5), which is \`43\`.`,
  constraints: ["0 <= n <= 2^32 - 1"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
function swapOddEvenBits(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number}
 */
function swapOddEvenBits(n: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "single odd bit set",
      args: [2],
      expected: 1,
      explanation: "n = 2 has only bit 1 (odd) set; swapping moves it to bit 0, giving 1.",
    },
    {
      name: "mixed bits",
      args: [23],
      expected: 43,
      explanation: "23 = binary ...10111. Swapping each adjacent pair gives ...101011 = 43.",
    },
    {
      name: "zero",
      args: [0],
      expected: 0,
      explanation: "No bits are set, so there's nothing to swap.",
    },
    {
      name: "all 32 bits set",
      args: [0xffffffff],
      expected: 0xffffffff,
      explanation: "Every pair is (1, 1); swapping a pair of identical bits is a no-op.",
    },
  ],
  hiddenTests: [
    { name: "bit 0 only (smallest nonzero, even position)", args: [1], expected: 2 },
    { name: "bit 2 only (even position)", args: [4], expected: 8 },
    { name: "bit 3 only (odd position)", args: [8], expected: 4 },
    { name: "adjacent pair already matched (fixed point)", args: [3], expected: 3 },
    {
      name: "repeating nibble pattern 0x33333333 (fixed point)",
      args: [0x33333333],
      expected: 0x33333333,
    },
    {
      name: "repeating nibble pattern 0x0F0F0F0F (fixed point)",
      args: [0x0f0f0f0f],
      expected: 0x0f0f0f0f,
    },
    {
      name: "bit 31 only set (signed/unsigned JS trap)",
      args: [2147483648],
      expected: 1073741824,
    },
    { name: "bit 30 only set", args: [1073741824], expected: 2147483648 },
    {
      name: "bits 30 and 31 both set (fixed point at the top)",
      args: [3221225472],
      expected: 3221225472,
    },
    {
      name: "largest value with bit 31 clear (INT32_MAX)",
      args: [2147483647],
      expected: 3221225471,
    },
    {
      name: "all odd bits set (0xAAAAAAAA)",
      args: [0xaaaaaaaa],
      expected: 0x55555555,
    },
    {
      name: "all even bits set (0x55555555)",
      args: [0x55555555],
      expected: 0xaaaaaaaa,
    },
    {
      name: "all bits set except bit 0",
      args: [0xfffffffe],
      expected: 0xfffffffd,
    },
    {
      name: "all bits set except bit 1",
      args: [0xfffffffd],
      expected: 0xfffffffe,
    },
    {
      name: "anti-hardcode: general mixed-nibble value 0x12345678",
      args: [0x12345678],
      expected: 0x2138a9b4,
    },
    {
      name: "anti-hardcode: general mixed-nibble value 0x9ABCDEF0",
      args: [0x9abcdef0],
      expected: 0x657cedf0,
    },
  ],
  source: { origin: "authored", confidence: 0.6 },
  solutions: [
    {
      name: "Two masks, shift, and OR",
      explanation: `\`0x55555555\` is \`0101...0101\` in binary — a \`1\` at every even bit position — so ANDing it with \`n\` isolates exactly the even-position bits. \`0xAAAAAAAA\` is its complement, \`1010...1010\`, isolating the odd-position bits. Shifting the even bits left by one moves each into its neighboring odd slot; shifting the odd bits right by one moves each into its neighboring even slot. ORing the two shifted groups back together places every bit in its swapped position.

JavaScript's bitwise operators coerce operands to **signed** 32-bit integers, so once bit 31 is involved (any \`n >= 2^31\`), an intermediate value like \`evenBits << 1\` can come out negative even though we mean it as unsigned. \`>>> 0\` (unsigned right shift by zero) reinterprets those 32 bits as unsigned again without changing any bit, so applying it to the final OR (and to each masked/shifted intermediate) keeps the whole computation in the correct \`0\` to \`2^32 - 1\` range.

\`O(1)\` time and space — a fixed number of masks, shifts, and an OR regardless of \`n\`.`,
      code: {
        javascript: `function swapOddEvenBits(n) {
  const EVEN_MASK = 0x55555555; // 1 at every even bit position (0, 2, 4, ...)
  const ODD_MASK = 0xaaaaaaaa; // 1 at every odd bit position (1, 3, 5, ...)

  // Isolate each group, then unsigned-coerce so bit 31 doesn't read as negative.
  const evenBits = (n & EVEN_MASK) >>> 0;
  const oddBits = (n & ODD_MASK) >>> 0;

  // Move even bits up into the odd slots, odd bits down into the even slots.
  const shiftedEven = (evenBits << 1) >>> 0;
  const shiftedOdd = oddBits >>> 1;

  return (shiftedEven | shiftedOdd) >>> 0;
}`,
        typescript: `function swapOddEvenBits(n: number): number {
  const EVEN_MASK = 0x55555555; // 1 at every even bit position (0, 2, 4, ...)
  const ODD_MASK = 0xaaaaaaaa; // 1 at every odd bit position (1, 3, 5, ...)

  // Isolate each group, then unsigned-coerce so bit 31 doesn't read as negative.
  const evenBits = (n & EVEN_MASK) >>> 0;
  const oddBits = (n & ODD_MASK) >>> 0;

  // Move even bits up into the odd slots, odd bits down into the even slots.
  const shiftedEven = (evenBits << 1) >>> 0;
  const shiftedOdd = oddBits >>> 1;

  return (shiftedEven | shiftedOdd) >>> 0;
}`,
      },
    },
  ],
});
