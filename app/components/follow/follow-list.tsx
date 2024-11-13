import { Link } from "@remix-run/react";
import { Pagination } from "~/types";
import { User } from "~/types/user";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader } from "../loader";
import { useInfiniteScroll } from "react-continous-scroll";
import { useUserStore } from "~/store/user";
import { useState } from "react";
import { useAuthStore } from "~/store/auth";

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

  const currentUser = useAuthStore().currentUser;

  const handleFollow = async (userId: string, isFollowed?: boolean) => {
    isFollowed ? await unfollow(userId) : await follow(userId);
  };

  console.log(users);

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
                handleFollow={handleFollow}
                currentUser={currentUser}
              />
            ))}
          </ul>

          <Loader
            loaderType="pinwheel"
            ref={loadMoreRef}
            loading={loading}
            loadMore={loadMore}
          />
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
  handleFollow: (userId: string, isFollowed?: boolean) => void;
  currentUser?: User;
}) {
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);

  const onClick = async (userId: string, isFollowed?: boolean) => {
    setIsFollowed((prev) => !prev);

    try {
      handleFollow(userId, isFollowed);
    } catch {
      setIsFollowed((prev) => !prev);
    }
  };

  return (
    <li className="flex w-full flex-1 p-2">
      <Link
        to={`/${user.username}`}
        className="flex w-full items-center justify-between"
      >
        <span className="flex gap-4">
          <Avatar>
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          <span>
            <span className="block text-xl font-black">{user.name}</span>
            <span className="">{user.username}</span>
          </span>
        </span>
        {currentUser?.id !== user.id && (
          <span>
            <Button
              className="rounded-full border py-4 text-lg font-semibold"
              onClick={(e) => {
                e.preventDefault();
                onClick(user.id, isFollowed);
              }}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          </span>
        )}
      </Link>
    </li>
  );
}
