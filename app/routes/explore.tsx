import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { ErrorPage } from "~/components/error-page";
import { FollowList } from "~/components/follow/follow-list";
import { PostList } from "~/components/post/post-list";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePostData } from "~/hooks/use-post-data";
import { getPosts } from "~/services/post";

import { getUsers } from "~/services/user";
import { getSession } from "~/sessions";
import { Post } from "~/types/post";
import { User } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const session = await getSession(request);
    const token = session.get("token");

    const [usersResponse, postsResponse] = await Promise.all([
      getUsers({
        token,
      }),
      getPosts({ token, orderBy: "trending" }),
    ]);

    return { usersResponse, postsResponse };
  } catch {
    throw new Error("Failed to load data");
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorPage error={error} />;
}

export default function Explore() {
  const { usersResponse, postsResponse } = useLoaderData<typeof loader>();

  const tabs = [
    { name: "Trending", value: "trending" },
    { name: "Users", value: "users" },
  ];

  const handleFetchMoreUsers = async (page: number) => {
    try {
      const res = await getUsers({ page });
      return res.data;
    } catch (e) {
      return [];
    }
  };

  const {
    posts,
    pagination: postsPagination,
    fetchMorePosts,
  } = usePostData({
    initialData: postsResponse.data as Post[],
    initialPagination: postsResponse.meta?.pagination,
    orderBy: "trending",
  });

  return (
    <main>
      <Tabs defaultValue="trending">
        <TabsList className="sticky top-0 flex h-auto w-full bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="flex flex-1 items-center p-16 py-4 data-[state=active]:border-b-4 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent"
              value={tab.value}
            >
              <span className="data-[state=active]:border-blue-400">
                {tab.name}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="trending">
          <PostList
            initialData={posts}
            pagination={postsPagination}
            fetchMore={fetchMorePosts}
          />
        </TabsContent>
        <TabsContent value="users">
          <FollowList
            users={usersResponse.data as User[]}
            pagination={usersResponse.meta?.pagination}
            fetchMore={handleFetchMoreUsers}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
