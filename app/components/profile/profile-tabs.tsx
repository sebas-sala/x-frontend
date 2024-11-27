import { PostList } from "~/components/post/post-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { usePostData } from "~/hooks/use-post-data";

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
  const tabs = [
    { name: "Posts", value: "posts" },
    { name: "Replies", value: "replies" },
    { name: "Likes", value: "likes" },
  ];

  const filteredTabs = isOwner
    ? tabs
    : tabs.filter((tab) => tab.value !== "likes");

  const { posts, pagination, fetchMorePosts } = usePostData({
    initialData: postsResponse.data,
    initialPagination: postsResponse.meta?.pagination,
    filters: [{ by_username: username }],
  });

  const {
    posts: replies,
    pagination: repliesPagination,
    fetchMorePosts: fetchMoreReplies,
  } = usePostData({
    filters: [{ by_replies: true }],
  });

  const {
    posts: likedPosts,
    pagination: likedPostsPagination,
    fetchMorePosts: fetchMoreLikedPosts,
  } = usePostData({
    filters: [{ by_like: true }],
  });

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

      <TabsContent value="posts" className="px-0">
        <PostList
          initialData={posts}
          pagination={pagination}
          fetchMore={fetchMorePosts}
        />
      </TabsContent>
      <TabsContent value="replies">
        <PostList
          initialData={replies}
          pagination={repliesPagination}
          fetchMore={fetchMoreReplies}
        />
      </TabsContent>
      <TabsContent value="likes">
        <PostList
          initialData={likedPosts}
          pagination={likedPostsPagination}
          fetchMore={fetchMoreLikedPosts}
        />
      </TabsContent>
    </Tabs>
  );
}
