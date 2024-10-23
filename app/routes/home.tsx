import { useState } from "react";
import { json, useLoaderData } from "@remix-run/react";

import { Loader } from "lucide-react";
import { PostList } from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { useInfiniteScroll } from "~/hooks/use-infinite-scroll";

import type { Post } from "~/types/post";
import type { LoaderFunction } from "@remix-run/node";
import type { PaginatedResult } from "~/types";

export const loader: LoaderFunction = async () => {
  const postsResponse = await fetch(`${process.env.VITE_API_URL}/posts`);
  const postsJson = await postsResponse.json();

  return json({
    postsJson,
    apiUrl: process.env.VITE_API_URL,
  });
};

export default function Home() {
  const { postsJson, apiUrl } = useLoaderData<{
    postsJson: PaginatedResult<Post>;
    apiUrl: string;
  }>();
  const [postsMeta, setPostsMeta] = useState(postsJson.meta);

  const fetchMorePosts = async (page: number) => {
    const response = await fetch(`${apiUrl}/posts?page=${page}`);
    const posts: PaginatedResult<Post> = await response.json();

    setPostsMeta(posts.meta);

    return posts;
  };

  const {
    data: posts,
    loadMoreRef,
    loading,
  } = useInfiniteScroll<Post>({
    initialData: postsJson.data as Post[],
    page: postsMeta.pagination.page + 1,
    hasNextPage: postsMeta.pagination.hasNextPage,
    fetchMore: fetchMorePosts,
  });

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="relative">
        <Tabs defaultValue="fyp" className="w-full rounded-none relative">
          <TabsList className="rounded-none w-full bg-transparent px-0 h-full sticky top-0 border-b">
            <TabsTrigger
              value="fyp"
              className="flex-1 hover:bg-gray-950 rounded-none py-0 h-12 hover:text-gray-50"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex-1 hover:bg-gray-950 rounded-none hover:text-gray-50 h-12 active:bg-gray-950 active:text-gray-50
            "
            >
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="fyp">
            <PostList posts={posts} />
            <div ref={loadMoreRef} className="my-10 flex justify-center">
              {loading && <Loader size={32} className="animate-spin" />}
            </div>
          </TabsContent>
          <TabsContent value="following" className="px-4">
            Content 2
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
