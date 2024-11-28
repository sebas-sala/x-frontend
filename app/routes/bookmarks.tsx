import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

import { PostList } from "~/components/post/post-list";

import { getPosts } from "~/services/post";
import { getSession } from "~/sessions";
import { usePostData } from "~/hooks/use-post-data";

import type { Post } from "~/types/post";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const token = session.get("token");

  try {
    const posts = await getPosts({
      token,
      filters: [{ by_bookmarked: true }],
    });

    return {
      postsResponse: posts,
    };
  } catch (error) {
    return redirect("/home?error=bokmarks_not_found");
  }
};

export default function Bookmarks() {
  const { postsResponse } = useLoaderData<typeof loader>();

  const { posts, pagination, fetchMorePosts } = usePostData({
    initialData: postsResponse.data as Post[],
    initialPagination: postsResponse.meta.pagination,
    filters: [{ by_bookmarked: true }],
  });

  return (
    <main>
      <h1 className="mb-4 mt-2 px-2 text-2xl font-bold text-gray-800">
        Bookmarks
      </h1>

      <PostList
        initialData={posts}
        pagination={pagination}
        fetchMore={fetchMorePosts}
      />
    </main>
  );
}
