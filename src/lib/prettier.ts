/**
 * Shared Prettier front-end for the two editors that format code: the algo editor's single-function buffer
 * ([useAlgo](../problems/algo/useAlgo.ts), by language) and the pad's active file ([PadEditor](../pad/PadEditor.tsx),
 * by extension). Prettier and its plugins are **lazy-imported per call** so nothing ships in the main bundle.
 */

/** The Prettier parsers we support; each maps to a fixed set of plugins below. */
export type PrettierParser = "typescript" | "babel" | "json" | "css" | "scss" | "less" | "html";

const EXTENSION_PARSER: Record<string, PrettierParser> = {
  ts: "typescript",
  tsx: "typescript",
  js: "babel",
  jsx: "babel",
  mjs: "babel",
  cjs: "babel",
  json: "json",
  css: "css",
  scss: "scss",
  less: "less",
  html: "html",
};

/** The Prettier parser for a file path, or null when the extension isn't one we format. */
export const parserForPath = (path: string): PrettierParser | null => {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_PARSER[ext] ?? null;
};

/** Lazily load only the plugins a parser needs (estree is the printer for the JS/TS/JSON family). */
const pluginsFor = (parser: PrettierParser) => {
  switch (parser) {
    case "typescript":
      return Promise.all([import("prettier/plugins/estree"), import("prettier/plugins/typescript")]);
    case "babel":
    case "json":
      return Promise.all([import("prettier/plugins/estree"), import("prettier/plugins/babel")]);
    case "css":
    case "scss":
    case "less":
      return Promise.all([import("prettier/plugins/postcss")]);
    case "html":
      return Promise.all([
        import("prettier/plugins/html"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
        import("prettier/plugins/postcss"),
      ]);
  }
};

/** Format `source` with the given parser. Throws on a parse error — callers decide how to surface it. */
export const formatCode = async (source: string, parser: PrettierParser): Promise<string> => {
  const [{ format }, plugins] = await Promise.all([import("prettier/standalone"), pluginsFor(parser)]);
  return format(source, { parser, plugins });
};
