import { create } from "zustand";
import { createSelectors } from ".";

import { Notification } from "~/types/notification";
import { Pagination } from "~/types";

type State = {
  pagination: Pagination | Record<string, never>;
  notifications: Notification[];
};

type Actions = {
  addManyNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  setPagination: (pagination: Pagination) => void;
  removeNotification: (id: string) => void;
};

export const useNotification = create<State & Actions>((set) => ({
  pagination: {},
  notifications: [],
  setPagination: (pagination) => set({ pagination }),
  addManyNotifications: (notifications) =>
    set((state) => ({
      notifications: [...state.notifications, ...notifications],
    })),

  addNotification: (notification) =>
    set((state) => {
      let existingNotification = null;

      if (notification.id) {
        existingNotification = state.notifications.find(
          (n) => n.id === notification.id,
        );
      } else {
        existingNotification = state.notifications.find(
          (n) =>
            n.type === notification.type &&
            n.sender === "system" &&
            n.receivers[0].id === notification.receivers[0].id,
        );
      }

      if (!existingNotification) {
        return {
          notifications: [...state.notifications, notification],
        };
      }

      return state;
    }),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export const useNotificationStore = createSelectors(useNotification);
