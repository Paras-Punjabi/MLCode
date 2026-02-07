import ProblemDetails from "@/components/ProblemDetails";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import axiosInstance from "@/configs/axios.config";
import { type Problem } from "@/lib/types";
import { notFound } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";

const Problem = async (props: PageProps<"/problems/[problemSlug]">) => {
  const { problemSlug } = await props.params;
  const { data } = await axiosInstance.get(`/services/problems/${problemSlug}`);
  const problem = data.data;
  if (!problem) {
    return notFound();
  }
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
          <ProblemDetails problem={problem} />
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
