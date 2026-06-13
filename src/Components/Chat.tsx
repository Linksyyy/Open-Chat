import useUser from "@/Contexts/userContext";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import ChatInput from "./ChatInput";
import { useSocket } from "@/lib/useSocket";
import { Message } from "@/db/queries";
import { useEffect, useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";
import useChatInfoStore from "@/Contexts/chatInfoContext";
import ChatInfo from "./ChatInfo";

export default function Chat() {
  const userStore = useUser();
  const { id: chatId, name, messages, setMessages, addMessage } = useActualChatMessages();
  const { isOpen, setIsOpen } = useChatInfoStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useSocket("chat-messages", (messages) => {
    setMessages(messages as Message[]);
  });

  useSocket("message-sended", (message) => {
    addMessage(message as Message);
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full w-full flex bg-p-1">
      <div className="flex-1 h-full flex flex-col p-4 md:p-8 overflow-hidden">
        <div className="flex-1 w-full bg-p-0 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
          {name && (
            <div className="p-4 border-b border-p-2 bg-p-0 z-10 flex justify-between items-center">
              <h1 className="text-xl font-bold text-foreground">{name}</h1>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`transition-colors cursor-pointer ${
                  isOpen ? "text-s-1" : "text-neutral-400 hover:text-foreground"
                }`}
              >
                <FaInfoCircle size={22} />
              </button>
            </div>
          )}
          <div
            ref={scrollRef}
            className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide scroll-smooth"
          >
            <div className="mt-auto" />
            {messages.map((message, i) => {
              const isMe = message.sender_id === userStore.id;
              const time = message.created_at
                ? new Date(message.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={i}
                  className={`max-w-[80%] w-fit px-4 py-2 rounded-2xl text-[15px] leading-relaxed break-all whitespace-pre-wrap shrink-0 flex flex-col
                  ${
                    isMe
                      ? "bg-s-1 text-white self-end rounded-br-sm"
                      : "bg-p-2 text-foreground self-start rounded-bl-sm"
                  }`}
                >
                  <span>{message.content}</span>
                  <span
                    className={`text-[10px] text-foreground-1 mt-1 self-end opacity-70 ${
                      isMe ? "text-white" : "text-neutral-500"
                    }`}
                  >
                    {time}
                  </span>
                </div>
              );
            })}
            <div className="h-32 shrink-0" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 bg-linear-to-t from-p-0 via-p-0/90 to-transparent backdrop-blur-sm pointer-events-none">
            <div className="pointer-events-auto pt-8">
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
      {isOpen && chatId && <ChatInfo />}
    </div>
  );
}
