import type { BuildProblem } from "@/problems/data/problem";
import { Prose } from "@/problems/shared/Prose";
import { CollapsiblePane } from "@/components/CollapsiblePane";
import { UnderlineTabs } from "@/components/UnderlineTabs";

type BuildProblemPanelProps = {
  problem: BuildProblem;
};

const TABS = ["description"] as const;
const TAB_LABEL = { description: "Description" } as const;

/** Top pane of a build problem's context rail: the prompt and the (human-judged) evaluation rubric. Identity lives in the title bar. */
export const BuildProblemPanel = ({ problem }: BuildProblemPanelProps) => (
  <CollapsiblePane
    id="prompt"
    expandToward="down"
    defaultSize="55%"
    minSize="6%"
    collapsedSize="6%"
    className="bg-card"
    header={
      <UnderlineTabs
        tabs={TABS}
        labelOf={TAB_LABEL}
        active="description"
        className="h-full"
        tabClassName="flex items-center px-3 text-xs tracking-wide uppercase"
      />
    }
  >
    <div className="flex h-full flex-col gap-6 overflow-auto p-5">
      <Prose text={problem.prompt} />

      {problem.evaluationNotes && problem.evaluationNotes.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            What we look for
          </h2>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-muted-foreground">
            {problem.evaluationNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground/70">
        This is an open-ended build task — there are no automated tests. Edit the sandbox and check
        the live preview.
      </p>
    </div>
  </CollapsiblePane>
);
