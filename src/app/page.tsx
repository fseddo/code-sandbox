import { AppHeader } from "@/components/AppHeader";
import { listProblemSummaries } from "@/problems/data/problems";
import { ProblemCatalog } from "@/problems/catalog/ProblemCatalog";

const Home = () => {
  const problems = listProblemSummaries();

  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <ProblemCatalog problems={problems} />
    </div>
  );
};

export default Home;
