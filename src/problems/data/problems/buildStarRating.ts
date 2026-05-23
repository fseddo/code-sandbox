import { defineBuildProblem } from "../problem";

const appStarter = `import { useState } from "react";
import "./App.css";

// TODO: build a reusable <StarRating /> component.
// - Renders \`max\` stars (default 5).
// - Clicking a star sets the rating; hovering previews it.
// - Controlled via \`value\` / \`onChange\`.

export default function App() {
  const [rating, setRating] = useState(0);
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Star Rating</h1>
      {/* <StarRating value={rating} onChange={setRating} /> */}
      <p>Current rating: {rating}</p>
    </main>
  );
}
`;

/**
 * A build problem — open-ended, solved in the pad sandbox, human-evaluated (no worker grading).
 * Demonstrates the build kind end-to-end; see [company-sourcing.md](../../../docs/features/company-sourcing.md).
 */
export const buildStarRating = defineBuildProblem({
  id: "build-star-rating",
  number: 16,
  title: "Build a Star Rating Component",
  difficulty: "easy",
  tags: [],
  prompt: [
    "Build a reusable `StarRating` component in React.",
    "It should render a row of stars (default `max` of 5). Clicking a star selects that rating; hovering over a star previews the rating up to it, and moving the mouse away restores the selected value.",
    "Make it controlled: accept a `value` and an `onChange(next)` callback. Keep the markup accessible — a keyboard user should be able to set a rating too.",
  ].join("\n\n"),
  template: "vite-react-ts",
  files: {
    "/src/App.tsx": { code: appStarter },
  },
  evaluationNotes: [
    "Component is controlled (`value` / `onChange`) rather than holding its own source of truth.",
    "Hover preview is distinct from the committed selection and resets on mouse-out.",
    "Keyboard accessible: focusable stars, arrow/enter handling, sensible ARIA roles.",
    "Stars are driven by `max` and render without hardcoding five.",
  ],
  source: { origin: "authored" },
});
