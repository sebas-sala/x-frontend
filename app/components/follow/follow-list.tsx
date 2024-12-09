import { Pagination } from "~/types";
import { User } from "~/types/user";
import { Button } from "../ui/button";
import { Loader } from "../loader";
import { useInfiniteScroll } from "react-continous-scroll";
import { useUserStore } from "~/store/user";
import { useState } from "react";
import { useAuthStore } from "~/store/auth";
import { UserItem } from "../user/user-item";

type FollowListProps = {
  users: User[];
  pagination: Pagination;
  fetchMore: (page: number) => Promise<User[]>;
};

export function FollowList({ users, pagination, fetchMore }: FollowListProps) {
  const { data, loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData: users,
    loadMore: pagination.hasNextPage,
    onLoadMore: () => fetchMore(pagination.page),
  });

  const follow = useUserStore().follow;
  const unfollow = useUserStore().unfollow;

  const currentUser = useAuthStore.use.currentUser();

  const handleFollow = async (userId: string, isFollowed?: boolean) => {
    isFollowed ? await unfollow(userId) : await follow(userId);
  };

  return (
    <>
      {data.length === 0 ? (
        <p className="text-center text-lg font-semibold">No users found</p>
      ) : (
        <>
          <ul className="space-y-2">
            {data.map((user: User) => (
              <UserFollowItem
                key={user.id}
                user={user}
                currentUser={currentUser}
                handleFollow={handleFollow}
              />
            ))}
          </ul>

          <Loader ref={loadMoreRef} loading={loading} loadMore={loadMore} />
        </>
      )}
    </>
  );
}

export function UserFollowItem({
  user,
  currentUser,
  handleFollow,
}: {
  user: User;
  handleFollow: (userId: string, isFollowed?: boolean) => Promise<void>;
  currentUser?: User;
}) {
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);

  const onFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await handleFollow(user.id, isFollowed);
    setIsFollowed(!isFollowed);
  };

  return (
    <UserItem key={user.id} user={user} currentUser={currentUser}>
      <Button
        className="rounded-full border py-4 text-lg font-semibold"
        onClick={onFollow}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </UserItem>
  );
}
