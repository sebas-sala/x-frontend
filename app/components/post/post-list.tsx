import { Loader } from "lucide-react";
import { useInfiniteScroll } from "react-continous-scroll";

import { PostItem } from "./post-item";

import type { Post } from "~/types/post";
import type { Pagination } from "~/types";

interface Props {
  posts: Post[];
  pagination: Pagination;
  fetchMore: (page: number) => Promise<Post[]>;
  maxPage?: number;
}

export function PostList({ posts, pagination, fetchMore, maxPage }: Props) {
  const { data, loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData: posts,
    loadMore: pagination?.hasNextPage,
    onLoadMore: () => fetchMore(pagination.page + 1),
    maxPage,
  });

  async function onClick() {
    console.log("clicked");
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <PostItem key={post.id} post={post} onClick={onClick} />
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
