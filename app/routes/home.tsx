import { useState } from "react";
import { json, useLoaderData } from "@remix-run/react";

import { PostList } from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import type { Post } from "~/types/post";
import type { LoaderFunction } from "@remix-run/node";
import type { PaginatedResult } from "~/types";

export const loader: LoaderFunction = async () => {
  const postsResponse = await fetch(`${process.env.VITE_API_URL}/posts`);
  const postsJson = await postsResponse.json();

  const postsByFollowingsResponse = await fetch(
    `${process.env.VITE_API_URL}/posts?by_following=true`
  );
  const postsByFollowingsJson = await postsByFollowingsResponse.json();

  return json({
    postsJson,
    postsByFollowingsJson,
  });
};

export default function Home() {
  const { postsJson, postsByFollowingsJson } = useLoaderData<{
    postsJson: PaginatedResult<Post>;
    postsByFollowingsJson: PaginatedResult<Post>;
  }>();

  const [postsFypResponse, setPostsFypResponse] = useState<
    PaginatedResult<Post>
  >(postsJson as PaginatedResult<Post>);

  const [postsFollowingResponse, setPostsFollowingResponse] = useState<
    PaginatedResult<Post>
  >(postsByFollowingsJson as PaginatedResult<Post>);

  const fetchMorePosts = async (
    page: number,
    filters?: Record<string, string | number | boolean>[]
  ) => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/posts`);

    if (filters) {
      filters.forEach((filter) => {
        Object.entries(filter).forEach(([key, value]) => {
          url.searchParams.append(key, value.toString());
        });
      });
    }

    url.searchParams.append("page", page.toString());

    const response = await fetch(url.toString());
    const posts: PaginatedResult<Post> = await response.json();

    return posts;
  };

  const fetchMoreFypPosts = async (page: number) => {
    const res = await fetchMorePosts(page);
    setPostsFypResponse(res);

    return res;
  };

  const fetchMorePostsByFollowings = async (page: number) => {
    const res = await fetchMorePosts(page, [{ by_following: true }]);
    console.log(res.data.map((post) => post.id));
    setPostsFollowingResponse(res);

    return res;
  };

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
            <PostList
              posts={postsFypResponse.data as Post[]}
              pagination={postsFypResponse.meta.pagination}
              fetchMore={fetchMoreFypPosts}
            />
          </TabsContent>
          <TabsContent value="following">
            <PostList
              posts={postsFollowingResponse.data as Post[]}
              pagination={postsFollowingResponse.meta.pagination}
              fetchMore={fetchMorePostsByFollowings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
