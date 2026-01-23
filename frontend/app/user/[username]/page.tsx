"use client";
import React from "react";
import { useParams } from "next/navigation";

const UserPublicProfile = () => {
  const { username } = useParams();
  console.log(username);
  return <></>;
};

export default UserPublicProfile;
