import type { Section, SectionKind } from "@/learn/data/topic";
import type { ProblemSummary } from "@/problems/data/problems";
import { ProseSection } from "./sections/ProseSection";
import { CodeSection } from "./sections/CodeSection";
import { ComplexityTable } from "./sections/ComplexityTable";
import { MatrixGrid } from "./sections/MatrixGrid";
import { GraphDiagram } from "./sections/GraphDiagram";
import { WalkthroughDiagram } from "./sections/WalkthroughDiagram";
import { GridWalkthroughDiagram } from "./sections/GridWalkthroughDiagram";
import { NodeChainDiagram } from "./sections/NodeChainDiagram";
import { CalloutSection } from "./sections/CalloutSection";
import { PracticeList } from "./sections/PracticeList";
import { ResourceList } from "./sections/ResourceList";
import { ExampleProblemLink } from "./sections/ExampleProblemLink";

type SectionRendererProps = {
  section: Section;
  problemsById: Record<string, ProblemSummary>;
};

/** Dispatch a section to its renderer. The `switch` is exhaustive — a new `Section` kind won't compile until handled. */
const renderBody = ({ section, problemsById }: SectionRendererProps) => {
  switch (section.kind) {
    case "prose":
      return <ProseSection section={section} />;
    case "code":
      return <CodeSection section={section} />;
    case "complexity":
      return <ComplexityTable section={section} />;
    case "graph":
      return <GraphDiagram section={section} />;
    case "matrix":
      return <MatrixGrid section={section} />;
    case "walkthrough":
      return <WalkthroughDiagram section={section} />;
    case "gridWalkthrough":
      return <GridWalkthroughDiagram section={section} />;
    case "listWalkthrough":
      return <NodeChainDiagram section={section} />;
    case "callout":
      return <CalloutSection section={section} />;
    case "practice":
      return <PracticeList section={section} problemsById={problemsById} />;
    case "resources":
      return <ResourceList section={section} />;
    case "exampleProblem":
      return <ExampleProblemLink section={section} problem={problemsById[section.problemId]} />;
    case "row":
      return (
        <div className="grid gap-x-8 gap-y-8 rounded-lg border border-border bg-muted/20 p-6 sm:grid-cols-2 sm:items-start">
          {section.blocks.map((block, index) => (
            <SectionRenderer key={index} section={block} problemsById={problemsById} />
          ))}
        </div>
      );
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
};

/** Figure kinds render their own heading (so heading + media + caption stay one aligned stack); others get it here. */
const SELF_TITLED: readonly SectionKind[] = ["graph", "matrix"];

export const SectionRenderer = (props: SectionRendererProps) => (
  <div className="space-y-2">
    {props.section.heading && !SELF_TITLED.includes(props.section.kind) && (
      <h4 className="text-sm font-medium text-foreground">{props.section.heading}</h4>
    )}
    {renderBody(props)}
  </div>
);
