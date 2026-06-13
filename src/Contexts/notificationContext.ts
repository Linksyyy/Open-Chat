import { create } from "zustand";
import { type NotificationWithDetails } from "@/db/queries";

export type NotificationStore = {
  notifications: NotificationWithDetails[];
  setNotifications: (notifications: NotificationWithDetails[]) => void;
  addNotification: (notification: NotificationWithDetails) => void;
  removeNotification: (notificationId: string) => void;
};

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    })),
}));

export default useNotificationStore;
