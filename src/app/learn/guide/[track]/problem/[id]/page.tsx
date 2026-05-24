import { notFound } from "next/navigation";
import { getProblem, listProblemSummaries, type ProblemSummary } from "@/problems/data/problems";
import { ProblemGuide } from "@/learn/guide/ProblemGuide";

const GuideProblemPage = async ({ params }: { params: Promise<{ track: string; id: string }> }) => {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  const problemsById: Record<string, ProblemSummary> = Object.fromEntries(
    listProblemSummaries().map((summary) => [summary.id, summary]),
  );

  return <ProblemGuide problem={problem} problemsById={problemsById} />;
};

export default GuideProblemPage;
