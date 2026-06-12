import useUser from "@/Contexts/userContext";
import ChatInput from "./ChatInput";

const messages = [
  { content: "10", sender_id: "other" },
  { content: "9", sender_id: "019ea9ff-25c7-7289-bf32-42de3c4d75c6" },
  { content: "8", sender_id: "other" },
  { content: "7", sender_id: "019ea9ff-25c7-7289-bf32-42de3c4d75c6" },
  { content: "6", sender_id: "other" },
  { content: "5", sender_id: "019ea9ff-25c7-7289-bf32-42de3c4d75c6" },
  { content: "4", sender_id: "other" },
  { content: "3", sender_id: "019ea9ff-25c7-7289-bf32-42de3c4d75c6" },
  { content: "2", sender_id: "other" },
  {
    content:
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    sender_id: "019ea9ff-25c7-7289-bf32-42de3c4d75c6",
  },
];

export default function Chat() {
  const userStore = useUser();
  return (
    <div className="h-full w-full flex flex-col bg-p-1 p-4 md:p-8">
      <div className="flex-1 w-full bg-p-0 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
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
