"use client";
import Sidebar from "@/Components/Sidebar";
import useUser from "@/Contexts/userContext";
import useChatStore from "@/Contexts/chatContext";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/Components/Chat";
import { socket } from "@/lib/socket";
import { useSocket } from "@/lib/useSocket";
import { type ChatWithMembers, type Message } from "@/db/queries";

export default function Chats() {
  const userStore = useUser();
  const { setChats } = useChatStore();
  const { setMessages, setChatName } = useActualChatMessages();
  const router = useRouter();

  useSocket("init", (chats: unknown) => {
    setChats(chats as ChatWithMembers[]);
  });

  useSocket("chat-messages", (messages: unknown) => {
    setMessages(messages as Message[]);
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/home");
      return;
    }
    userStore.setUser(user);

    setMessages([]);
    setChatName({ id: "", name: "" });

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
