export interface Problem {
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

export interface Submission {
  userId: string;
  submissionId: string;
  problemSlug: string;
  status: string;
  input: string | undefined;
  output: string | undefined;
  expected: string | undefined;
  verdict: string;
  createdAt: string;
}
