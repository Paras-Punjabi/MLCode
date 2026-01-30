"use client";
import { useParams } from "next/navigation";

const UserPublicProfile = () => {
  const { username } = useParams();
  console.log(username);
  return (
    <></>
  );
};

export default UserPublicProfile;
