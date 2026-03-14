"use client";
import { SignOutButton, UserAvatar } from "@clerk/nextjs";
import Link from "next/link";
import { LucideLogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth.context";
import { UserResource } from "@clerk/types";

async function isAdmin(user: UserResource): Promise<boolean> {
  if (!user) return false;
  const data = await user.getOrganizationMemberships();
  if (
    data.data.length > 0 &&
    data.data.filter((item) => item.roleName == "Admin").length > 0
  )
    return true;
  return false;
}

export default function UserMenu() {
  const { user } = useAuth();
  const userLinks = [{ label: "Profile", href: "/profile" }];
  const adminLinks = [{ label: "Admin", href: "/admin" }];

  if (!user) return;
  return (
    <Popover>
      <PopoverTrigger>
        <UserAvatar
          appearance={{
            elements: {
              userAvatarBox: {
                width: "36px",
                height: "36px",
                cursor: "pointer",
              },
            },
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-0 p-0 bg-transparent border-none rounded-md mt-2 max-w-64"
      >
        <Card className="rounded-md p-0">
          <CardContent className="p-4">
            <div className="border-b pb-2 mb-2 flex flex-row gap-2 items-center">
              <UserAvatar
                appearance={{
                  elements: {
                    userAvatarBox: {
                      width: "48px",
                      height: "48px",
                      cursor: "pointer",
                    },
                  },
                }}
              />
              <div className="font-medium">
                <div>{user.fullName}</div>
                <div className="text-accent">@{user.username}</div>
              </div>
            </div>
            <div className="border-b pb-2 mb-2 flex flex-col gap-2 items-stretch">
              {userLinks.map((l) => (
                <Button asChild key={l.href} variant="secondary" size="sm">
                  <Link href={l.href}>{l.label}</Link>
                </Button>
              ))}
              {isAdmin(user).then(
                (value: boolean) =>
                  value &&
                  adminLinks.map((l) => (
                    <Button asChild key={l.href} variant="secondary" size="sm">
                      <Link href={l.href}>{l.label}</Link>
                    </Button>
                  )),
              )}
            </div>
            <SignOutButton>
              <Button
                variant="outline"
                className="cursor-pointer flex items-center gap-1 w-full"
              >
                <LucideLogOut />
                <span className="text-sm leading-none">Logout</span>
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
