import { create } from "zustand";

import { createSelectors } from "./selectors";

import { handleApiFetchError } from "~/lib/api-utils";
import {
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
} from "~/services/user";

type State = {
  id?: string;
};

type Actions = {
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
  block: (userId: string) => Promise<void>;
  unblock: (userId: string) => Promise<void>;
};

export const useUser = create<State & Actions>(() => ({
  follow: async (userId) => {
    await handleApiFetchError(followUser(userId));
  },
  unfollow: async (userId) => {
    await handleApiFetchError(unfollowUser(userId));
  },
  block: async (userId) => {
    await handleApiFetchError(blockUser(userId));
  },
  unblock: async (userId) => {
    await handleApiFetchError(unblockUser(userId));
  },
}));

export const useUserStore = createSelectors(useUser);
