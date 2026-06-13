"use client";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import { socket } from "@/lib/socket";
import React, { useEffect, useState } from "react";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const chat = useActualChatMessages();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMessage(""), []);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!message.trim() || !chat?.id) return;

    socket.emit("send-message", chat.id, message);
    setMessage("");
  }

  return (
    <form
      className="flex w-full items-center gap-2 pt-4 pb-2"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        className="flex-1 bg-p-2 text-foreground px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-s-1 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-p-1"
        disabled={!chat.id}
        placeholder={chat.id ? "Type a message..." : "Select a chat to start messaging"}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!chat.id || !message.trim()}
        className="bg-s-1 hover:bg-s-0 disabled:bg-p-2 disabled:text-neutral-500 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer shadow-sm disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}
