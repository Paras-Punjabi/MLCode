export interface Problem {
  problemId: string;
  problemNumber: number;
  problemName: string;
  problemSlug: string;
  problemDesc: string;
  problemTags: string;
  problemLevel: string;
}

export interface ProblemSession {
  userId: string | undefined;
  problemSlug: string | undefined;
  sessionId: string | undefined;
}
