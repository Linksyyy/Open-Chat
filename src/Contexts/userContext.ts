import { create } from "zustand";

export type UserStore = {
  id: string;
  username: string;
  created_at: string;

  setUser: (user: { id: string; username: string; created_at: string }) => void;
};

export default create<UserStore>((set) => ({
  id: "",
  username: "",
  created_at: "",

  setUser: (user) =>
    set({
      ...user,
    }),
}));
