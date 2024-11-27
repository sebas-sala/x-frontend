import { useState } from "react";
import { Loader } from "lucide-react";
import { useInfiniteScroll } from "react-continous-scroll";
import { json, redirect, useLoaderData } from "@remix-run/react";

import { PostItem } from "~/components/post/post-item";

import { useUserStore } from "~/store/user";
import { usePostStore } from "~/store/post";

import { getPosts } from "~/services/post";

import { getSession } from "~/sessions";

import type { Post } from "~/types/post";
import type { Pagination } from "~/types";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request);
  const token = session.get("token");

  try {
    const posts = await getPosts({
      token,
      filters: [{ by_bookmarked: true }],
    });

    return json({
      postsResponse: posts || [],
    });
  } catch (error) {
    return redirect("/home?error=bokmarks_not_found");
  }
};

export default function Bookmarks() {
  const { postsResponse } = useLoaderData<typeof loader>();

  const [pagination, setPagination] = useState<Pagination>(
    postsResponse.meta.pagination,
  );

  const fetchMore = async (page: number) => {
    try {
      const res = await getPosts({
        page,
        filters: [{ by_bookmarked: true }],
      });

      setPagination(res.meta?.pagination);

      return res.data;
    } catch (e) {
      return [];
    }
  };

  const { data, loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData: postsResponse.data as Post[],
    loadMore: pagination?.hasNextPage,
    onLoadMore: () => fetchMore(pagination.page + 1),
  });

  const block = useUserStore().block;

  const follow = useUserStore().follow;
  const unfollow = useUserStore().unfollow;

  const like = usePostStore().like;
  const unlike = usePostStore().unlike;

  return (
    <main>
      <h1 className="mb-4 mt-2 px-2 text-2xl font-bold text-gray-800">
        Bookmarks
      </h1>

      {data && data.length > 0 ? (
        <ul>
          {data.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              follow={follow}
              unfollow={unfollow}
              block={block}
              like={like}
              unlike={unlike}
            />
          ))}
        </ul>
      ) : (
        <div>
          <p>No bookmarks yet</p>
        </div>
      )}

      {!loading && loadMore && (
        <div ref={loadMoreRef} className="my-10 flex justify-center">
          {loading && <Loader size={32} className="animate-spin" />}
          {!loading && !loadMore && (
            <p className="text-gray-500">No more posts to load</p>
          )}
        </div>
      )}
    </main>
  );
}

export function PostList({ children }: { children: React.ReactNode }) {
  return <ul>{children}</ul>;
}
