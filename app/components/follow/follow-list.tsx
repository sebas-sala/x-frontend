import { Link } from "@remix-run/react";
import { Pagination } from "~/types";
import { User } from "~/types/user";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader } from "../loader";
import { useInfiniteScroll } from "react-continous-scroll";
import { useUserStore } from "~/store/user";
import { useState } from "react";

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

  const handleFollow = async (userId: string, isFollowed?: boolean) => {
    isFollowed ? await unfollow(userId) : await follow(userId);
  };

  return (
    <>
      <ul className="space-y-2">
        {data.map((user: User) => (
          <UserFollowItem
            key={user.id}
            user={user}
            handleFollow={handleFollow}
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
  );
}

export function UserFollowItem({
  user,
  handleFollow,
}: {
  user: User;
  handleFollow?: (userId: string, isFollowed?: boolean) => void;
}) {
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);

  const onClick = async (userId: string, isFollowed?: boolean) => {
    setIsFollowed((prev) => !prev);

    try {
      handleFollow?.(userId, isFollowed);
    } catch {
      setIsFollowed((prev) => !prev);
    }
  };

  return (
    <li className="flex w-full flex-1 items-center justify-between p-2">
      <div className="flex gap-4">
        <Link to={`/${user.username}`}>
          <Avatar>
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <p className="text-xl font-black">{user.name}</p>
          <p className="">{user.username}</p>
        </div>
      </div>
      <div>
        <Button
          className="rounded-full border py-4 text-lg font-semibold"
          onClick={() => onClick(user.id, isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </li>
  );
}
