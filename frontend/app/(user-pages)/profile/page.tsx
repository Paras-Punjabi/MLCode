"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Loader from "@/components/Loader";
import { FaUser } from "react-icons/fa";
import { SlNotebook } from "react-icons/sl";
import { Card, CardContent } from "@/components/ui/card";
import UserProfile from "@/components/UserProfile";
import NotebooksList from "@/components/NotebooksList";

type Tab = "profile" | "notebooks";

const VALID_TABS: Tab[] = ["profile", "notebooks"];

const AccountSettings = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab: Tab =
    rawTab && VALID_TABS.includes(rawTab as Tab) ? (rawTab as Tab) : "profile";

  const setActiveTab = (tab: Tab) => {
    router.push(`?tab=${tab}`, { scroll: false });
  };

  if (!isSignedIn && isLoaded) {
    return <RedirectToSignIn />;
  }

  if (!isLoaded) {
    return <Loader />;
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "notebooks", label: "Notebooks", icon: <SlNotebook /> },
  ];

  return (
    <>
      <div className="from-slate-900 via-purple-900 to-slate-900 page-gutter-x page-container">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              Account Settings
            </h1>
          </div>

          <div className="flex gap-8">
            {/* Sidebar nav */}
            <div className="w-64 shrink-0">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="space-y-1 pt-4">
                  {navItems.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`cursor-pointer w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                        activeTab === id
                          ? "bg-slate-700 text-white font-medium"
                          : "text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="text-lg">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Content panel */}
            <div className="flex-1 min-w-0">
              {activeTab === "profile" && user && <UserProfile user={user} />}

              {/* TODO: Render Notebooks component here */}
              {activeTab === "notebooks" && user && (
                <NotebooksList
                  isSignedIn={isSignedIn}
                  isLoaded={isLoaded}
                  userId={user.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
