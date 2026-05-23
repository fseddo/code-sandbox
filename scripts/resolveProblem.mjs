import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve a problem name/slug to the seed metadata an importer needs (a `ProblemStub`, see
// src/problems/data/problem.ts). A catalog hit emits the stub; an off-catalog name emits a skeleton stub
// whose difficulty/tags must be sourced from the web. Authoring-time tooling, like verifyProblems.mjs
// — never imported by the app, so the 85KB catalog stays out of the bundle.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "src/problems/data/problems/leetcodeProblemSet.json");

const query = process.argv.slice(2).join(" ").trim();
if (!query) {
  console.error('usage: node scripts/resolveProblem.mjs "<problem name or slug>"');
  process.exit(2);
}

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const rows = JSON.parse(fs.readFileSync(catalogPath, "utf8")).data.problemsetQuestionListV2.questions;

/** Catalog row → the only fields copied from a source; everything else the importer authors. */
const toStub = (row) => ({
  id: row.titleSlug,
  title: row.title,
  difficulty: row.difficulty.toLowerCase(),
  tags: row.topicTags.map((tag) => tag.slug),
  source: { origin: "leetcode", frontendId: row.questionFrontendId, acRate: row.acRate },
});

const q = normalize(query);
const qSlug = slugify(query);
const exact = rows.filter((row) => normalize(row.title) === q || row.titleSlug === qSlug);
const partial = exact.length
  ? []
  : rows.filter((row) => normalize(row.title).includes(q) || row.titleSlug.includes(qSlug));

const emit = (payload) => console.log(JSON.stringify(payload, null, 2));

if (exact.length === 1) {
  emit({ status: "catalog-hit", stub: toStub(exact[0]) });
} else if (exact.length > 1) {
  emit({ status: "ambiguous", candidates: exact.map(toStub) });
} else if (partial.length) {
  // Near-misses: the agent picks the intended title, then re-runs with the exact slug.
  emit({
    status: "partial",
    candidates: partial.slice(0, 8).map((row) => ({ title: row.title, slug: row.titleSlug })),
  });
} else {
  emit({
    status: "off-catalog",
    message: `"${query}" is not in the 100-row catalog — author it as an off-catalog stub.`,
    stub: {
      id: qSlug,
      title: query,
      difficulty: null,
      tags: [],
      source: { origin: "authored" },
    },
    sourceFromWeb: ["confirm canonical slug (id)", "difficulty", "topic tags"],
  });
}
