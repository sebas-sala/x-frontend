import { json, useLoaderData } from "@remix-run/react";

import PostList from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { useInfiniteScroll } from "~/hooks/use-infinite-scroll";

import type { Post } from "~/types/post";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const postsResponse = await fetch(`${process.env.VITE_API_URL}/posts`);
  const posts = (await postsResponse.json()) as Post[];

  return json({
    posts,
    apiUrl: process.env.VITE_API_URL,
  });
};

export default function Home() {
  const { posts, apiUrl } = useLoaderData<{ posts: Post[]; apiUrl: string }>();

  const fetchMorePosts = async (page: number) => {
    const response = await fetch(`${apiUrl}/posts?page=${page}`);
    const posts = await response.json();
    return posts;
  };

  const { data, loadMoreRef, loading } = useInfiniteScroll({
    initialData: posts,
    hasNextPage: false,
    fetchMore: fetchMorePosts,
  });

  const uniquePosts = Array.from(new Set(data.map((post) => post.id))).map(
    (id) => data.find((post) => post.id === id)
  );

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
            <PostList posts={uniquePosts} />
            <div ref={loadMoreRef} className="loading-trigger">
              {loading && <p>Loading more posts...</p>}
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
