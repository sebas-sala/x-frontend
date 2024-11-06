import { useCallback, useState } from "react";
import { Link } from "@remix-run/react";
import { BanIcon, UserIcon, EllipsisIcon, FrownIcon } from "lucide-react";

import { ActionList } from "./action-list";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { usePostStore } from "~/store/post";
import { useUserStore } from "~/store/user";

import { wait } from "~/lib/utils";
import { formatPostDate } from "~/lib/date-utils";

import type { Post } from "~/types/post";

interface Props {
  post: Post;
  onClick?: () => void;
}

interface DropdownItem {
  id: string;
  icon: typeof UserIcon;
  text: string;
  action?: () => void;
}

export function PostItem({ post, onClick }: Props) {
  const { user } = post;

  const [isFollowed, setIsFollowed] = useState(user.isFollowed);
  const [alertOpen, setAlertOpen] = useState(false);

  const follow = useUserStore().follow;
  const unfollow = useUserStore().unfollow;

  const handleFollowToggle = useCallback(async () => {
    setIsFollowed((prev) => !prev);
    try {
      isFollowed ? await unfollow(user.id) : await follow(user.id);
    } catch {
      setIsFollowed((prev) => !prev);
    }
  }, [isFollowed, follow, unfollow, user.id]);

  const handleBlockAlertChange = (open: boolean) => {
    setAlertOpen(open);

    wait(250).then(() => {
      document.body.style.pointerEvents = open ? "none" : "auto";
    });
  };

  const dropdownItems: DropdownItem[] = [
    {
      id: "follow",
      icon: UserIcon,
      text: `${isFollowed ? "Unfollow" : "Follow"} @${user.username}`,
      action: handleFollowToggle,
    },
    {
      id: "block",
      icon: BanIcon,
      text: `Block @${user.username}`,
      action: () => setAlertOpen(true),
    },
    {
      id: "ignore",
      icon: FrownIcon,
      text: `Not interested in this post`,
    },
  ];

  return (
    <li>
      <PostContent
        post={post}
        dropdownItems={dropdownItems}
        onClick={onClick}
      />

      <BlockAlertDialog
        open={alertOpen}
        onOpenChange={handleBlockAlertChange}
      />
    </li>
  );
}

interface PostContentProps {
  post: Post;
  dropdownItems: DropdownItem[];
  onClick?: () => void;
}

export function PostContent({
  post,
  dropdownItems,
  onClick,
}: PostContentProps) {
  const { user } = post;

  const formattedDate = formatPostDate(new Date(post.createdAt));

  const actions = usePostStore().actions;

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={onClick}
      className="flex gap-4 border-b p-4"
    >
      <div>
        <Link to={`/${user.username}`}>
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <Link to={`/${user.username}`} className="flex flex-row space-x-2">
              <p className="font-bold">{user.name}</p>
              <p className="space-x-1 text-gray-500">
                <span>{user.username}</span>
                <span className="font-black">·</span>
                <span>{formattedDate}</span>
              </p>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisIcon className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {dropdownItems.map((item, index) => {
                  return (
                    <DropdownMenuItem
                      key={index}
                      className="flex cursor-pointer items-center"
                      onClick={item.action}
                    >
                      <item.icon className="mr-2" size={16} />
                      {item.text}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="">{post.content}</p>

          {/* <div className="my-2 rounded-xl border h-[400px]">hola</div> */}

          <div className="mt-2 flex w-full justify-between font-semibold text-gray-500">
            <ActionList entityId={post.id} actions={actions} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlockAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockAlertDialog({
  open,
  onOpenChange,
}: BlockAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className="flex cursor-pointer items-center"></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
