import {
  json,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";

import { Button } from "~/components/ui/button";
import { ProfileTabs } from "~/components/profile/profile-tabs";
import { ProfileInfo } from "~/components/profile/profile-info";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import { getProfile } from "~/services/profile";
import { getPosts } from "~/services/post";

import { useAuthStore } from "~/store/auth";

import type { Post } from "~/types/post";
import type { User } from "~/types/user";
import type { ApiResponse, ApiResponseList } from "~/types";

export const loader = async ({ params }: { params: { username: string } }) => {
  try {
    const [profileResponse, postsResponse] = await Promise.all([
      getProfile(params.username),
      getPosts({ filters: [{ by_username: params.username }] }),
    ]);

    return json({ profileResponse, postsResponse });
  } catch (error) {
    return redirect("/home?error=profile_not_found");
  }
};

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const { profileResponse, postsResponse } = useLoaderData<{
    profileResponse: ApiResponse<User>;
    postsResponse: ApiResponseList<Post>;
  }>();

  const currentUser = useAuthStore().currentUser;

  if (!username) {
    return navigate("/home");
  }

  const profile = profileResponse.data as User;

  const isOwner =
    profile.username === currentUser?.username &&
    username === currentUser?.username;

  return (
    <main className="scrollbar-hidden relative flex min-h-screen w-full flex-col">
      <div className="h-48 bg-gray-100" />

      <div className="px-6">
        <div className="relative flex justify-between py-4">
          <Avatar className="-mt-24 h-40 w-40 border-4 border-black">
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>

          {isOwner && (
            <Button className="ml-auto rounded-full border py-6 text-xl font-semibold">
              Edit Profile
            </Button>
          )}
        </div>

        <ProfileInfo profile={profile} />
        <ProfileTabs
          isOwner={isOwner}
          username={username}
          postsResponse={postsResponse as ApiResponseList<Post>}
        />
      </div>

      <Outlet />
    </main>
  );
}
