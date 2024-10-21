import { formatPostDate } from "~/lib/date-utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

import type { Post } from "~/types/post";
import { postActions } from "~/data/actions";

import ActionList from "./action-list";
import { Link } from "@remix-run/react";

interface Props {
  post: Post;
}

export default function PostItem({ post }: Props) {
  const { user } = post;

  const formattedDate = formatPostDate(new Date(post.createdAt));

  return (
    <li key={post.id} className="flex border-b p-4 gap-4">
      <Link to={`/${user.username}`}>
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1">
        <div className="flex flex-col">
          <Link to={`/${user.username}`} className="flex flex-row space-x-2">
            <p className="font-bold">{user.name}</p>
            <p className="text-gray-500 space-x-1">
              <span>{user.username}</span>
              <span className="font-black">·</span>
              <span>{formattedDate}</span>
            </p>
          </Link>
          <p className="text-white">{post.content}</p>

          {/* <div className="my-2 rounded-xl border h-[400px]">hola</div> */}

          <div className="flex justify-between w-full mt-2 text-gray-500 font-semibold">
            <ActionList postActions={postActions} />
          </div>
        </div>
      </div>
    </li>
  );
}
