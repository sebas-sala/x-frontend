import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FollowList } from "~/components/follow/follow-list";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { getUsers } from "~/services/user";
import { getSession } from "~/sessions";
import { User } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const token = session.get("token");

  const [usersResponse] = await Promise.all([
    getUsers({
      token,
    }),
  ]);

  return { usersResponse: usersResponse };
};

export default function Explore() {
  const { usersResponse } = useLoaderData<typeof loader>();

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

        <TabsContent value="trending">Trending</TabsContent>
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
