import { Fragment } from "react";

/** Renders blank-line-separated paragraphs, turning `…` backtick spans into inline code. */
export const Prose = ({ text }: { text: string }) => (
  <div className="flex flex-col gap-3">
    {text.split("\n\n").map((block, blockIndex) => (
      <p key={blockIndex} className="text-sm leading-relaxed text-muted-foreground">
        {block.split("`").map((segment, index) =>
          index % 2 === 1 ? (
            <code
              key={index}
              className="rounded bg-muted px-1 py-0.5 text-[0.8125rem] text-foreground"
            >
              {segment}
            </code>
          ) : (
            <Fragment key={index}>{segment}</Fragment>
          ),
        )}
      </p>
    ))}
  </div>
);
