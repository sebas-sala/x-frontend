import { useState } from "react";

import { PostList } from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { getPosts } from "~/services/post";

import type { ApiResponseList } from "~/types";
import type { Post } from "~/types/post";

export function ProfileTabs({
  username,
  isOwner,
  postsResponse,
}: {
  username: string;
  isOwner: boolean;
  postsResponse: ApiResponseList<Post>;
}) {
  const [postsPagination, setPostsPagination] = useState(
    postsResponse.meta.pagination,
  );

  const tabs = [
    { name: "Posts", value: "posts" },
    { name: "Replies", value: "replies" },
    { name: "Likes", value: "likes" },
  ];

  const filteredTabs = isOwner
    ? tabs
    : tabs.filter((tab) => tab.value !== "likes");

  const fetchMorePosts = async (page: number) => {
    const res = await getPosts({ page, filters: [{ by_username: username }] });
    setPostsPagination(res.meta.pagination);

    return res.data;
  };

  return (
    <Tabs className="mt-4 w-full" defaultValue="posts">
      <TabsList className="flex w-full bg-transparent">
        {filteredTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className="h-12 flex-1 py-0 hover:bg-gray-950 hover:text-gray-50 data-[state=active]:border-b-4 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent"
            value={tab.value}
          >
            <span className="data-[state=active]:border-blue-400">
              {tab.name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="posts">
        <PostList
          posts={postsResponse.data}
          pagination={postsPagination}
          fetchMore={fetchMorePosts}
          maxPage={10}
        />
      </TabsContent>
      <TabsContent value="likes">Likes</TabsContent>
    </Tabs>
  );
}
