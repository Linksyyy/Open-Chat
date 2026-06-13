"use client";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import useChatInfoStore from "@/Contexts/chatInfoContext";
import { socket } from "@/lib/socket";
import { useState } from "react";
import { FaUserPlus, FaTimes } from "react-icons/fa";

export default function ChatInfo() {
  const { name, id } = useActualChatMessages();
  const { setIsOpen } = useChatInfoStore();
  const [inviteUsername, setInviteUsername] = useState("");

  function handleInvite() {
    if (!inviteUsername.trim() || !id) return;
    socket.emit("send-invite", { chatId: id, username: inviteUsername });
    setInviteUsername("");
  }

  return (
    <div className="h-full w-80 bg-p-1 border-l border-p-2 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Chat Info</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-neutral-400 hover:text-foreground transition-colors cursor-pointer"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="bg-p-0 p-4 rounded-2xl shadow-xs">
        <p className="text-sm text-neutral-400 mb-1">Name</p>
        <p className="text-lg font-semibold text-foreground">{name}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
          Invite Member
        </h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Username"
            value={inviteUsername}
            onChange={(e) => setInviteUsername(e.target.value)}
            className="bg-p-0 p-3 rounded-xl outline-none text-foreground border border-transparent focus:border-s-1 transition-all"
          />
          <button
            onClick={handleInvite}
            className="bg-s-1 hover:bg-s-0 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-sm cursor-pointer"
          >
            <FaUserPlus />
            Send Invite
          </button>
        </div>
      </div>

      <div className="mt-auto p-4 bg-p-2/30 rounded-2xl border border-p-2">
        <p className="text-xs text-neutral-500 text-center italic">
          More features coming soon
        </p>
      </div>
    </div>
  );
}
