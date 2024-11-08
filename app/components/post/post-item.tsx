import { useCallback, useState } from "react";
import { Link } from "@remix-run/react";
import {
  BanIcon,
  UserIcon,
  EllipsisIcon,
  FrownIcon,
  Heart,
  Bookmark,
  BarChart2,
  MessageCircle,
} from "lucide-react";

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

import { cn, wait } from "~/lib/utils";
import { formatPostDate } from "~/lib/date-utils";

import type { Post } from "~/types/post";
import { ApiError } from "~/lib/api-utils";

interface Props {
  post: Post;
  follow: (id: string) => Promise<void>;
  unfollow: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  unlike: (id: string) => Promise<void>;
  onClick?: () => void;
}

interface DropdownItem {
  id: string;
  icon: typeof UserIcon;
  text: string;
  action?: () => void;
}

export interface ActionProps {
  name: string;
  icon: () => JSX.Element;
  count?: number;
  className?: string;
  handleAction?: (entityId: string) => Promise<void> | void;
}

export function PostItem({
  post,
  follow,
  unfollow,
  like,
  unlike,
  onClick,
}: Props) {
  const { user } = post;

  const [isFollowed, setIsFollowed] = useState(user.isFollowed);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const [alertOpen, setAlertOpen] = useState(false);

  const actions: ActionProps[] = [
    {
      name: "Comment",
      icon: () => <MessageCircle size={16} />,
    },
    {
      name: "Likes",
      count: likesCount,
      icon: () => (
        <Heart
          size={16}
          className={cn(
            "transition-all duration-200",
            isLiked ? "fill-current text-red-500" : "",
          )}
        />
      ),
      className: isLiked ? "text-red-500" : "",
      handleAction: async (entityId: string) => {
        try {
          setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
          setIsLiked((prev) => !prev);
          isLiked ? await unlike(entityId) : like(entityId);
        } catch (error) {
          if (error instanceof ApiError) {
            if (error.status === 404) return;
          }

          setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
          setIsLiked((prev) => !prev);
        }
      },
    },
    {
      name: "Views",
      icon: () => <BarChart2 size={16} />,
    },
    {
      name: isBookmarked ? "Unbookmark" : "Bookmark",
      icon: () => (
        <Bookmark
          size={16}
          className={cn(
            "transition-all duration-200",
            isBookmarked ? "fill-current text-blue-500" : "",
          )}
        />
      ),
    },
  ];

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
        actions={actions}
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
  actions: ActionProps[];
  onClick?: () => void;
}

export function PostContent({
  post,
  actions,
  dropdownItems,
  onClick,
}: PostContentProps) {
  const { user } = post;

  const formattedDate = formatPostDate(new Date(post.createdAt));

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
