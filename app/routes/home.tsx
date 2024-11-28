import { useLoaderData } from "@remix-run/react";

import { PostList } from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { getPosts } from "~/services/post";

import { getSession } from "~/sessions";

import { usePostData } from "~/hooks/use-post-data";

import type { Post } from "~/types/post";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const token = session.get("token");

  const filters = [{}, { by_following: true }];
  const [posts, postsByFollowing] = await Promise.all(
    filters.map((filter) => getPosts({ ...filter, token })),
  );

  return {
    posts: posts || [],
    postsByFollowing: postsByFollowing || [],
  };
};

export default function Home() {
  const { posts: postsLoader, postsByFollowing: postsByFollowingLoader } =
    useLoaderData<typeof loader>();

  const {
    posts: fypPosts,
    pagination: fypPagination,
    fetchMorePosts: fetchMoreFypPosts,
  } = usePostData({
    initialData: postsLoader.data as Post[],
    initialPagination: postsLoader.meta?.pagination,
  });

  const {
    posts: followingPosts,
    pagination: followingPagination,
    fetchMorePosts: fetchMoreFollowing,
  } = usePostData({
    initialData: postsByFollowingLoader.data as Post[],
    initialPagination: postsByFollowingLoader.meta?.pagination,
  });

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
              initialData={fypPosts}
              pagination={fypPagination}
              fetchMore={fetchMoreFypPosts}
            />
          </TabsContent>
          <TabsContent value="following">
            <PostList
              initialData={followingPosts}
              pagination={followingPagination}
              fetchMore={fetchMoreFollowing}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
