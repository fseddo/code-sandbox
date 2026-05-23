import { notFound } from "next/navigation";
import { getProblem, problemNumber, toClientProblem, type ProblemId } from "@/problems/data/problems";
import { companiesForProblem } from "@/problems/data/companies";
import { AlgoWorkspace } from "@/problems/algo/AlgoWorkspace";
import { BuildLoader } from "./BuildLoader";

const ProblemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  // Catalog number + company associations live outside the problem module — resolve them server-side
  // and hand them to the workspace headers (the `id as ProblemId` cast is the registry's string↔id seam).
  const number = problemNumber(id);
  const companies = companiesForProblem(id as ProblemId);

  // Build problems are open-ended pad tasks (no hidden tests to strip); algo problems run in the judge.
  return (
    <main className="h-screen w-screen overflow-hidden">
      {problem.kind === "build" ? (
        <BuildLoader problem={problem} number={number} companies={companies} />
      ) : (
        <AlgoWorkspace problem={toClientProblem(problem)} number={number} companies={companies} />
      )}
    </main>
  );
};

export default ProblemPage;
