import { Loader } from "lucide-react";
import { PostItem } from "./post-item";

import type { Post } from "~/types/post";
import type { PaginatedResult, Pagination } from "~/types";
import { useInfiniteScroll } from "~/hooks/use-infinite-scroll";

interface Props {
  posts: Post[];
  pagination: Pagination;
  fetchMore: (page: number) => Promise<PaginatedResult<Post>>;
}

export function PostList({ posts, pagination, fetchMore }: Props) {
  const { data, loadMoreRef, loading, hasNextPage } = useInfiniteScroll({
    initialData: posts,
    hasNextPage: pagination.hasNextPage,
    fetchMore: () => fetchMore(pagination.page + 1),
  });

  const uniquePosts = Array.from(new Set([...posts, ...data]));

  return (
    <div>
      <ul>
        {uniquePosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </ul>

      <div ref={loadMoreRef} className="my-10 flex justify-center">
        {loading && <Loader size={32} className="animate-spin" />}
        {!loading && !hasNextPage && (
          <p className="text-gray-500">No more posts to load</p>
        )}
      </div>
    </div>
  );
}
