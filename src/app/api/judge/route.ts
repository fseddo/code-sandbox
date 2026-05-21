import type { NextRequest } from "next/server";
import type { SupportedLanguage } from "@/judge/problem";
import { getProblem } from "@/judge/problems";
import { runSubmission } from "@/judge/runner/runSubmission";

// Worker threads + node:vm are Node-only; the Edge runtime can't host them.
export const runtime = "nodejs";

const LANGUAGES: SupportedLanguage[] = ["javascript", "typescript"];

type JudgeBody = { problemId?: unknown; language?: unknown; source?: unknown };

export const POST = async (request: NextRequest) => {
  const { problemId, language, source }: JudgeBody = await request.json().catch(() => ({}));

  if (typeof problemId !== "string" || typeof source !== "string" || typeof language !== "string") {
    return Response.json({ error: "Expected { problemId, language, source }." }, { status: 400 });
  }
  if (!LANGUAGES.includes(language as SupportedLanguage)) {
    return Response.json({ error: `Unsupported language: ${language}.` }, { status: 400 });
  }
  const problem = getProblem(problemId);
  if (!problem) {
    return Response.json({ error: `Unknown problem: ${problemId}.` }, { status: 404 });
  }

  const outcome = await runSubmission({ problem, language: language as SupportedLanguage, source });
  return Response.json(outcome);
};
