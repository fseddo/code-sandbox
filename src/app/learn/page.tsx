import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { listTopicSummaries } from "@/learn/data/topics";
import { LearnCatalog } from "@/learn/catalog/LearnCatalog";

const LearnHome = () => (
  <div className="flex h-screen flex-col">
    <AppHeader crumb="Learn" />
    <div className="flex min-h-0 flex-1">
      <Suspense fallback={null}>
        <LearnCatalog topics={listTopicSummaries()} />
      </Suspense>
    </div>
  </div>
);

export default LearnHome;
