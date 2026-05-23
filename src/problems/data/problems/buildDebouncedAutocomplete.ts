import { defineBuildProblem } from "../problem";

const appStarter = `import { useState } from "react";
import { searchHeadlines } from "./api";
import "./App.css";

// TODO: build a debounced autocomplete <Search /> input.
// - As the user types, query searchHeadlines(query) (it returns a Promise<string[]>).
// - Debounce the calls so a fast typist fires one request after they pause, not one per keystroke.
// - Render the results in a dropdown; ignore responses from stale (superseded) queries.
// - Handle the empty-query and "no results" states.

export default function App() {
  const [query, setQuery] = useState("");
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 480 }}>
      <h1>Headline Search</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search headlines…"
        style={{ width: "100%", padding: 8, fontSize: 16 }}
      />
      {/* Render the debounced result dropdown here. */}
    </main>
  );
}
`;

const apiStarter = `// A mock async data source standing in for a real search endpoint.
// Resolves after a randomized delay so out-of-order responses are observable.
const HEADLINES = [
  "Markets rally as inflation cools",
  "Mars rover sends back new images",
  "Local team wins championship in overtime",
  "New study links sleep and memory",
  "City council approves transit budget",
  "Climate summit ends with new accord",
  "Tech firms report record earnings",
  "Marathon route changes for spring race",
];

export function searchHeadlines(query: string): Promise<string[]> {
  const q = query.trim().toLowerCase();
  const results = q ? HEADLINES.filter((h) => h.toLowerCase().includes(q)) : [];
  const delay = 150 + Math.random() * 600;
  return new Promise((resolve) => setTimeout(() => resolve(results), delay));
}
`;

/**
 * A build problem — open-ended, solved in the pad sandbox, human-evaluated (no worker grading).
 * Sourced for NYTimes' front-end interview (machine-coding UI + debounce/async signals).
 */
export const buildDebouncedAutocomplete = defineBuildProblem({
  id: "build-debounced-autocomplete",
  number: 17,
  title: "Build a Debounced Autocomplete Search",
  difficulty: "medium",
  tags: [],
  prompt: [
    "Build an autocomplete `Search` input in React that queries an async data source as the user types.",
    "A `searchHeadlines(query): Promise<string[]>` function is provided in `./api` — it resolves after a randomized delay, so responses can arrive **out of order**.",
    "Requirements: debounce the input so a burst of keystrokes fires a single request after the user pauses (rather than one request per keystroke); render matching results in a dropdown below the input; and make sure a slow earlier response can never overwrite the results of a newer query (drop stale responses).",
    "Handle the empty-query state (no dropdown) and the no-results state. Keep it accessible — the input and option list should be navigable.",
  ].join("\n\n"),
  template: "vite-react-ts",
  files: {
    "/src/App.tsx": { code: appStarter },
    "/src/api.ts": { code: apiStarter },
  },
  evaluationNotes: [
    "Debounce is real: typing quickly fires one trailing request, not one per keystroke, and the timer is cleaned up (no leak on unmount).",
    "Stale-response handling: a slow older request resolving after a newer one does not clobber the displayed results (request id / abort / latest-query guard).",
    "Empty query clears results; no-results renders a distinct state rather than a blank dropdown.",
    "Result rendering is keyed correctly and the dropdown is keyboard-navigable with sensible ARIA roles.",
    "Debounce logic is factored out (custom hook or utility) rather than tangled inline in the component.",
  ],
  source: { origin: "authored" },
});
