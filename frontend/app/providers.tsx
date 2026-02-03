"use client"
import React from "react";
import AuthProvider from "./contexts/auth.context";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const Providers: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <ClerkProvider>
      <AuthProvider>
        <Toaster />
        {props.children}
      </AuthProvider>
    </ClerkProvider>
  )
}
