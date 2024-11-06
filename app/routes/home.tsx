import { useState } from "react";
import { json, useLoaderData } from "@remix-run/react";

import { PostList } from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { getPosts } from "~/services/post";

import type { Post, PostApiResponseList } from "~/types/post";
import type { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const token = session.get("token");

  try {
    const [posts, postsByFollowing] = await Promise.all([
      getPosts({
        token,
      }),
      getPosts({ filters: [{ by_following: true }], token }),
    ]);

    return json({
      posts: posts || [],
      postsByFollowing: postsByFollowing || [],
    });
  } catch (error) {
    return json({ posts: [], postsByFollowing: [] });
  }
};

export default function Home() {
  const { posts, postsByFollowing } = useLoaderData<typeof loader>();

  const [postsFypResponse, setPostsFypResponse] = useState<PostApiResponseList>(
    posts as PostApiResponseList,
  );
  const [postsFollowingResponse, setPostsFollowingResponse] =
    useState<PostApiResponseList>(postsByFollowing as PostApiResponseList);

  const fetchMoreFypPosts = async (page: number) => {
    try {
      const res = await getPosts({
        page,
      });
      setPostsFypResponse(res);

      return res.data;
    } catch (e) {
      return [];
    }
  };

  const fetchMorePostsByFollowings = async (page: number) => {
    const res = await getPosts({ page, filters: [{ by_following: true }] });
    setPostsFollowingResponse(res as PostApiResponseList);

    return res?.data;
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="relative">
        <Tabs defaultValue="fyp" className="relative w-full rounded-none">
          <TabsList className="sticky top-0 h-full w-full rounded-none px-0">
            <TabsTrigger value="fyp" className="h-12 flex-1 rounded-none">
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className="h-12 flex-1 rounded-none">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="fyp">
            <PostList
              posts={postsFypResponse.data as Post[]}
              pagination={postsFypResponse.meta?.pagination}
              fetchMore={fetchMoreFypPosts}
            />
          </TabsContent>
          <TabsContent value="following">
            <PostList
              posts={postsFollowingResponse.data as Post[]}
              pagination={postsFollowingResponse.meta?.pagination}
              fetchMore={fetchMorePostsByFollowings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
