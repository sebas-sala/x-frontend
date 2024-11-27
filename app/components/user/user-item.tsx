import React from "react";
import { Link } from "@remix-run/react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import type { User } from "~/types/user";

interface UserItemProps {
  user: User;
  currentUser?: User;
  children?: React.ReactNode;
}

export const UserItem = React.forwardRef<HTMLLIElement, UserItemProps>(
  ({ children, user }, ref) => {
    return (
      <li ref={ref} className="flex w-full flex-1 p-2">
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
          {children && <>{children}</>}
        </Link>
      </li>
    );
  },
);
UserItem.displayName = "UserItem";
