import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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

  const [filteredData, setFilteredData] = useState<Post[]>(data);
  const previousData = useRef<Post[]>(data);

  useEffect(() => {
    previousData.current = data;
    setFilteredData(data);
  }, [data]);

  const handleBlock = async (userId: string) => {
    try {
      previousData.current = filteredData;

      setFilteredData((prevData) =>
        prevData.filter((post) => post.user.id !== userId),
      );

      await block(userId);

      toast.success("User blocked successfully");
    } catch (error) {
      setFilteredData(previousData.current);
      throw error;
    }
  };

  return (
    <>
      {filteredData && data.length > 0 ? (
        <ul>
          {filteredData.map((post) => {
            const uniqueId = Math.random().toString(36).substring(7);

            return (
              <PostItem
                key={`${uniqueId}-${post.id}`}
                post={post}
                follow={follow}
                unfollow={unfollow}
                like={like}
                unlike={unlike}
                block={handleBlock}
              />
            );
          })}
        </ul>
      ) : (
        <Loader ref={loadMoreRef} loading={loading} loadMore={loadMore}>
          <p className="text-gray-500">No more posts to load</p>
        </Loader>
      )}
    </>
  );
}
