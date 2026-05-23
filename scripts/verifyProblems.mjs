import { transform } from "sucrase";
import { Worker } from "node:worker_threads";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problemsDir = path.join(root, "src/problems/data/problems");
const workerPath = path.join(root, "src/problems/algo/tester/problemTester.worker.mjs");

// Transpile a problem .ts module to CJS and evaluate it with defineAlgoProblem stubbed to identity.
const loadProblem = (file) => {
  const src = fs.readFileSync(path.join(problemsDir, file), "utf8");
  const { code } = transform(src, { transforms: ["typescript", "imports"], disableESTransforms: true });
  const mod = { exports: {} };
  const fakeRequire = (id) =>
    id.includes("problem")
      ? {
          defineAlgoProblem: (p) => ({ kind: "algo", ...p }),
          defineBuildProblem: (p) => ({ kind: "build", ...p }),
        }
      : {};
  new Function("module", "exports", "require", code)(mod, mod.exports, fakeRequire);
  return Object.values(mod.exports)[0];
};

const runOnWorker = (problem, source) =>
  new Promise((resolve) => {
    const tests = [
      ...problem.examples.map((e, i) => ({ name: e.name ?? `case ${i + 1}`, args: e.args, expected: e.expected, hidden: false })),
      ...problem.hiddenTests.map((t, i) => ({ name: `hidden case ${i + 1}`, args: t.args, expected: t.expected, hidden: true })),
    ];
    const worker = new Worker(workerPath, {
      workerData: { source, language: "javascript", functionName: problem.functionName, tests, io: problem.io ?? null, checker: problem.checker ?? null },
    });
    const timer = setTimeout(() => { worker.terminate(); resolve({ status: "timeout" }); }, 4000);
    worker.on("message", (outcome) => { clearTimeout(timer); worker.terminate(); resolve(outcome); });
    worker.on("error", (error) => { clearTimeout(timer); resolve({ status: "crashed", message: error.message }); });
  });

const files = fs.readdirSync(problemsDir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "index.ts" && f !== "problem.ts");

// Optional slug filter: `node verifyProblems.mjs <slug>` runs the solution check for just that problem
// (number-integrity still scans everything). Lets parallel imports verify their own module in isolation.
const onlySlug = process.argv[2] ?? null;

// Tolerant load: a sibling module being half-written (parallel import) shouldn't crash the whole run.
const tryLoad = (file) => {
  try {
    return loadProblem(file);
  } catch (error) {
    console.log(`SKIP ${file}: failed to load (${error instanceof Error ? error.message : error})`);
    return null;
  }
};

let allGood = true;

// Number integrity: every problem must carry a unique positive-integer `number` (the stable `#NN`).
const numbers = new Map();
for (const file of files) {
  const loaded = tryLoad(file);
  if (!loaded) continue;
  const { id, number } = loaded;
  if (!Number.isInteger(number) || number < 1) {
    allGood = false;
    console.log(`FAIL ${id}: number must be a positive integer (got ${JSON.stringify(number)})`);
  } else if (numbers.has(number)) {
    allGood = false;
    console.log(`FAIL ${id}: number ${number} already used by ${numbers.get(number)}`);
  } else {
    numbers.set(number, id);
  }
}
if (numbers.size > 0) {
  console.log(`NUMBERS ok: ${numbers.size} unique; next available is ${Math.max(...numbers.keys()) + 1}`);
}

for (const file of files) {
  const problem = tryLoad(file);
  if (!problem) { if (!onlySlug) allGood = false; continue; }
  if (onlySlug && problem.id !== onlySlug) continue;
  if (problem.kind === "build") { console.log(`SKIP ${problem.id}: build problem (human-evaluated, no automated tests)`); continue; }
  const solution = problem.solutions?.[0]?.code?.javascript;
  if (!solution) { console.log(`SKIP ${file}: no JS reference solution`); continue; }
  const outcome = await runOnWorker(problem, solution);
  if (outcome.status !== "ok") {
    allGood = false;
    console.log(`FAIL ${problem.id}: ${outcome.status} ${outcome.message ?? ""}`);
    continue;
  }
  const failed = outcome.results.filter((r) => !r.passed);
  const total = outcome.results.length;
  if (failed.length > 0) {
    allGood = false;
    console.log(`FAIL ${problem.id}: ${failed.length}/${total} cases failed`);
    for (const r of failed) console.log(`   ✗ ${r.name} — got ${JSON.stringify(r.actual)} expected ${JSON.stringify(r.expected)}`);
  } else {
    console.log(`PASS ${problem.id}: ${total}/${total} (${problem.examples.length} visible + ${problem.hiddenTests.length} hidden)`);
  }
}
process.exit(allGood ? 0 : 1);
