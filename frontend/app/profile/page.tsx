"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { FaUser } from "react-icons/fa";
import { SlNotebook } from "react-icons/sl";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/UserProfile";

const AccountSettings = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              Account Settings
            </h1>
          </div>

          <div className="flex gap-8">
            <div className="w-64 shrink-0">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="space-y-2">
                  <button className="cursor-pointer w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-700/50 flex items-center gap-3">
                    <span className="text-lg">
                      <FaUser />
                    </span>
                    <span>Profile</span>
                  </button>
                  <button className="cursor-pointer w-full text-left px-3 py-2 rounded-md text-slate-300 hover:bg-slate-700/50 flex items-center gap-3">
                    <span className="text-lg">
                      <SlNotebook />
                    </span>
                    <span>Notebooks</span>
                  </button>
                </CardContent>
              </Card>
            </div>

            {user && isLoaded && <UserProfile user={user} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
