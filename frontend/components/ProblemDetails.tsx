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
import { CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

const getProblemStatusColor = (problemStatus: string) => {
  switch (problemStatus) {
    case "Solved":
      return "text-emerald-500";
    default:
      return "text-[#F59E0B]";
  }
};

function getSessionURL(sessionId: string) {
  if (!sessionId) return "";
  const url = new URL(process.env.NEXT_PUBLIC_BACKEND_URL!);
  url.pathname = `/notebook/${sessionId}/lab`;
  return url;
}

function getReactComponentAccordingToPodStatus(
  podStatus: string,
  sessionId: string,
) {
  switch (podStatus) {
    case "Pending":
      return (
        <Button className="bg-yellow-600 hover:bg-yellow-700  cursor-not-allowed">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Setting Up Environment
          </span>
        </Button>
      );
    case "Running":
      return (
        <Link href={getSessionURL(sessionId)} target="_blank" rel="noreferrer">
          <Button className="bg-green-800 hover:bg-green-900 text-white cursor-pointer">
            <span className="flex items-center">Open Session</span>
            <MdOpenInNew className="self-center" />
          </Button>
        </Link>
      );
    default:
      return <></>;
  }
}

const ProblemDetails = ({
  problem,
  problemStatus,
  submitSubmission,
}: {
  problem: Problem;
  problemStatus: string;
  submitSubmission: () => Promise<void>;
}) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isSessionActive, setIsSessionActive] = useState<
    "loading" | "active" | "not-active"
  >("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [podStatus, setPodStatus] = useState<string>("");
  const [{}, fetchPodStatus] = useAxios(
    {
      url: `/services/containers/podStatus`,
      method: "POST",
    },
    { manual: true, useCache: true, autoCancel: false },
  );
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
      const currenSession = data.data.filter(
        (item: ProblemSession) => item.problemSlug === problem.problemSlug,
      );
      if (currenSession.length > 0) setSessionId(currenSession[0].sessionId);
      setIsSessionActive(currenSession.length === 0 ? "not-active" : "active");
    })();
  }, [isSignedIn, user, isLoaded, fetchCurrentSessions, problem.problemSlug]);

  useEffect(() => {
    if (!sessionId) return;

    let isRunning = false;
    let intervalId: NodeJS.Timeout | null = null;
    let isStillMounted = true;

    const pollPodStatus = async () => {
      if (isRunning) return; // Prevent duplicate calls

      isRunning = true;
      try {
        const { data } = await fetchPodStatus({
          data: { sessionId },
        });
        console.log(data);
        if (data.success && isStillMounted) {
          setPodStatus(data.data.currentStatus);
          if (data.data.currentStatus === "Running" && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } finally {
        isRunning = false;
      }
    };

    // Poll immediately on mount
    pollPodStatus();

    // Start interval after initial poll
    intervalId = setInterval(() => {
      pollPodStatus();
    }, 1000);

    return () => {
      isStillMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, fetchPodStatus]);

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
      // Always reset to Pending first for new sessions
      setPodStatus("Pending");
      setSessionId(sessionData.data.sessionId);
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
            <span
              className={`items-center rounded-full border px-3 py-1 text-base font-semibold transition-colors ${getDifficultyColor(problem.problemLevel)}`}
            >
              {problem.problemLevel}
            </span>
          </div>
          {problemStatus.length !== 0 && (
            <div
              className={`flex items-center gap-2 flex-wrap ${getProblemStatusColor(problemStatus)}`}
            >
              <span>
                {problemStatus === "Solved" ? <CheckCircle2 /> : <Clock />}
              </span>
              <span>{problemStatus}</span>
            </div>
          )}
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
              <>
                <Button
                  onClick={submitSubmission}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <span>Submit</span>
                  <AiOutlineCloudUpload />
                </Button>
                <Button
                  onClick={deleteSession}
                  className="bg-red-800 hover:bg-red-900 text-white cursor-pointer"
                >
                  <span className="flex items-center">Stop Session</span>
                </Button>
                {sessionId &&
                  getReactComponentAccordingToPodStatus(podStatus, sessionId)}
              </>
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
