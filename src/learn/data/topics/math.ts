import type { LearnTopic } from "@/learn/data/topic";

export const math = {
  slug: "math",
  title: "Math & number theory",
  category: "algorithms",
  summary: "GCD, primes, modular arithmetic, digit work — and watching for overflow / float precision.",
  tags: ["math"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Interview math leans on a few reusable tools: GCD/LCM via Euclid's algorithm, prime testing and the " +
          "Sieve of Eratosthenes, modular arithmetic, and digit manipulation. JavaScript numbers are 64-bit " +
          "floats — exact only up to 2⁵³ — so large-integer work needs `BigInt`.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for these when a problem is about divisibility, primes, digits, powers, or combinatorics. The " +
          "recurring traps are integer overflow and floating-point precision — prefer integer math and modular " +
          "reduction over floats where you can.",
      },
    ],
  },
} satisfies LearnTopic;
