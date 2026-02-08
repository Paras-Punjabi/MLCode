"use client";
import ProblemDetails from "@/components/ProblemDetails";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { type Problem } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const Problem = () => {
  const { problemSlug } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [{}, fetchProblem] = useAxios({}, { manual: true });

  useEffect(() => {
    if (!problemSlug) return;
    (async () => {
      const { data } = await fetchProblem({
        url: `/services/problems/${problemSlug}`,
      });
      if (data.success) {
        setProblem(data.data);
      }
      setLoading(false);
    })();
  }, [problemSlug, fetchProblem]);

  if (loading) {
    return <Loader />;
  }

  if (!loading && !problem) return notFound();

  return (
    <>
      <Tabs defaultValue="Problem Statement" className="dark p-4 w-full">
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
          {problem && <ProblemDetails problem={problem} />}
        </TabsContent>
        <SignedIn>
          <TabsContent
            value="Submissions"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <span>Submissions Tab</span>
          </TabsContent>
        </SignedIn>
      </Tabs>
    </>
  );
};

export default Problem;
