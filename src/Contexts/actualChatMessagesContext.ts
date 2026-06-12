import { create } from "zustand";
import { type Messages } from "@/db/queries";

type Message = Messages[number];

export type ActualChatStore = {
  id: string;
  name: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setChatName: (chat: { id: string; name: string }) => void;
};

const useActualChatMessages = create<ActualChatStore>((set) => ({
  id: "",
  name: "",
  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setChatName: (chat: { id: string; name: string }) => set({ ...chat }),
}));

export default useActualChatMessages;
