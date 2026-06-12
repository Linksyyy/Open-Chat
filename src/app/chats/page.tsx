"use client";
import Sidebar from "@/Components/Sidebar";
import useUser from "@/Contexts/userContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/Components/Chat";
import { socket } from "@/lib/socket";

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

    if (!socket.connected) {
      socket.auth = { userId: user.id };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen font-sans bg-p-0 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Chat />
      </div>
    </div>
  );
}
