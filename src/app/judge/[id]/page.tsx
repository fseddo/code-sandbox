import { notFound } from "next/navigation";
import { getProblem } from "@/judge/problems";
import { JudgeWorkspace } from "@/judge/JudgeWorkspace";

const ProblemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  return (
    <main className="h-screen w-screen overflow-hidden">
      <JudgeWorkspace problem={problem} />
    </main>
  );
};

export default ProblemPage;
