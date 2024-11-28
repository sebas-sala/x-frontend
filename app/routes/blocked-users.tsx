import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useInfiniteScroll } from "react-continous-scroll";

import { UserItem } from "~/components/user/user-item";
import { UserList } from "~/components/user/user-list";
import { Button } from "~/components/ui/button";
import { Loader } from "~/components/loader";

import { getSession } from "~/sessions";
import { useAuthStore } from "~/store/auth";
import { getBlockedUsers, unblockUser } from "~/services/user";

import type { User } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const token = session.get("token");

  const usersResponse = await getBlockedUsers({ token });
  return { usersResponse: usersResponse };
};

export default function BlockedUsers() {
  const { usersResponse } = useLoaderData<typeof loader>();

  const [users, setUsers] = useState(usersResponse.data as User[]);
  const [pagination, setPagination] = useState(usersResponse.meta?.pagination);

  const handleFetchMoreUsers = async (page: number) => {
    try {
      const res = await getBlockedUsers({ page });
      setUsers([...users, ...res.data]);
      setPagination(res.meta?.pagination);

      return res.data;
    } catch (e) {
      return [];
    }
  };

  const { loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData: users,
    loadMore: pagination?.hasNextPage,
    onLoadMore: () => handleFetchMoreUsers(pagination.page),
  });

  const handleUnblockUser = async (user: User) => {
    const updatedUsers = users.filter((u) => u.id !== user.id);
    setUsers(updatedUsers);

    try {
      await unblockUser(user.id);
    } catch (e) {
      setUsers([...users, user]);
    }
  };

  const currentUser = useAuthStore().currentUser;

  return (
    <main>
      <h1 className="mt-2 px-2 text-2xl font-semibold">Blocked Users</h1>

      {users.length === 0 ? (
        <p className="text-center text-lg font-semibold">No users found</p>
      ) : (
        <>
          <UserList>
            {users.map((user: User) => (
              <UserItem key={user.id} user={user}>
                {currentUser?.id !== user.id && (
                  <Button
                    className="rounded-full border py-4 text-lg font-semibold"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUnblockUser(user);
                    }}
                  >
                    Unblock
                  </Button>
                )}
              </UserItem>
            ))}
          </UserList>

          <Loader ref={loadMoreRef} loading={loading} loadMore={loadMore} />
        </>
      )}
    </main>
  );
}
