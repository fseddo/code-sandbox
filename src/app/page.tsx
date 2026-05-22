import Link from "next/link";
import { LuCode, LuPlus } from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";
import { RecentPads } from "@/components/RecentPads";
import { cn } from "@/lib/utils";
import { listProblemSummaries } from "@/judge/problems";
import { ProblemCatalog } from "@/judge/ProblemCatalog";

const Home = () => {
  const problems = listProblemSummaries();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <LuCode className="size-4 text-primary" />
            noodle
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Problems</h1>
        </div>
        <Link href="/pad" className={cn(buttonVariants({ variant: "outline" }))}>
          <LuPlus className="size-4" />
          New blank pad
        </Link>
      </header>

      <ProblemCatalog problems={problems} />

      <RecentPads />
    </main>
  );
};

export default Home;
