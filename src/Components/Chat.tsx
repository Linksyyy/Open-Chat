import useUser from "@/Contexts/userContext";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import ChatInput from "./ChatInput";
import { useSocket } from "@/lib/useSocket";
import { Message } from "@/db/queries";
import { useEffect, useRef } from "react";
import { FaInfoCircle, FaChevronLeft } from "react-icons/fa";
import useChatInfoStore from "@/Contexts/chatInfoContext";
import ChatInfo from "./ChatInfo";

export default function Chat() {
  const userStore = useUser();
  const { id: chatId, name, messages, setMessages, addMessage, setChatName } = useActualChatMessages();
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
      <div className="flex-1 h-full flex flex-col p-0 md:p-6 overflow-hidden">
        <div className="flex-1 w-full bg-p-0 md:rounded-3xl shadow-xs flex flex-col overflow-hidden relative border-x md:border border-p-2/10">
          {name && (
            <header className="p-3 md:p-4 border-b border-p-2/20 bg-p-0/80 backdrop-blur-md z-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChatName({ id: "", name: "" })}
                  className="md:hidden p-2 text-neutral-400 hover:text-s-1 transition-colors cursor-pointer active:scale-90"
                >
                  <FaChevronLeft size={20} />
                </button>
                <div className="flex flex-col justify-center">
                  <h1 className="text-base md:text-lg font-bold text-foreground truncate max-w-[200px] md:max-w-md">{name}</h1>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-p-1 ${
                  isOpen ? "text-s-1 bg-s-1/10" : "text-neutral-400 hover:text-foreground"
                }`}
              >
                <FaInfoCircle size={22} />
              </button>
            </header>
          )}
          
          <div
            ref={scrollRef}
            className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide scroll-smooth"
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
                  key={message.id || i}
                  className={`group max-w-[85%] md:max-w-[70%] w-fit px-4 py-2.5 rounded-2xl text-[14px] md:text-[15px] leading-relaxed break-all whitespace-pre-wrap shrink-0 flex flex-col shadow-xs transition-transform duration-200 hover:scale-[1.01]
                  ${
                    isMe
                      ? "bg-s-1 text-white self-end rounded-br-none"
                      : "bg-p-1 text-foreground self-start rounded-bl-none"
                  }`}
                >
                  {!isMe && (
                    <span className="text-[10px] font-bold mb-1 opacity-60 uppercase tracking-tighter">
                      {message.sender?.username || "User"}
                    </span>
                  )}
                  <span>{message.content}</span>
                  <span
                    className={`text-[9px] mt-1 self-end font-medium opacity-50 ${
                      isMe ? "text-white" : "text-neutral-500"
                    }`}
                  >
                    {time}
                  </span>
                </div>
              );
            })}
            <div className="h-4 shrink-0" />
          </div>

          <footer className="p-3 md:p-4 bg-p-0 border-t border-p-2/10">
            <ChatInput />
          </footer>
        </div>
      </div>
      {isOpen && chatId && <ChatInfo />}
    </div>
  );
}
