import { transform } from "sucrase";
import { Worker } from "node:worker_threads";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problemsDir = path.join(root, "src/judge/problems");
const workerPath = path.join(root, "src/judge/runner/judge.worker.mjs");

// Transpile a problem .ts module to CJS and evaluate it with defineProblem stubbed to identity.
const loadProblem = (file) => {
  const src = fs.readFileSync(path.join(problemsDir, file), "utf8");
  const { code } = transform(src, { transforms: ["typescript", "imports"], disableESTransforms: true });
  const mod = { exports: {} };
  const fakeRequire = (id) => (id.includes("problem") ? { defineProblem: (p) => p } : {});
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

const files = fs.readdirSync(problemsDir).filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "problem.ts");

let allGood = true;
for (const file of files) {
  const problem = loadProblem(file);
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
