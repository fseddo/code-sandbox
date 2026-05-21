import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { listProblems } from "@/judge/problems";
import { DifficultyBadge } from "@/judge/DifficultyBadge";

const JudgeIndex = () => {
  const problems = listProblems();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Problems</h1>
        <p className="text-muted-foreground">
          Pick a problem, write your solution, and run it against the test cases.
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {problems.map((problem) => (
          <li key={problem.id}>
            <Link
              href={`/judge/${problem.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary"
            >
              <span className="font-medium">{problem.title}</span>
              <DifficultyBadge difficulty={problem.difficulty} />
              <LuArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default JudgeIndex;
