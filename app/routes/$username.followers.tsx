import { json, useLoaderData, useParams } from "@remix-run/react";
import { Calendar } from "lucide-react";

import PostList from "~/components/post/post-list";

import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import type { Post } from "~/types/post";
import type { User } from "~/types/user";

export const loader = async ({ params }: { params: { username: string } }) => {
  const profileResponse = await fetch(
    `${process.env.VITE_API_URL}/users/${params.username}/profile`
  );
  const profile = (await profileResponse.json()) as User;

  const postsResponse = await fetch(`${process.env.VITE_API_URL}/posts`);
  const posts = (await postsResponse.json()) as Post[];

  return json({ profile, posts });
};

export default function UserFollowers() {
  const { username } = useParams();

  const { profile, posts } = useLoaderData<{ profile: User; posts: Post }>();

  return (
    <main className="relative flex min-h-screen flex-col w-full">holaa</main>
  );
}
