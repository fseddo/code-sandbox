import { notFound } from "next/navigation";
import { getProblem, toClientProblem } from "@/judge/problems";
import { JudgeWorkspace } from "@/judge/JudgeWorkspace";

const ProblemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  // Strip hidden tests at the server boundary so they never reach the client component's props.
  return (
    <main className="h-screen w-screen overflow-hidden">
      <JudgeWorkspace problem={toClientProblem(problem)} />
    </main>
  );
};

export default ProblemPage;
