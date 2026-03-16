"use client";
import { useCallback, useEffect, useState } from "react";
import { SlNotebook } from "react-icons/sl";
import { IoReload } from "react-icons/io5";
import { LuPowerOff } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Notebook } from "@/lib/types";
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";
import useAxios from "@/hooks/useAxios";
import axiosInstance from "@/configs/axios.config";
import { toast } from "sonner";

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const NotebooksList = ({
  isSignedIn,
  isLoaded,
  userId,
}: {
  isSignedIn: boolean;
  isLoaded: boolean;
  userId: string;
}) => {
  const [sessions, setSessions] = useState<Notebook[]>([]);
  const [selectedProblemSlug, setSelectedProblemSlug] = useState<string | null>(
    null,
  );

  const [{}, fetchCurrentSessions] = useAxios(
    {
      url: `/services/containers/currentSession`,
      method: "POST",
    },
    { manual: true, useCache: true, autoCancel: false },
  );

  const fetchAndUpdateCurrentSessions = useCallback(async () => {
    const { data } = await fetchCurrentSessions({
      data: { userId: userId },
    });
    if (data.success) {
      setSessions(data.data);
      console.log(data.data);
    }
  }, [fetchCurrentSessions, userId]);

  useEffect(() => {
    if (!isSignedIn && isLoaded) return;
    if (!isLoaded || !userId) return;
    (async () => {
      await fetchAndUpdateCurrentSessions();
    })();
  }, [fetchAndUpdateCurrentSessions, isLoaded, isSignedIn, userId]);

  const handleTerminate = async () => {
    if (!selectedProblemSlug) return;
    const { data } = await axiosInstance.post(
      "/services/containers/deleteSession",
      {
        userId: userId,
        problemSlug: selectedProblemSlug,
      },
    );
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    await fetchAndUpdateCurrentSessions();
  };

  const confirmTarget = sessions.find(
    (s) => s.sessionId === selectedProblemSlug,
  );

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Active Notebooks
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {sessions.length} active session
              {sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <IoReload
            className="cursor-pointer "
            onClick={fetchAndUpdateCurrentSessions}
            size={20}
          />
        </div>

        {sessions.length === 0 && (
          <Card className="bg-slate-800/40 border-slate-700/60">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
              <SlNotebook className="text-slate-600 text-4xl" />
              <p className="text-slate-500 text-sm">No active notebooks</p>
            </CardContent>
          </Card>
        )}

        {sessions.map((notebook) => (
          <Card
            key={notebook.sessionId}
            className="bg-slate-800/50 border-slate-700/60 hover:border-slate-600/80 transition-colors group"
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div
                className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "hsl(168 47% 7% / 0.8)",
                  border: "1px solid hsl(174 69% 51% / 0.2)",
                }}
              >
                <SlNotebook
                  className="text-lg"
                  style={{ color: "hsl(174 69% 51%)" }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/problems/${notebook.problemSlug}?tab=question`}
                  target="_blank"
                  className="cursor-pointer flex items-center gap-2 flex-wrap"
                >
                  <span className="text-white font-medium text-sm truncate">
                    {slugToTitle(notebook.problemSlug)}
                  </span>
                  <MdOpenInNew className="self-center" />
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shrink-0"
                  >
                    Active
                  </Badge>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="default"
                onClick={() => setSelectedProblemSlug(notebook.problemSlug)}
                className="ml-auto cursor-pointer bg-red-500/20 hover:bg-red-500/20 border border-red-500/40  text-red-400 transition-all duration-200 gap-1.5 shadow-sm hover:shadow-red-500/20"
              >
                <LuPowerOff className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Terminate</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!selectedProblemSlug}
        onOpenChange={(open) => !open && setSelectedProblemSlug(null)}
      >
        <AlertDialogContent
          className="border-slate-700"
          style={{ backgroundColor: "hsl(168 47% 7%)" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Terminate session?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will end the{" "}
              <span className="text-slate-200 font-medium">
                {confirmTarget
                  ? slugToTitle(confirmTarget.problemSlug)
                  : "notebook"}
              </span>{" "}
              session. Are you sure you want to end the session ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedProblemSlug && handleTerminate()}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Yes, terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotebooksList;
