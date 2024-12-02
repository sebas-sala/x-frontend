import { create } from "zustand";
import type { User } from "~/types/user";
import { createSelectors } from "./selectors";

type State = {
  isLogged: boolean;
  currentUser: User | null;
};

type Actions = {
  logout: () => void;
  login: (user: User) => void;
  setCurrentUser: (user: User | undefined) => void;
  setIsLogged: (isLogged: boolean) => void;
};

export const useAuth = create<State & Actions>((set) => ({
  isLogged: false,
  setIsLogged: (isLogged) => set({ isLogged }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: undefined }),
}));

export const useAuthStore = createSelectors(useAuth);
