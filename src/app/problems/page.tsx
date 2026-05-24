import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { listProblemSummaries } from "@/problems/data/problems";
import { ProblemCatalog } from "@/problems/catalog/ProblemCatalog";

const Problems = () => {
  const problems = listProblemSummaries();

  return (
    <div className="flex h-screen flex-col">
      <AppHeader crumb="Problems" />
      <Suspense fallback={null}>
        <ProblemCatalog problems={problems} />
      </Suspense>
    </div>
  );
};

export default Problems;
