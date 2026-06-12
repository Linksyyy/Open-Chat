import useUser from "@/Contexts/userContext";
import useActualChatMessages from "@/Contexts/actualChatMessagesContext";
import ChatInput from "./ChatInput";
import { useSocket } from "@/lib/useSocket";
import { Messages } from "@/db/queries";

export default function Chat() {
  const userStore = useUser();
  const { name, messages, setMessages } = useActualChatMessages();

  useSocket("chat-messages", (messages) => {
    setMessages(messages as Messages);
  });

  return (
    <div className="h-full w-full flex flex-col bg-p-1 p-4 md:p-8">
      <div className="flex-1 w-full bg-p-0 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
        {name && (
          <div className="p-4 border-b border-p-2 bg-p-0 z-10">
            <h1 className="text-xl font-bold text-foreground">{name}</h1>
          </div>
        )}
        <div className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
          <div className="mt-auto h-4" />
          {messages.map((message, i) => {
            const isMe = message.sender_id === userStore.id;
            return (
              <div
                key={i}
                className={`max-w-[80%] w-fit px-4 py-2 rounded-2xl text-[15px] leading-relaxed break-all whitespace-pre-wrap overflow-hidden
                ${
                  isMe
                    ? "bg-s-1 text-white self-end rounded-br-sm"
                    : "bg-p-2 text-foreground self-start rounded-bl-sm"
                }`}
              >
                {message.content}
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
  );
}
