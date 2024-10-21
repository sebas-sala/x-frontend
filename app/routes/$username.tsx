import { json, Link, useLoaderData, useParams } from "@remix-run/react";
import { Calendar } from "lucide-react";

import PostList from "~/components/post/post-list";

import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import type { Post } from "~/types/post";
import type { User } from "~/types/user";
import { useAuthStore } from "~/store/auth";

export const loader = async ({ params }: { params: { username: string } }) => {
  const profileResponse = await fetch(
    `${process.env.VITE_API_URL}/users/${params.username}/profile`
  );
  const profile = (await profileResponse.json()) as User;

  const postsResponse = await fetch(`${process.env.VITE_API_URL}/posts`);
  const posts = (await postsResponse.json()) as Post[];

  return json({ profile, posts });
};

export default function Profile() {
  const { username } = useParams();

  const { profile, posts } = useLoaderData<{ profile: User; posts: Post }>();

  const currentUser = useAuthStore().currentUser;

  const isOwner =
    profile.username === currentUser?.username &&
    username === currentUser?.username;

  return (
    <main className="relative flex min-h-screen flex-col w-full">
      <div className="h-48 bg-zinc-800" />

      <div className="px-6">
        <div className="flex justify-between relative py-4">
          <Avatar className="h-40 w-40 -mt-24 border-4 border-black">
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>

          {isOwner && (
            <Button className="ml-auto text-xl font-semibold py-6 rounded-full bg-black border">
              Edit Profile
            </Button>
          )}
        </div>

        <ProfileInfo profile={profile} />
        <ProfileTabs posts={posts} />
      </div>
    </main>
  );
}

function ProfileTabs({ posts, isOwner }: { posts: Post[]; isOwner: boolean }) {
  const tabs = [
    { name: "Posts", value: "posts" },
    { name: "Likes", value: "likes" },
  ];

  const filteredTabs = isOwner
    ? tabs
    : tabs.filter((tab) => tab.value !== "likes");

  return (
    <Tabs className="w-full" defaultValue="posts">
      <TabsList className="w-full flex bg-transparent">
        {filteredTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className="flex-1 bg-black rounded-sm data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-blue-400 hover:bg-gray-950 data-[state=active]:border-b-8 py-0 h-12 hover:text-gray-50"
            value={tab.value}
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="posts">
        <PostList posts={posts} />
      </TabsContent>
      <TabsContent value="likes">Likes</TabsContent>
    </Tabs>
  );
}

function ProfileInfo({ profile }: { profile: User }) {
  const formattedDate = new Date(profile.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="mt-8">
      <h4 className="text-3xl font-black">{profile.name}</h4>
      <h5 className="text-xl text-gray-500">@{profile.username}</h5>

      <div className="flex gap-2 mt-6">
        <Calendar size={24} />
        <span className="text-xl">Joined {formattedDate}</span>
      </div>

      <div className="flex gap-4 mt-4 text-lg">
        <Link to={`/${profile.username}/followers`} className="flex gap-2">
          <p className="font-semibold">0</p>
          <p className="text-gray-500">Following</p>
        </Link>
        <Link to={`/${profile.username}/following`} className="flex gap-2">
          <p className="font-semibold">0</p>
          <p className="text-gray-500">Followers</p>
        </Link>
      </div>
    </div>
  );
}
