import React from "react";
import { Link } from "@remix-run/react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import type { User } from "~/types/user";
import { cn } from "~/lib/utils";

interface UserItemProps {
  user: User;
  currentUser?: User;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export const UserItem = React.forwardRef<HTMLLIElement, UserItemProps>(
  ({ children, user, className, onClick }, ref) => {
    return (
      <li ref={ref} className={cn("flex w-full flex-1 p-2", className)}>
        <Link
          to={`/${user.username}`}
          className="flex w-full items-center justify-between"
          onClick={onClick}
        >
          <span className="flex gap-4">
            <Avatar>
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
            <span>
              <span className="block font-black">{user.name}</span>
              <span className="font-light text-gray-400">@{user.username}</span>
            </span>
          </span>
          {children && <>{children}</>}
        </Link>
      </li>
    );
  },
);
UserItem.displayName = "UserItem";
