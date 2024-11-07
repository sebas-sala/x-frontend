import { toast } from "sonner";
import { create } from "zustand";

import { createSelectors } from ".";

import { likePost, unlikePost } from "~/services/post";

import { ApiError } from "~/lib/api-utils";
import { Post } from "~/types/post";

type State = {
  fypPosts: Post[];
  followingPosts: Post[];
};

type Actions = {
  like: (entityId: string) => Promise<void>;
  unlike: (entityId: string) => Promise<void>;
  setFypPosts: (fypPosts: Post[]) => void;
  setFollowingPosts: (followingPosts: Post[]) => void;
};

function updatePosts(
  posts: Post[],
  entityId: string,
  isLiked: boolean,
  delta: number,
) {
  return posts.map((post) => {
    if (post.id === entityId) {
      return {
        ...post,
        isLiked,
        likesCount: post.likesCount ? post.likesCount + delta : delta,
      };
    }
    return post;
  });
}

export const usePost = create<State & Actions>((set) => ({
  fypPosts: [],
  followingPosts: [],
  setFypPosts: (fypPosts: Post[]) => set({ fypPosts }),
  setFollowingPosts: (followingPosts: Post[]) => set({ followingPosts }),
  like: async (entityId: string) => {
    set((state) => ({
      fypPosts: updatePosts(state.fypPosts, entityId, true, 1),
      followingPosts: updatePosts(state.followingPosts, entityId, true, 1),
    }));

    try {
      await likePost(entityId);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);

        if (error.status === 404) throw error;
      } else {
        toast.error("An error occurred");
      }

      set((state) => ({
        fypPosts: updatePosts(state.fypPosts, entityId, false, -1),
        followingPosts: updatePosts(state.followingPosts, entityId, false, -1),
      }));

      throw error;
    }
  },
  unlike: async (entityId: string) => {
    set((state) => ({
      fypPosts: updatePosts(state.fypPosts, entityId, false, -1),
      followingPosts: updatePosts(state.followingPosts, entityId, false, -1),
    }));

    try {
      await unlikePost(entityId);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);

        if (error.status === 404) throw error;
      } else {
        toast.error("An error occurred");
      }

      set((state) => ({
        fypPosts: updatePosts(state.fypPosts, entityId, true, 1),
        followingPosts: updatePosts(state.followingPosts, entityId, true, 1),
      }));

      throw error;
    }
  },
}));

export const usePostStore = createSelectors(usePost);
