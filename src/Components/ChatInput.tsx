"use client";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import { socket } from "@/lib/socket";
import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const chat = useActualChatMessages();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMessage(""), []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !chat?.id) return;

    socket.emit("send-message", chat.id, message);
    setMessage("");
  }

  return (
    <form
      className="flex w-full items-center gap-3"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 bg-p-1 text-foreground px-4 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full focus:outline-none focus:ring-2 focus:ring-s-1/30 transition-all border border-p-2/10 focus:border-s-1/50 text-sm md:text-base placeholder:text-neutral-500 shadow-inner disabled:opacity-50"
        disabled={!chat.id}
        placeholder={chat.id ? "Type a message..." : "Select a chat"}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!chat.id || !message.trim()}
        className="bg-s-1 hover:bg-s-0 disabled:bg-p-2 disabled:text-neutral-500 text-white p-3 md:px-7 md:py-3 rounded-xl md:rounded-full font-bold transition-all shadow-md hover:shadow-s-1/20 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
      >
        <IoSend className="md:hidden" size={20} />
        <span className="hidden md:inline">Send</span>
      </button>
    </form>
  );
}
