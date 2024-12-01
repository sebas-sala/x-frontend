import {
  Link,
  useParams,
  useNavigate,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ArrowLeftIcon } from "lucide-react";
import { ErrorPage } from "~/components/error-page";

import { FollowList } from "~/components/follow/follow-list";
import { useShadow } from "~/hooks/use-shadow";
import { cn } from "~/lib/utils";

import { getFollowers } from "~/services/user";
import { getSession } from "~/sessions";

import type { User } from "~/types/user";

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { username: string };
}) => {
  try {
    const session = await getSession(request);
    const token = session.get("token");

    const followersResponse = await getFollowers({
      username: params.username,
      token,
    });

    return { followersResponse };
  } catch {
    throw new Error("Failed to load followers");
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorPage error={error} />;
}

export default function Followers() {
  const { username } = useParams();
  const navigate = useNavigate();

  const { isShadow } = useShadow();

  const { followersResponse } = useLoaderData<typeof loader>();

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
    <main className="relative flex min-h-screen w-full flex-col p-1">
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
        {followersResponse.data.length ? (
          <FollowList
            users={followersResponse.data as User[]}
            pagination={followersResponse.meta?.pagination}
            fetchMore={handleFetchMoreFollowers}
          />
        ) : (
          <div className="py-10 text-center">
            <span className="font-bold">@{username} </span> does not have
            followers
          </div>
        )}
      </div>
    </main>
  );
}
