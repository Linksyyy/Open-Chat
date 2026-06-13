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
    <div className="flex flex-col h-screen w-2/10">
      <div className="h-full flex-col flex w-full bg-p-1 pt-5 px-8">
        {/*Navigation Tabs*/}
        <div className="w-full flex justify-around py-5 items-center">
          <button
            onClick={() => setView("chats")}
            className={`${
              view === "chats" ? "bg-s-1 text-white" : "bg-s-2 text-neutral-400"
            } hover:bg-s-1 p-2.5 rounded-4xl transition-all duration-100 hover:scale-115 group relative`}
          >
            <FaUsers className="group-hover:text-white" />
          </button>
          <button
            onClick={() => setView("notifications")}
            className={`${
              view === "notifications"
                ? "bg-s-1 text-white"
                : "bg-s-2 text-neutral-400"
            } hover:bg-s-1 p-2.5 rounded-4xl transition-all duration-100 hover:scale-115 group relative`}
          >
            <FaBell className="group-hover:text-white" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-p-1">
                {notifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView("create-group")}
            className={`${
              view === "create-group"
                ? "bg-s-1 text-white"
                : "bg-s-2 text-neutral-400"
            } hover:bg-s-1 p-2.5 rounded-4xl transition-all duration-100 hover:scale-115 group`}
          >
            <FaPlus className="group-hover:text-white" />
          </button>
        </div>

        {/*Content Area*/}
        <div className="bg-p-0 py-4 px-4 h-full w-full rounded-4xl overflow-y-auto">
          {view === "create-group" ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Create Chat</h2>
              <input
                type="text"
                placeholder="Chat name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-p-1 p-2 rounded-xl outline-none"
              />
              <button
                onClick={handleCreateGroup}
                className="bg-s-2 hover:bg-s-1 text-white p-2 rounded-xl transition-colors cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={() => setView("chats")}
                className="text-sm text-neutral-500 hover:text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : view === "chats" ? (
            <div>
              <h2 className="text-xl font-bold mb-4 text-p-3">Chats</h2>
              <div className="flex flex-col gap-2">
                {chats.length > 0 ? (
                  chats.map((chat, i) => (
                    <button
                      key={i}
                      className="w-full text-left flex flex-col transition-all duration-200 ease-in-out hover:bg-p-2 rounded-2xl p-3 group hover:scale-95 cursor-pointer"
                      onClick={() => handleChatClick(chat)}
                    >
                      <h2 className="font-semibold text-base text-foreground group-hover:text-foreground-1 transition-colors">
                        {chat.name}
                      </h2>
                    </button>
                  ))
                ) : (
                  <p className="text-neutral-400 text-sm text-center py-4">
                    No chats found
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4 text-p-3">Notifications</h2>
              <div className="flex flex-col gap-3">
                {notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="bg-p-1 p-3 rounded-2xl flex flex-col gap-2 shadow-sm border border-p-2/50"
                    >
                      <p className="text-sm text-foreground">
                        <span className="font-bold">{n.sender.username}</span> invited you to join{" "}
                        <span className="font-bold">{n.chat.name}</span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptInvite(n.id)}
                          className="flex-1 bg-s-1 hover:bg-s-0 text-white text-xs py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
                        >
                          <FaCheck size={10} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(n.id)}
                          className="flex-1 bg-p-2 hover:bg-p-3 text-foreground text-xs py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
                        >
                          <FaTimes size={10} />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400 text-sm">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/*User info*/}
        <div className="w-full flex flex-col py-5 justify-center items-center">
          <p className="text-foreground">Logged in as {username}</p>
          <p className="text-foreground-1 text-sm">
            Created at {enteredAt.toLocaleDateString("pt-br")}
          </p>
        </div>
      </div>
    </div>
  );
}
