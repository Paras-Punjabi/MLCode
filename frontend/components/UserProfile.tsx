"use client";
import React, { useRef, useState } from "react";
import type { UserResource } from "@clerk/types";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const UserProfile = ({ user }: { user: UserResource }) => {
  const [name, setName] = useState<string>(user.fullName || "");
  const [username, setUsername] = useState<string>(user.username || "");
  const fileRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<File>();
  const [imageURL, setImageURL] = useState<string>(user.imageUrl);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveChanges = async () => {
    const nameArray: string[] = name.split(" ");
    let changes = 0;
    const updates: {
      firstName?: string;
      lastName?: string;
      username?: string;
    } = {};

    if (nameArray.length == 1) {
      updates.firstName = nameArray[0];
      changes++;
    } else if (nameArray.length > 0) {
      updates.firstName = nameArray[0];
      updates.lastName = nameArray.slice(1).join(" ");
      changes += 2;
    }

    if (username !== user?.username) {
      updates.username = username;
      changes++;
    }

    try {
      if (changes) await user?.update(updates);
      if (profileImage) {
        user?.setProfileImage({ file: profileImage });
      }
      toast.success("Profile Updated 🎉🎉", {
        position: "bottom-right",
        dismissible: true,
      });
    } catch (err) {
      console.log(err);
      toast.error("Error Occured ❌❌", {
        position: "bottom-right",
        dismissible: true,
      });
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords are not same ❌", {
        position: "bottom-right",
        dismissible: true,
      });
      return;
    }
    try {
      await user?.updatePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        signOutOfOtherSessions: true,
      });
      toast.success("Passwords changed successfully 🎉", {
        position: "bottom-right",
        dismissible: true,
      });
    } catch (err) {
      console.log(err);
      toast.error("Error Occured ❌❌", {
        position: "bottom-right",
        dismissible: true,
      });
    }
  };

  const selectProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length == 0) return;
    const file = e.target.files?.[0];
    const fr = new FileReader();
    fr.onloadend = () => {
      setImageURL(fr.result as string);
    };
    if (file) {
      setProfileImage(file);
      fr.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-8 mb-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={imageURL} alt={name} />
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileRef}
                  onChange={selectProfileImage}
                />
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <Camera
                    className="w-5 h-5 text-white"
                    onClick={() => {
                      if (fileRef) fileRef.current?.click();
                    }}
                  />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-xl text-white font-semibold">{name}</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-slate-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      disabled={true}
                      type="email"
                      value={
                        user?.primaryEmailAddress
                          ? String(user.primaryEmailAddress)
                          : ""
                      }
                      className="bg-slate-900/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <Button
                onClick={handleSaveChanges}
                className="cursor-pointer bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {user?.passwordEnabled && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form>
                <Label htmlFor="current-password" className="text-slate-300">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  placeholder="*********"
                />
              </form>
              <div>
                <Label htmlFor="new-password" className="text-slate-300">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  placeholder="*********"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-slate-300">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  placeholder="*********"
                />
              </div>
              {newPassword !== "" && (
                <span
                  className={`text-sm font-medium ${
                    newPassword === confirmPassword
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {newPassword === confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              )}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSavePassword}
                  className="cursor-pointer bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                >
                  Save Password
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default UserProfile;
