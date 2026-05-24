import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getTopic } from "@/learn/data/topics";
import { listProblemSummaries, type ProblemSummary } from "@/problems/data/problems";
import { LearnArticle } from "@/learn/article/LearnArticle";

const TopicPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  // Resolve the problems a topic references server-side (the registry never crosses to the client),
  // keyed by id so the example-problem sections render a real title + difficulty.
  const problemsById: Record<string, ProblemSummary> = Object.fromEntries(
    listProblemSummaries().map((problem) => [problem.id, problem]),
  );

  return (
    <div className="flex h-screen flex-col">
      <AppHeader crumb={[{ label: "Learn", href: "/learn" }, { label: topic.title }]} />
      <div className="flex-1 overflow-auto">
        <LearnArticle topic={topic} problemsById={problemsById} />
      </div>
    </div>
  );
};

export default TopicPage;
