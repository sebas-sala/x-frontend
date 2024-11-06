import { json, useLoaderData } from "@remix-run/react";
import { getFollowers } from "~/services/user";

export const loader = async ({ params }: { params: { username: string } }) => {
  const followersResponse = await getFollowers(params.username);

  return json({ followersResponse });
};

export default function Followers() {
  const { followersResponse } = useLoaderData<typeof loader>();

  return (
    <main className="relative flex min-h-screen w-full flex-col">
      {followersResponse.timestamp}
    </main>
  );
}
