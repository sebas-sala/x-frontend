import { Loader } from "lucide-react";
import { useInfiniteScroll } from "react-continous-scroll";

import { PostItem } from "./post-item";

import { useUserStore } from "~/store/user";
import { usePostStore } from "~/store/post";

import type { Post } from "~/types/post";
import type { Pagination } from "~/types";

interface Props {
  posts: Post[];
  initialData: Post[];
  pagination: Pagination;
  fetchMore: (page: number) => Promise<Post[]>;
  maxPage?: number;
}

export function PostList({
  posts,
  initialData,
  pagination,
  fetchMore,
  maxPage,
}: Props) {
  const { loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData,
    loadMore: pagination?.hasNextPage,
    onLoadMore: () => fetchMore(pagination.page + 1),
    maxPage,
  });

  const follow = useUserStore().follow;
  const unfollow = useUserStore().unfollow;

  const like = usePostStore().like;
  const unlike = usePostStore().unlike;

  async function onClick() {
    console.log("clicked");
  }

  return (
    <>
      <ul>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            follow={follow}
            unfollow={unfollow}
            like={like}
            unlike={unlike}
            onClick={onClick}
          />
        ))}
      </ul>

      <div ref={loadMoreRef} className="my-10 flex justify-center">
        {loading && <Loader size={32} className="animate-spin" />}
        {!loading && !loadMore && (
          <p className="text-gray-500">No more posts to load</p>
        )}
      </div>
    </>
  );
}
