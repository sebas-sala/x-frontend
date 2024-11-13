import {
  json,
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { ArrowLeftIcon } from "lucide-react";

import { FollowList } from "~/components/follow/follow-list";

import { getFollowers, getFollowing } from "~/services/user";

import { cn } from "~/lib/utils";
import { useShadow } from "~/hooks/use-shadow";

import type { User } from "~/types/user";

export const loader = async ({ params }: { params: { username: string } }) => {
  try {
    if (!params.username) {
      return redirect("/home");
    }

    const followersResponse = await getFollowing({ username: params.username });

    return json({ followersResponse });
  } catch (error) {
    return redirect("/home?error=profile_not_found");
  }
};

export default function Following() {
  const { username } = useParams();
  const navigate = useNavigate();

  const { followersResponse } = useLoaderData<typeof loader>();

  const { isShadow } = useShadow();

  if (!username) {
    return navigate("/home");
  }

  const handleFetchMoreFollowers = async (page: number) => {
    try {
      const res = await getFollowers({ username, page });
      return res.data;
    } catch (e) {
      return [];
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <section
        className={cn(
          "transition-shadow duration-300",
          { "shadow-md": isShadow },
          "w sticky top-0 z-10 flex items-center gap-4 bg-white px-4 py-1",
        )}
      >
        <div className="flex items-center">
          <Link
            to={`/${username}`}
            className="rounded-full p-2 transition-colors hover:bg-gray-200"
          >
            <ArrowLeftIcon />
          </Link>
        </div>
        <div>
          <h3 className="text-2xl font-semibold">@{username}</h3>
        </div>
      </section>
      <div className="px-1">
        <FollowList
          users={followersResponse.data as User[]}
          pagination={followersResponse.meta?.pagination}
          fetchMore={handleFetchMoreFollowers}
        />
      </div>
    </main>
  );
}
