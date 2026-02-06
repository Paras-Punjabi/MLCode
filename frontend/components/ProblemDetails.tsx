import { Button } from "@/components/ui/button";
import { MdOpenInNew } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { type Problem } from "@/lib/types";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";

const getDifficultyColor = (problemLevel: string) => {
  switch (problemLevel) {
    case "EASY":
      return "text-emerald-500";
    case "MEDIUM":
      return "text-amber-500";
    case "HARD":
      return "text-rose-500";
    default:
      return "text-gray-400";
  }
};

const ProblemDetails = ({ problem }: { problem: Problem }) => {
  return (
    <div className="backdrop-blur-custom border border-white/10 shadow-2xl p-8 rounded-2xl mt-3 w-[95%] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-400 text-2xl font-mono">
              {problem.problemNumber}
            </span>
            <h2 className="text-3xl font-bold text-white tracking-wider">
              {problem.problemName}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`items-center rounded-full border px-3 py-1 text-base font-semibold transition-colors ${getDifficultyColor(problem.problemLevel)}`}
            >
              {problem.problemLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="my-6 h-px bg-white/10"></div>

      <div className="text-gray-300 leading-relaxed text-base space-y-4">
        <ReactMarkdown>{problem.problemDesc}</ReactMarkdown>
      </div>

      <div className="flex justify-between items-center">
        <div className="my-4 flex gap-2 items-center">
          {problem.problemTags.split(",").map((item, idx) => {
            return (
              <span
                key={idx}
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20 uppercase"
              >
                {item}
              </span>
            );
          })}
        </div>
        <div className="flex gap-2">
          <SignedIn>
            <Button className="cursor-pointer flex items-center gap-2">
              <span>Submit</span>
              <AiOutlineCloudUpload />
            </Button>
            <Button
              variant={"secondary"}
              className="cursor-pointer flex items-center gap-2"
            >
              <span className="flex items-center">Start Session</span>
              <MdOpenInNew className="self-center" />
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="cursor-pointer flex items-center gap-2">
                Login to Solve
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
