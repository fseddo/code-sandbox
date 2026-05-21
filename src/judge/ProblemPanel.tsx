import { Fragment } from "react";
import type { Problem } from "./problem";
import { DifficultyBadge } from "./DifficultyBadge";

const stringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

/** Renders one paragraph, turning `…` backtick spans into inline code. */
const Paragraph = ({ text }: { text: string }) => (
  <p className="text-sm leading-relaxed text-muted-foreground">
    {text.split("`").map((segment, index) =>
      index % 2 === 1 ? (
        <code key={index} className="rounded bg-muted px-1 py-0.5 text-[0.8125rem] text-foreground">
          {segment}
        </code>
      ) : (
        <Fragment key={index}>{segment}</Fragment>
      ),
    )}
  </p>
);

export const ProblemPanel = ({ problem }: { problem: Problem }) => (
  <div className="flex h-full flex-col gap-6 overflow-auto bg-card p-5">
    <header className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold tracking-tight">{problem.title}</h1>
      <DifficultyBadge difficulty={problem.difficulty} />
    </header>

    <section className="flex flex-col gap-3">
      {problem.prompt.split("\n\n").map((block, index) => (
        <Paragraph key={index} text={block} />
      ))}
    </section>

    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Example cases</h2>
      <ul className="flex flex-col gap-2">
        {problem.tests.map((test, index) => (
          <li
            key={index}
            className="rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground"
          >
            <div className="text-muted-foreground">{test.name ?? `case ${index + 1}`}</div>
            <div>
              <span className="text-muted-foreground">in </span>
              {test.args.map(stringify).join(", ")}
            </div>
            <div>
              <span className="text-muted-foreground">out </span>
              {stringify(test.expected)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  </div>
);
