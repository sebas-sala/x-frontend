import {
  Outlet,
  useParams,
  useNavigate,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { ProfileTabs } from "~/components/profile/profile-tabs";
import { ProfileInfo } from "~/components/profile/profile-info";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import { getProfile } from "~/services/profile";
import { getPosts } from "~/services/post";

import { useAuthStore } from "~/store/auth";

import type { Post } from "~/types/post";
import type { User } from "~/types/user";
import type { ApiResponseList } from "~/types";
import { getSession } from "~/sessions";
import { ErrorPage } from "~/components/error-page";

export const loader = async ({
  params,
  request,
}: {
  params: { username: string };
  request: Request;
}) => {
  try {
    const session = await getSession(request);
    const token = session.get("token");

    const [profileResponse, postsResponse] = await Promise.all([
      getProfile({ username: params.username, token }),
      getPosts({ filters: [{ by_username: params.username }], token }),
    ]);

    return { profileResponse, postsResponse };
  } catch (error) {
    throw new Error("Failed to load profile");
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorPage error={error} />;
}

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const { profileResponse, postsResponse } = useLoaderData<typeof loader>();

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

      <div className="relative flex justify-between px-6 py-4">
        <Avatar className="-mt-24 h-40 w-40 border-4 border-black">
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      </div>

      <ProfileInfo profile={profile} />
      <ProfileTabs
        isOwner={isOwner}
        username={username}
        postsResponse={postsResponse as ApiResponseList<Post>}
      />

      <Outlet />
    </main>
  );
}
