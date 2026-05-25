import type { SupportedLanguage, TopicTag } from "@/problems/data/problem";

/** Top-level shelf a topic sits on — the landing page's primary grouping and a catalog facet. */
export type LearnCategory =
  | "data-structures"
  | "algorithms"
  | "complexity"
  | "databases"
  | "web"
  | "systems";

export const CATEGORY_LABELS: Record<LearnCategory, string> = {
  "data-structures": "Data structures",
  algorithms: "Algorithms",
  complexity: "Complexity",
  databases: "Databases",
  web: "Web & rendering",
  systems: "Systems",
};

/** The Big-O vocabulary a complexity row may cite — a closed set so a typo can't invent a class. */
export type ComplexityClass =
  | "O(1)"
  | "amortized O(1)"
  | "O(log n)"
  | "O(n)"
  | "O(n log n)"
  | "O(n²)"
  | "O(V + E)"
  | "O(V²)"
  | "O(2ⁿ)";

/** One row of a complexity table: an operation and its average/worst cost, with an optional caveat. */
export type ComplexityRow = {
  operation: string;
  average: ComplexityClass;
  worst: ComplexityClass;
  note?: string;
};

/** A graph edge as a `[from, to]` pair of node ids — labeled tuple so authoring reads `["A", "B"]`. */
export type GraphEdge = [from: string, to: string];

/** Callout tone — drives the color/intent of a bulleted aside. */
export type CalloutTone = "warn" | "info" | "tip";

/** A linked study resource; `type` picks the icon and groups it visually. */
export type ResourceItem = { label: string; url: string; type: "article" | "video" | "doc" };

/** A named cursor over a walkthrough lane — rendered as a labeled arrow above cell `at`, colored by first-appearance order. */
export type WalkthroughPointer = { name: string; at: number };

/** One step of a walkthrough: where the pointers/window sit, what got dropped, and the decision that moves us on. */
export type WalkthroughFrame = {
  /** Cursors to draw above the lane this step. A pointer keeps its color across frames by `name`. */
  pointers?: WalkthroughPointer[];
  /** Inclusive `[start, end]` cells highlighted as the active window. */
  range?: [start: number, end: number];
  /** Cells dropped from consideration this step — dimmed and struck through. */
  marked?: number[];
  /** One-line narration shown under the frame. */
  caption?: string;
  /** The decision for this step, shown in a dashed callout beside the lane (e.g. `"sum = 1 < 7 → left += 1"`). */
  action?: string;
};

/** A single cell coordinate in a 2-D board walkthrough, as `[row, col]` (0-based). */
export type GridCoord = [row: number, col: number];

/** One step of a {@link Section} `gridWalkthrough` — the 2-D analogue of {@link WalkthroughFrame}. */
export type GridWalkthroughFrame = {
  /** Board state for this step. Defaults to the section's `grid`; supply it to depict an in-place mutation. */
  grid?: (string | number)[][];
  /** The cell the scan sits on this step — drawn with the cursor highlight. */
  cursor?: GridCoord;
  /** Cells flagged this step (a conflict, a cell about to be zeroed) — drawn marked. */
  marked?: GridCoord[];
  /** Cells softly highlighted as the region under inspection (the current row / column / box). */
  active?: GridCoord[];
  /** One-line narration shown under the frame. */
  caption?: string;
  /** The decision for this step, shown in a dashed callout beside the board. */
  action?: string;
};

/**
 * A named pointer over a {@link ListWalkthroughFrame} — a labeled arrow above the node at index `at`,
 * colored by first-appearance order (the same palette as {@link WalkthroughPointer}). `at: null` parks
 * the pointer on the trailing `null` terminator (e.g. `prev = null` at the start of a reversal).
 */
export type ListPointer = { name: string; at: number | null };

/**
 * One step of a {@link Section} `listWalkthrough` — the linked-list analogue of {@link WalkthroughFrame}.
 * The chain is the section's `nodes`; a frame moves pointers over it, can re-aim individual `next` links
 * (to depict an in-place rewire like reversal), and can flag nodes as removed.
 */
export type ListWalkthroughFrame = {
  /** Pointers to draw above the chain this step. A pointer keeps its color across frames by `name`. */
  pointers?: ListPointer[];
  /**
   * Per-node `next`-link overrides for this step, by source node index. The value is the *target* node
   * index, or `null` to point at the terminator. Use it to show a reversed/spliced link; nodes not listed
   * keep their default forward link (`i -> i + 1`, last -> null). A reversed link is drawn facing backward.
   */
  links?: Record<number, number | null>;
  /** Node indices dropped this step (a removed/skipped node) — dimmed and struck through. */
  marked?: number[];
  /** Node indices softly highlighted as the region under inspection (e.g. a sublist being reversed). */
  active?: number[];
  /** One-line narration shown under the frame. */
  caption?: string;
  /** The decision for this step, shown in a dashed callout beside the chain. */
  action?: string;
};

/** Fields shared by every section, regardless of kind — the spine of the discriminated union. */
type SectionBase = {
  /** Optional sub-heading rendered above the section body. */
  heading?: string;
};

/**
 * One block of a topic article. The `kind` discriminant drives the renderer: each kind maps to exactly
 * one component, so the render dispatcher (`Record<Section["kind"], …>`) stays exhaustive by construction
 * — add a kind here and the dispatcher won't type-check until it handles it. Grow the union as a topic
 * demands a new primitive (a `diagram` kind for trees/heaps is the obvious next one).
 */
export type Section = SectionBase &
  (
    | { kind: "prose"; body: string }
    | { kind: "code"; lang: SupportedLanguage; source: string; caption?: string }
    | { kind: "complexity"; rows: ComplexityRow[] }
    | {
        kind: "graph";
        /** Node ids; also used as the rendered labels. The renderer auto-lays them on a circle (no coordinates). */
        nodes: string[];
        edges: GraphEdge[];
        /** Draw arrowheads (directed graph). Omit/false for an undirected graph. */
        directed?: boolean;
        caption?: string;
      }
    | {
        kind: "matrix";
        rowLabels: string[];
        colLabels: string[];
        /** `cells[i][j]` is the entry for row `i`, col `j`. Must be `rowLabels.length × colLabels.length`. */
        cells: (number | boolean)[][];
        caption?: string;
      }
    | {
        kind: "walkthrough";
        /** The sequence being scanned — one cell per entry. */
        lane: (string | number)[];
        /** Draw a faint 0-based index under each cell (for index-returning problems like two-sum). */
        showIndices?: boolean;
        frames: WalkthroughFrame[];
      }
    | {
        kind: "gridWalkthrough";
        /** The 2-D board being scanned — frames default to this state unless a frame overrides `grid`. */
        grid: (string | number)[][];
        /** Draw faint 0-based row/col index labels (for grid problems reasoned about by coordinate). */
        showIndices?: boolean;
        frames: GridWalkthroughFrame[];
      }
    | {
        kind: "listWalkthrough";
        /** The linked-list node values, head-first. The trailing `null` terminator is drawn automatically. */
        nodes: (string | number)[];
        /** Draw faint 0-based node-position labels under each node (for index-reasoned list problems). */
        showIndices?: boolean;
        frames: ListWalkthroughFrame[];
      }
    /** A bulleted aside in one of three tones — pitfalls (warn), corner cases (info), interview tips (tip). */
    | { kind: "callout"; tone: CalloutTone; items: string[] }
    /**
     * A two-tier practice list. `essential` problems render as full rows (title + difficulty); `recommended`
     * render as compact chips. Both are problem ids resolved against the bank — unknown ids degrade gracefully.
     */
    | { kind: "practice"; essential: string[]; recommended?: string[] }
    /** Linked learning resources, grouped visually by `type` (article / video / doc). */
    | { kind: "resources"; items: ResourceItem[] }
    | {
        kind: "exampleProblem";
        /** A problem `id` from the bank; resolved to a summary + deep-linked to `/problems/[id]`. */
        problemId: string;
        note?: string;
      }
    /** Layout primitive: render child blocks in a row (side by side on wide screens, stacked when narrow). */
    | { kind: "row"; blocks: Section[] }
  );

/** Every section kind, derived from the union so the render dispatcher and any per-kind map stay in sync. */
export type SectionKind = Section["kind"];

/**
 * The canonical parts every topic article is built from. Declared as a union (so `parent` can reference a
 * sibling key) and pinned to the registry below via `satisfies`, which makes the layout exhaustive — every
 * part has exactly one label and nesting rule, defined once rather than re-typed as headings per topic.
 */
export type ArticlePartKey =
  | "definition"
  | "operations"
  | "whenToUse"
  | "techniques"
  | "relatedStructures"
  | "implementation"
  | "example"
  | "pitfalls"
  | "cornerCases"
  | "practice"
  | "resources";

export type ArticlePartDetail = {
  label: string;
  /** When set, this part renders as a subsection nested under the named parent (which precedes it here). */
  parent?: ArticlePartKey;
};

/**
 * The article layout, in render order. A part's position + `parent` drive how the renderer lays it out, so
 * a topic supplies only *content* per part — never headings or ordering. Mirrors the `FACETS` registry posture.
 */
export const ARTICLE_PARTS = {
  definition: { label: "Definition" },
  operations: { label: "Operations", parent: "definition" },
  whenToUse: { label: "When to use" },
  techniques: { label: "Techniques", parent: "whenToUse" },
  relatedStructures: { label: "Related structures", parent: "whenToUse" },
  implementation: { label: "Implementation" },
  example: { label: "Worked examples" },
  pitfalls: { label: "Things to look out for" },
  cornerCases: { label: "Corner cases" },
  practice: { label: "Practice" },
  resources: { label: "Learning resources" },
} as const satisfies Record<ArticlePartKey, ArticlePartDetail>;

/**
 * Catalog tags. DSA topics reuse the problem taxonomy (`TopicTag`) so a topic tagged `hash-table` shares a
 * vocabulary with the problems it links; technology topics use coarser cross-cutting domain tags (a topic
 * like Redis is tagged `caching` / `backend`, not an algorithmic tag).
 */
export type LearnTag =
  | TopicTag
  | "database"
  | "caching"
  | "backend"
  | "frontend"
  | "rendering"
  | "scalability"
  | "networking"
  | "api";

/**
 * How strongly an interview candidate should prioritize a topic — the study-plan ordering axis, *not* difficulty
 * (difficulty is a property of the practice problems a topic links). Optional during rollout; promote to required
 * once every topic is graded.
 */
export type Priority = "high" | "mid" | "low";

/** A reference link, rendered in the article's Sources footer. */
export type Source = { label: string; url: string };

/**
 * A learning article. `parts` is keyed content: omit a part that doesn't apply; render order and nesting
 * come from `ARTICLE_PARTS`, not the key order here. `sources` renders as a small footer on the article.
 */
export type LearnTopic = {
  slug: string;
  title: string;
  category: LearnCategory;
  /** One-liner for the landing card and search index. */
  summary: string;
  tags?: LearnTag[];
  /** Study-plan priority (see {@link Priority}). Optional during rollout. */
  priority?: Priority;
  /** Rough time to study the topic, in minutes — feeds the study-plan time budget. */
  estimatedMinutes?: number;
  parts: Partial<Record<ArticlePartKey, Section[]>>;
  sources?: Source[];
};

/** Client-safe projection for the landing grid + search — the body sections stay out of the list payload. */
export type TopicSummary = Pick<LearnTopic, "slug" | "title" | "category" | "summary" | "tags">;
