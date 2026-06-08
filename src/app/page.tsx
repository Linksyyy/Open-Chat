"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    token ? router.push("/chats") : router.push("/home");
  }, [router]);
  return <div></div>;
}
