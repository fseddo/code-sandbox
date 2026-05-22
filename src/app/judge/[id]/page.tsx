import { notFound } from "next/navigation";
import { getProblem, toClientProblem } from "@/judge/problems";
import { JudgeWorkspace } from "@/judge/JudgeWorkspace";
import { BuildLoader } from "./BuildLoader";

const ProblemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  // Build problems are open-ended pad tasks (no hidden tests to strip); algo problems run in the judge.
  return (
    <main className="h-screen w-screen overflow-hidden">
      {problem.kind === "build" ? (
        <BuildLoader problem={problem} />
      ) : (
        <JudgeWorkspace problem={toClientProblem(problem)} />
      )}
    </main>
  );
};

export default ProblemPage;
