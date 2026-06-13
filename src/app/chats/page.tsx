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
  const { id: chatId, setMessages, setChatName } = useActualChatMessages();
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
    <div className="flex h-dvh w-screen font-sans bg-p-1 overflow-hidden antialiased selection:bg-s-1/30 selection:text-s-3">
      <div className={`${chatId ? "hidden md:flex" : "flex"} w-full md:w-auto shrink-0 transition-all duration-300 ease-in-out`}>
        <Sidebar />
      </div>
      <main className={`${!chatId ? "hidden md:flex" : "flex"} flex-1 min-w-0 bg-p-1 transition-all duration-300 ease-in-out`}>
        <Chat />
      </main>
    </div>
  );
}
