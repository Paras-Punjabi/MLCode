"use client";
import ProblemDetails from "@/components/ProblemDetails";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Submission, type Problem } from "@/lib/types";
import {
  notFound,
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useContext } from "react";
import SubmissionDetails from "@/components/SubmissionDetails";
import { AuthContext } from "@/contexts/auth.context";

const Problem = () => {
  const { problemSlug } = useParams();
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [problemStatus, setProblemStatus] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (searchParams.has("tab")) {
      if (searchParams.get("tab") === "submissions") return "Submissions";
    }
    return "Problem Statement";
  });
  const router = useRouter();
  const [{}, fetchProblem] = useAxios({}, { manual: true });
  const [{}, fetchSubmissions] = useAxios(
    {
      url: "/services/submissions/allSubmissions",
      method: "POST",
      data: {
        userId: user?.id,
        problemSlug: problemSlug,
      },
    },
    { manual: true },
  );

  useEffect(() => {}, []);

  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    const tabParam = newTab === "Submissions" ? "submissions" : "question";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabParam);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (!problemSlug) return;
    if (!user) return;
    (async () => {
      const { data: problemData } = await fetchProblem({
        url: `/services/problems/${problemSlug}`,
      });
      if (problemData.success) {
        setProblem(problemData.data);
      }
      const { data: submissionData } = await fetchSubmissions();
      if (submissionData.success) {
        setSubmissions(submissionData.data);
        if (submissionData.data.length !== 0) {
          setProblemStatus("Attempted");
          for (const item of submissionData.data) {
            if (item.status === "ACCEPTED") {
              setProblemStatus("Solved");
              break;
            }
          }
        }
      }
      setLoading(false);
    })();
  }, [problemSlug, fetchProblem, fetchSubmissions, user]);

  if (loading) {
    return <Loader />;
  }

  if (!loading && !problem) return notFound();

  return (
    <>
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="dark p-4 w-full"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="w-[85%]">
            <TabsTrigger
              className="cursor-pointer text-lg"
              value="Problem Statement"
            >
              Problem Statement
            </TabsTrigger>
            <SignedIn>
              <TabsTrigger
                className="cursor-pointer text-lg"
                value="Submissions"
              >
                Submissions
              </TabsTrigger>
            </SignedIn>
          </TabsList>
        </div>
        <TabsContent
          value="Problem Statement"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {problem && (
            <ProblemDetails problemStatus={problemStatus} problem={problem} />
          )}
        </TabsContent>
        <SignedIn>
          <TabsContent
            value="Submissions"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <SubmissionDetails submissions={submissions} />
          </TabsContent>
        </SignedIn>
      </Tabs>
    </>
  );
};

export default Problem;
