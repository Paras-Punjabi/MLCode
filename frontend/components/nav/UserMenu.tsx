"use client"
import { SignOutButton, UserAvatar } from "@clerk/nextjs";
import Link from 'next/link'
import { LucideLogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth.context";

const userLinks: {
  label: string;
  href: string;
  role?: string;
}[] = [
    { label: "Admin", href: "/admin" },
    { label: "Profile", href: "/profile" },
  ]

export default function UserMenu() {
  const { user } = useAuth()
  if (!user) return
  const { username, fullName } = user

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
      <PopoverContent align="end" className="border-0 p-0 bg-transparent border-none rounded-md mt-2 max-w-64">
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
                <div>{fullName}</div>
                <div className="text-accent">@{username}</div>
              </div>
            </div>
            <div className="border-b pb-2 mb-2 flex flex-col gap-2 items-stretch">
              {userLinks.filter(({ role }) => true).map(l => (
                <Button asChild key={l.href} variant="secondary" size="sm">
                  <Link href={l.href}>{l.label}</Link>
                </Button>
              ))}
            </div>
            <SignOutButton>
              <Button variant="outline" className="cursor-pointer flex items-center gap-1 w-full">
                <LucideLogOut />
                <span className="text-sm leading-none">Logout</span>
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}


