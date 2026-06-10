"use client";
import Sidebar from "@/Components/Sidebar";
import useUser from "@/Contexts/userContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/Components/Chat";

export default function Chats() {
  const userStore = useUser();
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/home");
      return;
    }
    userStore.setUser(user);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen font-sans bg-p-0">
      <Sidebar />
      <Chat />
    </div>
  );
}
