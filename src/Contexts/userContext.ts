import { create } from "zustand";

export type User = {
  id: string;
  username: string;
  created_at: string;
};

export type UserStore = User & {
  setUser: (user: { id: string; username: string; created_at: string }) => void;
  getUser: () => User;
};

const useUserStore = create<UserStore>((set, get) => ({
  id: "",
  username: "",
  created_at: "",

  setUser: (user) =>
    set({
      ...user,
    }),
  getUser: () => {
    const { id, username, created_at } = get();
    return { id, username, created_at };
  },
}));

export default useUserStore;
