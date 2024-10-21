import { create } from "zustand";
import type { User } from "~/types/user";
import { createSelectors } from ".";

type State = {
  currentUser: User | null;
};

type Actions = {
  login: (user: User) => void;
  logout: () => void;
};

export const useAuth = create<State & Actions>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}));

export const useAuthStore = createSelectors(useAuth);
