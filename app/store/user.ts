import { toast } from "sonner";
import { create } from "zustand";

import { createSelectors } from ".";

import { ApiError, handleApiFetchError } from "~/lib/api-utils";
import { followUser, unfollowUser } from "~/services/user";

type State = {
  id?: string;
};

type Actions = {
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
};

export const useUser = create<State & Actions>(() => ({
  follow: async (userId) => {
    await handleApiFetchError(followUser(userId));
  },
  unfollow: async (userId) => {
    await handleApiFetchError(unfollowUser(userId));
  },
}));

export const useUserStore = createSelectors(useUser);
