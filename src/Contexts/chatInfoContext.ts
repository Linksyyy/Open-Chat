import { create } from "zustand";

export type ChatInfoStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const useChatInfoStore = create<ChatInfoStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useChatInfoStore;
