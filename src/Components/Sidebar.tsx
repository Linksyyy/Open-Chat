"use client";
import useUser from "@/Contexts/userContext";
import useChatStore from "@/Contexts/chatContext";
import useNotificationStore from "@/Contexts/notificationContext";
import { useState } from "react";
import { FaPlus, FaUsers, FaCheck, FaTimes } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { socket } from "@/lib/socket";
import { useSocket } from "@/lib/useSocket";
import { ChatWithMembers, NotificationWithDetails } from "@/db/queries";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";

export default function Sidebar() {
  const { username, created_at } = useUser();
  const { chats, addChat } = useChatStore();
  const { notifications, setNotifications, addNotification, removeNotification } = useNotificationStore();
  const { setChatName, setMessages } = useActualChatMessages();
  const [view, setView] = useState<"chats" | "notifications" | "create-group">(
    "chats",
  );
  const [groupName, setGroupName] = useState("");

  const enteredAt = new Date(created_at);

  function handleCreateGroup() {
    if (!groupName.trim()) return;
    socket.emit("create-group", groupName);
    setGroupName("");
    setView("chats");
  }

  function handleChatClick(chat: ChatWithMembers) {
    setMessages([]);
    setChatName({ id: chat.id, name: chat.name });
    socket.emit("get-chat-messages", chat.id);
    socket.emit("join-chat", chat.id);
  }

  function handleAcceptInvite(notificationId: string) {
    socket.emit("accept-invite", notificationId);
  }

  function handleDeclineInvite(notificationId: string) {
    socket.emit("decline-invite", notificationId);
  }

  useSocket("group-created", (group) => {
    addChat(group as ChatWithMembers);
  });

  useSocket("notifications", (notifications) => {
    setNotifications(notifications as NotificationWithDetails[]);
  });

  useSocket("new-notification", (notification) => {
    addNotification(notification as NotificationWithDetails);
  });

  useSocket("notification-deleted", (notificationId) => {
    removeNotification(notificationId as string);
  });

  return (
    <aside className="flex flex-col h-dvh w-full md:w-80 shrink-0 border-r border-p-2/20 bg-p-1">
      <div className="flex flex-col h-full pt-5 px-4 md:px-6">
        {/*Navigation Tabs*/}
        <nav className="flex justify-around py-5 items-center">
          <button
            onClick={() => setView("chats")}
            className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 group relative ${
              view === "chats" ? "bg-s-1 text-white shadow-lg shadow-s-1/20" : "bg-p-2/50 text-neutral-400 hover:bg-p-2"
            }`}
          >
            <FaUsers className="size-5 group-hover:text-white" />
          </button>
          <button
            onClick={() => setView("notifications")}
            className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 group relative ${
              view === "notifications" ? "bg-s-1 text-white shadow-lg shadow-s-1/20" : "bg-p-2/50 text-neutral-400 hover:bg-p-2"
            }`}
          >
            <FaBell className="size-5 group-hover:text-white" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] size-4 rounded-full flex items-center justify-center border-2 border-p-1">
                {notifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView("create-group")}
            className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 group ${
              view === "create-group" ? "bg-s-1 text-white shadow-lg shadow-s-1/20" : "bg-p-2/50 text-neutral-400 hover:bg-p-2"
            }`}
          >
            <FaPlus className="size-5 group-hover:text-white" />
          </button>
        </nav>

        {/*Content Area*/}
        <main className="bg-p-0 my-4 p-4 flex-1 rounded-3xl overflow-y-auto scrollbar-hide border border-p-2/10 shadow-inner">
          {view === "create-group" ? (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold px-1">Create Group</h2>
              <input
                type="text"
                placeholder="Chat name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-p-1 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-s-1/50 transition-all border border-transparent focus:border-s-1/30"
              />
              <button
                onClick={handleCreateGroup}
                className="bg-s-1 hover:bg-s-0 text-white p-3 rounded-2xl transition-all font-semibold shadow-md active:scale-95 cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={() => setView("chats")}
                className="text-sm text-neutral-500 hover:text-s-1 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          ) : view === "chats" ? (
            <div className="animate-in fade-in slide-in-from-left-2 duration-200">
              <h2 className="text-xl font-bold mb-4 text-p-3 px-1">Chats</h2>
              <div className="flex flex-col gap-1">
                {chats.length > 0 ? (
                  chats.map((chat, i) => (
                    <button
                      key={chat.id || i}
                      className="w-full text-left flex items-center transition-all duration-200 hover:bg-p-1 active:bg-p-2 rounded-2xl p-3 group cursor-pointer border border-transparent hover:border-p-2/20"
                      onClick={() => handleChatClick(chat)}
                    >
                      <div className="size-10 rounded-xl bg-s-1/10 flex items-center justify-center mr-3 group-hover:bg-s-1/20 transition-colors">
                        <span className="text-s-1 font-bold">{chat.name[0].toUpperCase()}</span>
                      </div>
                      <h2 className="font-semibold text-base text-foreground truncate">
                        {chat.name}
                      </h2>
                    </button>
                  ))
                ) : (
                  <p className="text-neutral-400 text-sm text-center py-10 italic">
                    No chats found
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-2 duration-200">
              <h2 className="text-xl font-bold mb-4 text-p-3 px-1">Notifications</h2>
              <div className="flex flex-col gap-3">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="bg-p-1/50 p-4 rounded-2xl flex flex-col gap-3 border border-p-2/20"
                    >
                      <p className="text-sm text-foreground leading-relaxed">
                        <span className="font-bold text-s-1">{n.sender.username}</span> invited you to join{" "}
                        <span className="font-bold">{n.chat.name}</span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptInvite(n.id)}
                          className="flex-1 bg-s-1 hover:bg-s-0 text-white text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold shadow-sm active:scale-95 cursor-pointer"
                        >
                          <FaCheck size={12} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(n.id)}
                          className="flex-1 bg-p-2/40 hover:bg-p-2 text-foreground text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold active:scale-95 cursor-pointer"
                        >
                          <FaTimes size={12} />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400 text-sm text-center py-10 italic">No notifications</p>
                )}
              </div>
            </div>
          )}
        </main>

        {/*User info*/}
        <footer className="w-full flex flex-col py-6 items-center border-t border-p-2/10 mt-auto">
          <p className="text-foreground font-semibold">{username}</p>
          <p className="text-foreground-1 text-[11px] uppercase tracking-tighter opacity-70">
            Joined {enteredAt.toLocaleDateString("pt-br")}
          </p>
        </footer>
      </div>
    </aside>
  );
}
