import { AppHeader } from "@/components/AppHeader";
import { listProblemSummaries } from "@/judge/problems";
import { ProblemCatalog } from "@/judge/ProblemCatalog";

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
