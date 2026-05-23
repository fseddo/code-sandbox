import type { ProblemId } from "./problems";

/**
 * Companies a problem can be associated with. Single-source the slugs here and grow the union as the
 * sourcer finds new ones — the same posture as `TopicTag`. Kebab-case, matching the catalog's slugs.
 */
export type CompanyTag = "new-york-times";

/**
 * Company → the problems known to be asked there. This is the **one** place the company↔problem edge
 * is written: a problem module never carries its own company list, because the same problem is asked
 * at many companies and we don't want to re-edit a module each time one surfaces it.
 *
 * `ProblemId` values mean an association naming a problem the bank doesn't have is a compile error,
 * so the map can't drift ahead of the registry. `Partial` because a company can be known before any
 * of its problems are imported — the sourcer fills entries in as it authors them.
 */
export const companyProblems: Partial<Record<CompanyTag, readonly ProblemId[]>> = {
  "new-york-times": [
    "two-sum",
    "merge-intervals",
    "group-anagrams",
    "make-string-a-subsequence-using-cyclic-increments",
    "build-debounced-autocomplete",
  ],
};

/** Problems associated with a company, or `[]` if none have been imported yet. */
export const problemsForCompany = (company: CompanyTag): readonly ProblemId[] =>
  companyProblems[company] ?? [];

/** Reverse lookup: which companies a problem is associated with. Derived from the single map. */
export const companiesForProblem = (problemId: ProblemId): CompanyTag[] =>
  (Object.keys(companyProblems) as CompanyTag[]).filter((company) =>
    problemsForCompany(company).includes(problemId),
  );
