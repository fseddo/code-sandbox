import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirror the `@/*` → `src/*` alias from tsconfig so worker/runner imports resolve under vitest.
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    // The integration suite spawns the judge worker per problem and races it against the 8s Submit
    // budget, so a single test can legitimately run several seconds — well past vitest's 5s default.
    testTimeout: 20000,
    include: ["src/**/*.test.{ts,tsx,mjs}"],
  },
});
