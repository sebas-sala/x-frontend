import { toast } from "sonner";
import { create } from "zustand";
import { Heart, Bookmark, BarChart2, MessageCircle } from "lucide-react";

import { createSelectors } from ".";

import { likePost } from "~/services/post";

import type { ActionProps } from "~/types/actions";
import { ApiError } from "~/lib/api-utils";

type State = {
  actions: ActionProps[];
};

export const usePost = create<State>(() => ({
  actions: [
    {
      name: "Comment",
      icon: () => <MessageCircle size={16} />,
    },
    {
      name: "Like",
      icon: () => <Heart size={16} />,
      handleAction: async (entityId: string) => {
        try {
          await likePost(entityId);
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error(error.message);
          } else {
            toast.error("An error occurred");
          }
        }
      },
    },
    {
      name: "Views",
      icon: () => <BarChart2 size={16} />,
    },
    {
      name: "Bookmark",
      icon: () => <Bookmark size={16} />,
    },
  ],
}));

export const usePostStore = createSelectors(usePost);
