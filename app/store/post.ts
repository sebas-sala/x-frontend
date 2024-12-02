import { toast } from "sonner";
import { create } from "zustand";

import { createSelectors } from "./selectors";

import { likePost, unlikePost } from "~/services/post";

import { ApiError } from "~/lib/api-utils";

type State = {};

type Actions = {
  like: (entityId: string) => Promise<void>;
  unlike: (entityId: string) => Promise<void>;
};

// function updatePosts(
//   posts: Post[],
//   entityId: string,
//   isLiked: boolean,
//   delta: number,
// ) {
//   return posts.map((post) => {
//     if (post.id === entityId) {
//       return {
//         ...post,
//         isLiked,
//         likesCount: post.likesCount ? post.likesCount + delta : delta,
//       };
//     }
//     return post;
//   });
// }

export const usePost = create<State & Actions>((set) => ({
  like: async (entityId: string) => {
    try {
      await likePost(entityId);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);

        if (error.status === 404) throw error;
      } else {
        toast.error("An error occurred");
      }

      throw error;
    }
  },
  unlike: async (entityId: string) => {
    try {
      await unlikePost(entityId);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);

        if (error.status === 404) throw error;
      } else {
        toast.error("An error occurred");
      }

      throw error;
    }
  },
}));

export const usePostStore = createSelectors(usePost);
