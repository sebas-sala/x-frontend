import { usePostStore } from "~/store/post";
import { useUserStore } from "~/store/user";

export type IUsePostInteractions = ReturnType<typeof usePostInteractions>;

export const usePostInteractions = () => {
  const block = useUserStore().block;

  const follow = useUserStore().follow;
  const unfollow = useUserStore().unfollow;

  const like = usePostStore().like;
  const unlike = usePostStore().unlike;

  return {
    block,
    follow,
    unfollow,
    like,
    unlike,
  };
};
