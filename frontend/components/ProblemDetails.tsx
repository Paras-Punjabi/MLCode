"use client";
import { Button } from "@/components/ui/button";
import { MdOpenInNew } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ProblemSession, type Problem } from "@/lib/types";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import useAxios from "@/hooks/useAxios";
import axiosInstance from "@/configs/axios.config";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const { user, isSignedIn, isLoaded } = useUser();
  const [isSessionActive, setIsSessionActive] = useState<
    "loading" | "active" | "not-active"
  >("loading");
  const [{}, fetchCurrentSessions] = useAxios(
    {
      url: `/services/containers/currentSession`,
      method: "POST",
    },
    { manual: true, useCache: true, autoCancel: false },
  );

  useEffect(() => {
    if (!isSignedIn && isLoaded) return;
    if (!isLoaded || !user.id) return;
    (async () => {
      const { data } = await fetchCurrentSessions({
        data: { userId: user.id },
      });
      const inactive =
        data.data.filter(
          (item: ProblemSession) => item.problemSlug === problem.problemSlug,
        ).length === 0;
      setIsSessionActive(inactive ? "not-active" : "active");
    })();
  }, [isSignedIn, user, isLoaded, fetchCurrentSessions, problem.problemSlug]);

  const requestSession = async () => {
    const { data: sessionData } = await axiosInstance.post(
      "/services/containers/requestSession",
      {
        userId: user?.id,
        problemSlug: problem.problemSlug,
      },
    );
    if (sessionData.success) {
      toast.success(sessionData.message);
      setIsSessionActive("active");
    } else {
      toast.error(sessionData.message);
    }
  };

  const deleteSession = async () => {
    const { data: sessionData } = await axiosInstance.post(
      "/services/containers/deleteSession",
      {
        userId: user?.id,
        problemSlug: problem.problemSlug,
      },
    );
    if (sessionData.success) {
      toast.success(sessionData.message);
      setIsSessionActive("not-active");
    } else {
      toast.error(sessionData.message);
    }
  };

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
            {isSessionActive === "not-active" && (
              <Button
                variant={"secondary"}
                onClick={requestSession}
                className="cursor-pointer flex items-center gap-2"
              >
                <span className="flex items-center">Start Session</span>
                <MdOpenInNew className="self-center" />
              </Button>
            )}
            {isSessionActive === "active" && (
              <Button
                onClick={deleteSession}
                className="bg-red-800 hover:bg-red-900 text-white cursor-pointer"
              >
                <span className="flex items-center">Stop Session</span>
                <MdOpenInNew className="self-center" />
              </Button>
            )}
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
