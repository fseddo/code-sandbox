import { notFound } from "next/navigation";
import { getTopic } from "@/learn/data/topics";
import { listProblemSummaries, type ProblemSummary } from "@/problems/data/problems";
import { LearnArticle } from "@/learn/article/LearnArticle";

const GuideTopicPage = async ({ params }: { params: Promise<{ track: string; slug: string }> }) => {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const problemsById: Record<string, ProblemSummary> = Object.fromEntries(
    listProblemSummaries().map((problem) => [problem.id, problem]),
  );

  return <LearnArticle topic={topic} problemsById={problemsById} />;
};

export default GuideTopicPage;
