import { create } from "zustand";
import { type ChatWithMembers } from "@/db/queries";

export type ChatStore = {
  chats: ChatWithMembers[];
  setChats: (chats: ChatWithMembers[]) => void;
  addChat: (chat: ChatWithMembers) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
}));

export default useChatStore;
