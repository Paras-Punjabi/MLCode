"use client"
import React from "react";
import AuthProvider from "./contexts/auth.context";
import { ClerkProvider } from "@clerk/nextjs";

export const Providers: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <ClerkProvider>
      <AuthProvider>
        {props.children}
      </AuthProvider>
    </ClerkProvider>
  )
}
