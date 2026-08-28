import { transform } from "sucrase";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Prose + structure linter for Learn topics — the mechanical floor under
 * docs/features/system-design-authoring.md §6a and §7. Three families:
 *
 *   repetition   the page (or its chapter) says the same thing twice
 *   economy      a part is bloated, a sentence is unreadable, or a part is too thin to teach
 *   consistency  metadata, section shapes and cross-links match the house design
 *
 * Usage:  node scripts/lintTopics.mjs <slug>            one topic
 *         node scripts/lintTopics.mjs --chapter <slugs> cross-page repetition across a chapter
 *         node scripts/lintTopics.mjs --all             every `systems` topic
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topicsDir = path.join(root, "src/learn/data/topics");
const manifestPath = path.join(root, "docs/system-design-lesson-manifest.md");

// ─── budgets ────────────────────────────────────────────────────────────────
// Upper bounds catch long-windedness; lower bounds stop a page being so terse it stops teaching.
// Calibrated against the two chapter-01 pages, then loosened one notch so honest depth clears.
const PART_BUDGET = {
  definition: { maxWords: 260, minWords: 40 },
  whenToUse: { maxWords: 200, minWords: 30 },
  techniques: { maxWords: 520 },
  relatedStructures: { maxWords: 160 },
  implementation: { maxWords: 400 },
  example: { maxWords: 1100, minWords: 80 },
  tradeoffs: { maxWords: 480, minWords: 40 },
  pitfalls: { maxWords: 300, minItems: 3, maxItems: 5 },
  interviewAngle: { maxWords: 340, minItems: 3, maxItems: 5 },
  cornerCases: { maxWords: 300, minItems: 3, maxItems: 5 },
  practice: {},
  operations: {},
  resources: { minItems: 2, maxItems: 4 },
};

const MAX_SENTENCE_WORDS = 45;
const MAX_PARAGRAPH_WORDS = 130;
// The whole-page cap counts everything the reader actually reads — table cells and derivations included.
// Per-part caps are ceilings on individual parts and say nothing about the sum; a page can clear every one
// of them and still be a slog, which is exactly how the first two chapter-01 pages passed.
const MAX_PAGE_WORDS = 2400;

/** Phrases that are always filler. Rubric §6 names several; this is the enforceable list. */
const FILLER = [
  "it's important to note", "it is important to note", "it should be noted", "needless to say",
  "as we all know", "in today's", "at the end of the day", "when it comes to", "the fact that",
  "it is worth noting", "it's worth noting", "in order to", "delve into", "a myriad of",
];

// ─── loading ────────────────────────────────────────────────────────────────
const fileForSlug = (slug) => {
  const camel = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const direct = path.join(topicsDir, `${camel}.ts`);
  if (fs.existsSync(direct)) return direct;
  // Slug and file name diverge on a few seeded topics; fall back to a content scan.
  const hit = fs.readdirSync(topicsDir).find((f) => {
    if (!f.endsWith(".ts") || f === "index.ts") return false;
    return new RegExp(`slug:\\s*"${slug}"`).test(fs.readFileSync(path.join(topicsDir, f), "utf8"));
  });
  return hit ? path.join(topicsDir, hit) : undefined;
};

const loadTopic = (file) => {
  const { code } = transform(fs.readFileSync(file, "utf8"), {
    transforms: ["typescript", "imports"],
    disableESTransforms: true,
  });
  const mod = { exports: {} };
  new Function("module", "exports", "require", code)(mod, mod.exports, () => ({}));
  return Object.values(mod.exports)[0];
};

const manifestSlugs = () => {
  if (!fs.existsSync(manifestPath)) return new Set();
  const text = fs.readFileSync(manifestPath, "utf8");
  return new Set([...text.matchAll(/^\| [☐☑] \| [^|]+ \| `([a-z0-9-]+)`/gm)].map((m) => m[1]));
};

const knownSlugs = () =>
  new Set(
    fs.readdirSync(topicsDir).flatMap((f) => {
      if (!f.endsWith(".ts") || f === "index.ts") return [];
      const m = fs.readFileSync(path.join(topicsDir, f), "utf8").match(/slug:\s*"([a-z0-9-]+)"/);
      return m ? [m[1]] : [];
    }),
  );

/** Topics that actually exist on disk — distinct from `slugs`, which also counts unbuilt manifest entries. */
const builtSlugs = knownSlugs();

// ─── text extraction ────────────────────────────────────────────────────────
/** Every reader-facing string in a section, tagged with the part it came from. `code.source` is excluded. */
const textsOf = (section, part, out) => {
  const push = (text, role) => {
    if (typeof text === "string" && text.trim()) out.push({ part, role, text });
  };
  push(section.heading, "heading");
  push(section.caption, "caption");
  push(section.body, "prose");
  (section.items ?? []).forEach((item) => push(item, "item"));
  (section.rows ?? []).forEach((row) => {
    push(row.label, "row");
    push(row.quantity, "row");
    push(row.derivation, "row");
    push(row.note, "row");
    (row.cells ?? []).forEach((cell) => push(cell, "cell"));
  });
  (section.nodes ?? []).forEach((node) => typeof node === "object" && push(node.note, "node"));
  (section.steps ?? []).forEach((step) => { push(step.label, "step"); push(step.note, "step"); });
  (section.blocks ?? []).forEach((block) => textsOf(block, part, out));
  return out;
};

const allTexts = (topic) =>
  Object.entries(topic.parts ?? {}).flatMap(([part, sections]) =>
    (sections ?? []).flatMap((section) => textsOf(section, part, [])),
  );

const stripMarkup = (text) =>
  text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/[`*]/g, "");

const words = (text) => stripMarkup(text).split(/\s+/).filter(Boolean);

/**
 * Split on raw text so a fully-bold run can be recognised as a *label* and dropped: `**Step 3 · High-level
 * design.**` is scaffolding, and matching it against a passage that names the same steps is noise, not
 * restatement.
 */
const sentences = (text) =>
  text
    .split(/\n\n+/)
    // A `- ` line renders as its own <li> (see ProseSection), so it is a unit regardless of punctuation.
    .flatMap((para) => para.split(/\n(?=\s*- )/))
    // Tolerate closing markup after the terminator — `…here?*` and `…settles.**` must still split.
    .flatMap((para) => para.split(/(?<=[.!?][*`)"']{0,2})\s+(?=[*`"'—A-Z])/))
    .map((s) => s.trim())
    .filter((s) => s && !/^\*\*[^*]+\*\*[.:]?$/.test(s))
    .map(stripMarkup)
    .filter(Boolean);

const tokens = (text) =>
  new Set(
    text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2),
  );

/** Containment, not Jaccard — a short bullet lifted out of a long paragraph should still register. */
const containment = (a, b) => {
  const small = a.size <= b.size ? a : b;
  const large = a.size <= b.size ? b : a;
  let shared = 0;
  for (const token of small) if (large.has(token)) shared += 1;
  return small.size ? shared / small.size : 0;
};

// ─── checks ─────────────────────────────────────────────────────────────────
const REPETITION_THRESHOLD = 0.7;
const MIN_TOKENS = 7;

const checkRepetition = (topic, findings, { label = "" } = {}) => {
  const units = allTexts(topic)
    // Headings and captions are *supposed* to echo the body they label — excluding them keeps the
    // signal on real restatement rather than on the page's own scaffolding.
    .filter(({ role }) => role !== "heading" && role !== "caption")
    .flatMap(({ part, role, text }) => sentences(text).map((sentence) => ({ part, role, sentence })))
    .map((unit) => ({ ...unit, tokens: tokens(unit.sentence) }))
    .filter((unit) => unit.tokens.size >= MIN_TOKENS);

  for (let i = 0; i < units.length; i += 1) {
    for (let j = i + 1; j < units.length; j += 1) {
      const score = containment(units[i].tokens, units[j].tokens);
      if (score < REPETITION_THRESHOLD) continue;
      findings.push({
        family: "repetition",
        level: "must-fix",
        message:
          `${label}\`${units[i].part}\` and \`${units[j].part}\` state the same point ` +
          `(${Math.round(score * 100)}% token overlap).\n` +
          `      A: ${units[i].sentence.slice(0, 150)}\n      B: ${units[j].sentence.slice(0, 150)}`,
      });
    }
  }
};

const checkEconomy = (topic, findings) => {
  let pageWords = 0;
  for (const [part, sections] of Object.entries(topic.parts ?? {})) {
    const budget = PART_BUDGET[part] ?? {};
    const texts = (sections ?? []).flatMap((section) => textsOf(section, part, []));
    // Budgets are a *reading* cost, and §4's lengths ("1 para + 1 table") were written about prose.
    // Table cells are scanned, not read through, so figure data is capped by row count instead (below).
    const prose = texts.filter(({ role }) => role === "prose" || role === "item");
    const count = prose.reduce((sum, { text }) => sum + words(text).length, 0);
    pageWords += texts
      .filter(({ role }) => role !== "heading" && role !== "caption")
      .reduce((sum, { text }) => sum + words(text).length, 0);

    if (budget.maxWords && count > budget.maxWords)
      findings.push({ family: "economy", level: "must-fix",
        message: `\`${part}\` is ${count} words, over its ${budget.maxWords}-word budget. Cut, or split the idea across parts.` });
    if (budget.minWords && count > 0 && count < budget.minWords)
      findings.push({ family: "economy", level: "must-fix",
        message: `\`${part}\` is only ${count} words (floor ${budget.minWords}). Too thin to teach — this is the succinctness failure, not a win.` });

    const items = (sections ?? []).flatMap((section) => section.items ?? []);
    if (budget.minItems && items.length && items.length < budget.minItems)
      findings.push({ family: "economy", level: "nice-to-fix", message: `\`${part}\` has ${items.length} bullets (floor ${budget.minItems}).` });
    if (budget.maxItems && items.length > budget.maxItems)
      findings.push({ family: "economy", level: "must-fix", message: `\`${part}\` has ${items.length} bullets (cap ${budget.maxItems}). Keep the ones that bite.` });

    for (const section of sections ?? []) {
      const rowCap = section.kind === "comparison" ? 8 : section.kind === "numbers" ? 12 : undefined;
      if (rowCap && (section.rows?.length ?? 0) > rowCap)
        findings.push({ family: "economy", level: "must-fix",
          message: `\`${part}\` ${section.kind} has ${section.rows.length} rows (cap ${rowCap}). A table past this stops being scannable.` });
    }

    const resourceCount = (sections ?? []).flatMap((s) => s.items ?? []).filter((i) => typeof i === "object").length;
    if (part === "resources" && budget.maxItems && resourceCount > budget.maxItems)
      findings.push({ family: "economy", level: "nice-to-fix", message: `\`resources\` has ${resourceCount} links (cap ${budget.maxItems}).` });

    for (const { text, role } of texts) {
      if (role === "heading") continue;
      for (const sentence of sentences(text)) {
        const length = sentence.split(/\s+/).filter(Boolean).length;
        if (length > MAX_SENTENCE_WORDS)
          findings.push({ family: "economy", level: "must-fix",
            message: `\`${part}\`: a ${length}-word sentence. Split it.\n      ${sentence.slice(0, 160)}…` });
      }
      // Same reason as `sentences()`: a `- ` line renders as its own <li>, so a bullet list is not one
      // long paragraph. Split list items out before measuring.
      for (const para of stripMarkup(text).split(/\n\n+/).flatMap((block) => block.split(/\n(?=\s*- )/))) {
        const length = para.split(/\s+/).filter(Boolean).length;
        if (length > MAX_PARAGRAPH_WORDS)
          findings.push({ family: "economy", level: "nice-to-fix", message: `\`${part}\`: a ${length}-word paragraph. Break it.` });
      }
      const lower = stripMarkup(text).toLowerCase();
      for (const phrase of FILLER)
        if (lower.includes(phrase))
          findings.push({ family: "economy", level: "must-fix", message: `\`${part}\`: filler phrase "${phrase}". Cut it.` });
    }
  }
  if (pageWords > MAX_PAGE_WORDS)
    findings.push({ family: "economy", level: "must-fix",
      message: `Page is ${pageWords} words the reader has to get through (cap ${MAX_PAGE_WORDS}). Length is not depth — cut a section that belongs to a sibling (§1a), or split the lesson.` });
};

const ALLOWED_KINDS = {
  definition: ["prose", "numbers", "comparison"],
  whenToUse: ["prose", "callout"],
  techniques: ["prose", "comparison", "code", "architecture", "sequence"],
  relatedStructures: ["prose"],
  implementation: ["code", "prose"],
  example: ["prose", "architecture", "sequence", "numbers", "comparison", "code"],
  tradeoffs: ["comparison", "prose"],
  pitfalls: ["callout"],
  interviewAngle: ["callout", "prose"],
  cornerCases: ["callout"],
  resources: ["resources"],
};
const FIGURE_KINDS = ["architecture", "sequence", "comparison", "numbers"];

// ─── archetypes ─────────────────────────────────────────────────────────────
// A lesson's required part set follows from its shape, not from one ladder every page climbs
// (rubric §2). `discouraged` parts aren't errors — a part filled because a table demanded it is a
// judgement call the auditor makes — but they are the shape that produced this rule, so they warn.
const ARCHETYPE = {
  orientation: {
    required: ["definition", "techniques", "relatedStructures", "resources"],
    discouraged: ["whenToUse", "tradeoffs", "implementation", "cornerCases"],
  },
  mechanism: {
    required: ["definition", "whenToUse", "techniques", "example", "tradeoffs", "pitfalls", "interviewAngle", "resources"],
    discouraged: [],
  },
  distinction: {
    required: ["definition", "techniques", "tradeoffs", "pitfalls", "interviewAngle", "resources"],
    discouraged: ["implementation"],
  },
  procedure: {
    required: ["definition", "techniques", "pitfalls", "interviewAngle", "resources"],
    discouraged: ["cornerCases", "relatedStructures"],
  },
};

const checkConsistency = (topic, findings, slugs) => {
  const fail = (message, level = "must-fix") => findings.push({ family: "consistency", level, message });

  if (topic.category !== "systems") fail(`\`category\` is "${topic.category}", expected "systems" for this track.`);
  if (!topic.priority) fail("`priority` is unset — the study-plan ordering axis (§3).");
  if (!topic.estimatedMinutes) fail("`estimatedMinutes` is unset (§3).");
  else if (topic.estimatedMinutes < 10 || topic.estimatedMinutes > 60)
    fail(`\`estimatedMinutes\` is ${topic.estimatedMinutes}; §3 expects 10–20 for a single idea, 40–60 for a meaty one.`, "nice-to-fix");
  if (!topic.tags?.length) fail("`tags` is empty (§3).");
  const sourceCount = topic.sources?.length ?? 0;
  if (sourceCount < 2 || sourceCount > 4) fail(`\`sources\` has ${sourceCount} entries; §7.7 requires 2–4.`);

  const present = Object.entries(topic.parts ?? {}).filter(([, s]) => s?.length).map(([p]) => p);
  const archetypeName = topic.archetype ?? "mechanism";
  const archetype = ARCHETYPE[archetypeName];
  if (!archetype) fail(`\`archetype\` is "${archetypeName}"; §2 defines ${Object.keys(ARCHETYPE).join(", ")}.`);
  else {
    for (const required of archetype.required)
      if (!present.includes(required))
        fail(`A \`${archetypeName}\` lesson requires \`${required}\` (§2), which is missing.`);
    for (const part of archetype.discouraged)
      if (present.includes(part))
        fail(
          `\`${part}\` on a \`${archetypeName}\` lesson — §2 omits it for this shape. ` +
            `Keep it only if this lesson genuinely has one; a part filled to satisfy a table is §7.21.`,
          "nice-to-fix",
        );
  }
  if (!topic.archetype)
    fail("`archetype` is unset — defaulting to `mechanism` (§2). Declare it so the part set is graded against the right shape.", "nice-to-fix");
  for (const unused of ["practice", "operations"])
    if (present.includes(unused)) fail(`\`${unused}\` is not used on this track (§4).`);

  const kinds = [];
  for (const [part, sections] of Object.entries(topic.parts ?? {}))
    for (const section of sections ?? []) {
      kinds.push(section.kind);
      const allowed = ALLOWED_KINDS[part];
      if (allowed && !allowed.includes(section.kind))
        fail(`\`${part}\` uses kind \`${section.kind}\`; §4 allows ${allowed.map((k) => `\`${k}\``).join(", ")}.`);
      if (section.kind === "comparison")
        for (const row of section.rows ?? [])
          if (row.cells.length !== section.columns.length - 1)
            fail(`\`${part}\` comparison row "${row.label}" has ${row.cells.length} cells for ${section.columns.length} columns.`);
      if (section.kind === "numbers")
        for (const row of section.rows ?? [])
          if (!row.derivation) fail(`\`${part}\` numbers row "${row.quantity}" has no \`derivation\` — §5 requires the arithmetic or the source.`);
      if (section.kind === "graph") fail(`\`${part}\` uses \`graph\`; §5 forbids it for topology — use \`architecture\`.`);
    }

  if (!kinds.some((k) => FIGURE_KINDS.includes(k)))
    fail(`No \`${FIGURE_KINDS.join("`/`")}\` section — §7.4 requires one load-bearing figure.`);
  const figureCount = kinds.filter((k) => FIGURE_KINDS.includes(k)).length;
  const tradeoffFigures = (topic.parts?.tradeoffs ?? []).filter((s) => FIGURE_KINDS.includes(s.kind)).length;
  if (figureCount - tradeoffFigures > 2)
    fail(`${figureCount - tradeoffFigures} figures outside \`tradeoffs\`; §5 says three is a sign the page should split.`, "nice-to-fix");

  const linkMatches = [...JSON.stringify(topic.parts).matchAll(/\[\[([a-z0-9-]+)(\|[^\]]+)?\]\]/g)];
  const links = linkMatches.map((m) => m[1]);
  for (const link of new Set(links))
    if (!slugs.has(link))
      fail(`\`[[${link}]]\` is neither an existing topic nor a manifest slug — it will never resolve. Check §7.9.`);
  // A built lesson renders under its own title; a forward reference has no title to borrow, so a bare
  // hyphenated slug leaks kebab-case into the sentence (§6).
  const bareForward = [
    ...new Set(linkMatches.filter((m) => !m[2] && m[1].includes("-") && !builtSlugs.has(m[1])).map((m) => m[1])),
  ];
  for (const link of bareForward)
    fail(
      `\`[[${link}]]\` is a forward reference with no display label — it will render as "${link}" mid-sentence. ` +
        `Write \`[[${link}|${link.replace(/-/g, " ")}]]\` (§6).`,
      "nice-to-fix",
    );
  if (new Set(links).size < 2) fail("Fewer than two sibling `[[slug]]` cross-links (§7.9).");
  if (topic.parent && !slugs.has(topic.parent)) fail(`\`parent: "${topic.parent}"\` does not resolve.`);
};

// ─── run ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const slugs = new Set([...manifestSlugs(), ...knownSlugs()]);

const targets = args[0] === "--all"
  ? [...knownSlugs()].filter((slug) => { const f = fileForSlug(slug); return f && loadTopic(f).category === "systems"; })
  : args[0] === "--chapter" ? args.slice(1) : args;

if (!targets.length) {
  console.error("usage: node scripts/lintTopics.mjs <slug…> | --chapter <slug…> | --all");
  process.exit(2);
}

let failed = 0;
const loaded = [];
for (const slug of targets) {
  const file = fileForSlug(slug);
  if (!file) { console.error(`✗ ${slug}: no topic file found`); failed += 1; continue; }
  const topic = loadTopic(file);
  loaded.push({ slug, topic });

  if (topic.category !== "systems")
    console.log(`  note: ${slug} is category "${topic.category}" — this linter encodes the *system design* rubric, so its consistency findings won't all apply.`);

  const findings = [];
  checkRepetition(topic, findings);
  checkEconomy(topic, findings);
  checkConsistency(topic, findings, slugs);

  const must = findings.filter((f) => f.level === "must-fix");
  console.log(`\n${must.length ? "✗" : "✓"} ${slug} — ${must.length} must-fix, ${findings.length - must.length} nice-to-fix`);
  for (const finding of findings)
    console.log(`  ${finding.level === "must-fix" ? "!" : "·"} [${finding.family}] ${finding.message}`);
  if (must.length) failed += 1;
}

// Cross-page repetition: the failure mode that only appears once a chapter is authored in parallel.
if (args[0] === "--chapter" && loaded.length > 1) {
  console.log("\n— cross-page repetition —");
  const crossFindings = [];
  for (let i = 0; i < loaded.length; i += 1)
    for (let j = i + 1; j < loaded.length; j += 1) {
      // `relatedStructures` exists to name what a sibling owns (§4), so it will always echo that sibling's
      // own prose — same reason headings and captions are excluded from the within-page pass.
      const spread = (topic) =>
        allTexts(topic)
          .filter(({ role, part }) => role !== "heading" && role !== "caption" && part !== "relatedStructures")
          .flatMap(({ part, text }) => sentences(text).map((s) => ({ part, s, t: tokens(s) })));
      const a = spread(loaded[i].topic);
      const b = spread(loaded[j].topic);
      for (const x of a.filter((u) => u.t.size >= MIN_TOKENS))
        for (const y of b.filter((u) => u.t.size >= MIN_TOKENS)) {
          const score = containment(x.t, y.t);
          if (score >= REPETITION_THRESHOLD)
            crossFindings.push(
              `  ! [repetition] ${loaded[i].slug}\`${x.part}\` ↔ ${loaded[j].slug}\`${y.part}\` (${Math.round(score * 100)}%)\n` +
              `      A: ${x.s.slice(0, 140)}\n      B: ${y.s.slice(0, 140)}`,
            );
        }
    }
  if (crossFindings.length) { crossFindings.forEach((f) => console.log(f)); failed += 1; }
  else console.log("  ✓ no cross-page duplication");
}

process.exit(failed ? 1 : 0);
