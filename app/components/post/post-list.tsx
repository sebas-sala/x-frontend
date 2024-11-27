import { Loader } from "~/components/loader";
import { PostItem } from "~/components/post/post-item";

import { useInfinitePosts } from "~/hooks/use-infinite-posts";
import { usePostInteractions } from "~/hooks/use-post-interactions";

import type { Pagination } from "~/types";
import type { Post } from "~/types/post";

interface Props {
  initialData: Post[];
  pagination: Pagination;
  fetchMore: (page: number) => Promise<Post[]>;
}

export function PostList({ initialData, pagination, fetchMore }: Props) {
  const { block, follow, like, unfollow, unlike } = usePostInteractions();

  const { data, loadMore, loadMoreRef, loading } = useInfinitePosts({
    initialData,
    pagination,
    fetchMore,
  });

  return (
    <>
      {data && data.length > 0 ? (
        <ul>
          {data.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              follow={follow}
              unfollow={unfollow}
              like={like}
              unlike={unlike}
              block={block}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No posts found</p>
      )}

      <Loader ref={loadMoreRef} loading={loading} loadMore={loadMore}>
        <p className="text-gray-500">No more posts to load</p>
      </Loader>
    </>
  );
}
