import type { LearnTopic } from "@/learn/data/topic";

export const tries = {
  slug: "tries",
  title: "Tries",
  category: "data-structures",
  summary: "Prefix trees — lookup in O(key length), and words sharing a prefix share nodes.",
  tags: ["trie", "string", "depth-first-search", "design"],
  priority: "mid",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **trie** (pronounced \"try\", from re*trie*val), also called a **prefix tree**, stores a set of strings as " +
          "paths from a single **root** down through the tree, one character per edge. Every node represents the " +
          "prefix spelled by the path that reaches it, and a boolean **end-of-word** flag on a node marks whether that " +
          "prefix is itself a stored word.\n\n" +
          "The payoff is in the cost model: insert, exact lookup, and prefix lookup each take **O(L)** in the length of " +
          "the key `L`, *independent of how many keys are stored*. A hash set also offers O(L) membership, but it can " +
          "only answer \"is this exact string present?\" — it can't answer \"does any stored word start with this " +
          "prefix?\" without scanning everything. The trie answers that prefix question directly, because words sharing " +
          "a prefix share the same path, so the shared prefix is walked once.\n\n" +
          "Each node typically carries a small **children map** (character → child node) plus the end flag. With 26 " +
          "lowercase letters the map is often an array of 26 slots, but a hash map keeps it general for larger alphabets.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "insert(word)", average: "O(n)", worst: "O(n)", note: "Walk/create one node per character; O(L) in the word length L." },
          { operation: "search(word) — exact", average: "O(n)", worst: "O(n)", note: "O(L): follow the path, then check the end-of-word flag at the last node." },
          { operation: "startsWith(prefix)", average: "O(n)", worst: "O(n)", note: "O(L): follow the path; reaching the end of the prefix is enough — no end flag needed." },
          { operation: "wildcard search (k dots)", average: "O(n)", worst: "O(n)", note: "A '.' branches into every child, so worst case O(alphabet^k · L) — cheap when dots are few." },
          { operation: "build a trie of all words", average: "O(n)", worst: "O(n)", note: "Sum of all word lengths; space is the same — shared prefixes collapse, divergent suffixes don't." },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a trie the moment a problem is about **prefixes** rather than whole-string equality: autocomplete " +
          "(\"every word starting with `app`\"), spell-check, longest-common-prefix over a dictionary, IP routing tables, " +
          "or \"does any stored word begin with this?\" A plain [hash set](/study-guide/algos/topic/hash-maps) handles " +
          "exact membership in O(L) too, so a trie only earns its extra memory when you need the *prefix* structure — " +
          "the shared-path layout is the whole point.\n\n" +
          "The second strong tell is **searching a dictionary against a board or a stream of patterns**. When you must " +
          "match *many* words at once — every word on a grid, or many wildcard queries — building one trie of the words " +
          "and walking the search in lockstep with it prunes dead branches the instant a prefix can't continue, which " +
          "no per-word loop can do. That pruning is why word-search-on-a-board problems are trie problems in disguise.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Insert / walk** — the bread and butter. Insert descends from the root, creating a child whenever the next " +
          "character has no edge yet, and flips the end-of-word flag at the final node. Exact search walks the same " +
          "path and succeeds only if every step had a child *and* the last node's end flag is set; prefix search drops " +
          "the end-flag check, because merely reaching the end of the prefix proves some word extends it.\n\n" +
          "**Wildcard DFS** — when the search pattern can contain a `.` that matches any single letter, a straight walk " +
          "no longer works: a literal letter follows its one matching child, but a `.` must *branch* into every child " +
          "and succeed if any branch matches the rest of the pattern. This turns search into a depth-first recursion " +
          "over the trie — the engine behind \"add and search words.\"\n\n" +
          "**Trie + grid backtracking** — to find all dictionary words on a board, build a trie of the words, then DFS " +
          "from every cell walking the board and the trie together: at a cell you may only descend trie child " +
          "`board[r][c]`. When the trie has no such child the whole branch is dead — every word sharing that prefix is " +
          "pruned at once. Mark a visited cell during the path and restore it on the way out, and record a word when " +
          "you land on an end node. This is [backtracking](/study-guide/algos/topic/backtracking) steered by a trie.\n\n" +
          "**Store the word at the end node** — a small trick that pays off in the grid case: instead of rebuilding the " +
          "spelled string when you reach an end node, stash the whole word on that node at insert time, and clear it " +
          "once collected to dedupe the output for free.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "A trie is a [tree](/study-guide/algos/topic/trees) whose edges are labeled by characters, so the same DFS " +
          "and recursion habits carry straight over — a wildcard search is just a tree DFS with a branching rule. It " +
          "overlaps a [hash map](/study-guide/algos/topic/hash-maps) on exact membership (both O(L)), but only the trie " +
          "exposes prefixes, because a hash map throws away the shared structure a trie keeps. And because the search " +
          "problems above pair a trie with grid or pattern exploration, a trie frequently shows up alongside " +
          "[backtracking](/study-guide/algos/topic/backtracking) and [depth-first search](/study-guide/algos/topic/graphs).",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The reusable trie skeleton — a node, insert, and the shared walk that exact-search and prefix-search specialize.",
        source:
          "// A node holds a children map (char -> node) and a flag for \"a word ends here\".\n" +
          "const makeNode = () => ({ children: new Map(), isEnd: false });\n" +
          "const root = makeNode();\n\n" +
          "function insert(word) {\n" +
          "  let node = root;\n" +
          "  for (const ch of word) {\n" +
          "    if (!node.children.has(ch)) node.children.set(ch, makeNode());\n" +
          "    node = node.children.get(ch);   // descend, creating the path as needed\n" +
          "  }\n" +
          "  node.isEnd = true;                // the last node closes a complete word\n" +
          "}\n\n" +
          "// Follow the path for `str`; return the node it ends on, or null if it falls off.\n" +
          "function walk(str) {\n" +
          "  let node = root;\n" +
          "  for (const ch of str) {\n" +
          "    if (!node.children.has(ch)) return null;\n" +
          "    node = node.children.get(ch);\n" +
          "  }\n" +
          "  return node;\n" +
          "}\n\n" +
          "const search = (word) => walk(word)?.isEnd === true;   // exact: path AND end flag\n" +
          "const startsWith = (prefix) => walk(prefix) !== null;  // prefix: path is enough",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Autocomplete intuition.** Insert `\"to\"`, `\"tea\"`, and `\"ten\"` into a trie, then ask two questions: is " +
          "`\"tea\"` a stored word, and does anything start with `\"te\"`?\n\n" +
          "Because all three words begin with `t`, they share the root's `t` edge; `tea` and `ten` further share the " +
          "`te` path and diverge only at the last letter. Watch the path the insert and the two queries trace through " +
          "the shared structure — the end-of-word flag (drawn as `•`) is what separates a stored word from a mere " +
          "prefix:",
      },
      {
        kind: "walkthrough",
        heading: "the trie path for \"to\", \"tea\", \"ten\" — • marks an end-of-word node",
        lane: ["root", "t", "o•", "e", "a•", "n•"],
        frames: [
          {
            pointers: [{ name: "node", at: 1 }],
            range: [0, 1],
            action: "insert \"to\": root → t → o, flag o",
            caption: "First word lays down the t-o path; the o node gets the end-of-word flag.",
          },
          {
            pointers: [{ name: "node", at: 3 }],
            range: [1, 4],
            action: "insert \"tea\": reuse t, branch e → a, flag a",
            caption: "\"tea\" reuses the existing t node, then forks off a new e–a branch.",
          },
          {
            pointers: [{ name: "node", at: 5 }],
            range: [3, 5],
            action: "insert \"ten\": reuse t-e, add n, flag n",
            caption: "\"ten\" shares the t–e path with \"tea\" and only the final n is new.",
          },
          {
            pointers: [{ name: "node", at: 4 }],
            range: [1, 4],
            action: "search \"tea\": walk t-e-a, isEnd? ✓",
            caption: "Exact search follows t→e→a and finds the end flag set — \"tea\" is stored.",
          },
          {
            pointers: [{ name: "node", at: 3 }],
            range: [1, 3],
            action: "startsWith \"te\": walk t-e, node exists ✓",
            caption: "Prefix search stops at the e node; it exists, so words start with \"te\" — no flag needed.",
          },
          {
            action: "search \"te\": walk t-e, isEnd? ✗",
            caption: "Same path, but exact search fails: the e node has no end flag, so \"te\" itself was never stored.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "The three queries on the trie above — each is one O(L) walk.",
        source:
          "insert(\"to\"); insert(\"tea\"); insert(\"ten\");\n\n" +
          "search(\"tea\");        // true  — path t-e-a exists and its last node is flagged\n" +
          "startsWith(\"te\");     // true  — path t-e exists, that's all a prefix needs\n" +
          "search(\"te\");         // false — path t-e exists but the e node has no end flag",
      },
      {
        kind: "prose",
        body:
          "Each query is a single pass down the tree, so all three are **O(L)** in the query length — and crucially the " +
          "cost doesn't grow with the number of stored words, only with how long the query is. That constant-per-" +
          "character lookup, plus the shared-prefix layout, is the entire reason tries exist.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Confusing `search` with `startsWith`.** Exact search must check the end-of-word flag at the final node; prefix search must *not*. Returning the node's existence for `search` reports every prefix as a stored word.",
          "**Forgetting to set the end flag.** Inserting characters without flagging the last node means every word silently fails exact search — the path is there, but nothing marks it as a complete word.",
          "**Treating a wildcard like a literal.** A `.` must branch into *all* children and recurse; matching it against one fixed child (or skipping it) makes wildcard search wrong. It's a DFS, not a linear walk.",
          "**Reusing a board cell in word search.** Mark a cell visited before recursing and *restore it on the way back out*. Skip the restore and later paths can't cross that cell; skip the mark and a word can reuse a letter it shouldn't.",
          "**Reporting a found word twice.** On a board, the same word can be reachable by multiple paths. Clear the end-node's stored word (or use a set) once collected, or the output contains duplicates.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Query before any insert — every `search` / `startsWith` on an empty trie must return `false`.",
          "A word that is a prefix of another (`\"a\"`, `\"ab\"`, `\"abc\"`) — all three must be independently searchable; the shorter ones' end flags sit on interior nodes.",
          "A prefix that is *not* a stored word (`startsWith(\"app\")` true while `search(\"app\")` false) — the classic flag distinction.",
          "A query longer than any stored word — the walk falls off the trie partway and must return `false`, not crash.",
          "An all-wildcard search pattern (`\"...\"`) — matches any stored word of that exact length, and nothing of a different length.",
          "Duplicate inserts — inserting the same word twice is idempotent; the second insert changes nothing.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["implement-trie-prefix-tree"],
        recommended: ["design-add-and-search-words-data-structure", "word-search-ii"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Tries practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Trie cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/trie/", type: "article" },
          { label: "Wikipedia — Trie", url: "https://en.wikipedia.org/wiki/Trie", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
