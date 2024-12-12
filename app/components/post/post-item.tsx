import { useCallback, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import {
  BanIcon,
  UserIcon,
  EllipsisIcon,
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

import { useAuthStore } from "~/store/auth";

import { cn, wait } from "~/lib/utils";
import { ApiError } from "~/lib/api-utils";
import { formatPostDate } from "~/lib/date-utils";

import type { Post } from "~/types/post";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { bookmarkPost, unbookmarkPost } from "~/services/post";
import PostForm from "./post-form";

interface Props {
  post: Post;
  follow: (id: string) => Promise<void>;
  unfollow: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  unlike: (id: string) => Promise<void>;
  block: (id: string) => Promise<void>;
  datePosition?: "top" | "bottom";
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
  block,
  datePosition = "top",
}: Props) {
  const navigate = useNavigate();

  const currentUser = useAuthStore().currentUser;

  const { user } = post;

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const [alertOpen, setAlertOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  const actions: ActionProps[] = [
    {
      name: "Comment",
      icon: () => <MessageCircle size={16} />,
      handleAction: () => setCommentOpen(true),
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
          isLiked ? await unlike(entityId) : await like(entityId);
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
      count: post.viewsCount,
      icon: () => <BarChart2 size={16} />,
    },
    {
      name: "Bookmarks",
      icon: () => (
        <Bookmark
          size={16}
          className={cn(
            "transition-all duration-200",
            isBookmarked ? "fill-current text-blue-500" : "",
          )}
        />
      ),
      handleAction: async (entityId: string) => {
        try {
          setIsBookmarked((prev) => !prev);
          isBookmarked
            ? await unbookmarkPost(entityId)
            : await bookmarkPost(entityId);
        } catch {
          setIsBookmarked((prev) => !prev);
        }
      },
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

  const handleBlock = async () => {
    await block(user.id);
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
  ].filter(
    (item) =>
      (item.id !== "block" && item.id !== "follow" && item.id !== "ignore") ||
      currentUser?.id !== user.id,
  );

  const formattedDate = formatPostDate(new Date(post.createdAt));

  const handleOnOpenChange = (open: boolean) => {
    setCommentOpen(open);
  };

  return (
    <li className="list-none overflow-hidden transition hover:bg-gray-100">
      <div
        onClick={() => navigate(`/${user.username}/${post.id}`)}
        onKeyDown={() => navigate(`/${user.username}/${post.id}`)}
        tabIndex={0}
        role="button"
        className="flex gap-4 border-b p-4"
      >
        <div>
          <Link
            to={`/${user.username}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <Link
                to={`/${user.username}`}
                className="flex flex-row space-x-2"
                onClick={(event) => event.stopPropagation()}
              >
                {datePosition === "top" ? (
                  <span className="line-clamp-1 flex gap-3 text-clip">
                    <span className="line-clamp-1 text-clip">{user.name}</span>
                    <span className="flex gap-1 text-gray-500">
                      <span className="line-clamp-1 text-clip">
                        {user.username}
                      </span>
                      <span className="font-black">·</span>
                      <span>{formattedDate}</span>
                    </span>
                  </span>
                ) : (
                  <span>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-gray-500">{user.username}</p>
                  </span>
                )}
              </Link>
              {dropdownItems.length > 0 && (
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
                          onClick={(e) => {
                            item.action?.();
                            e.stopPropagation();
                          }}
                        >
                          <item.icon className="mr-2" size={16} />
                          {item.text}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="py-2 pt-6">
              <p className="">{post.content}</p>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.content}
                  className="mt-2 max-h-96 w-full rounded-lg object-cover shadow-lg"
                />
              )}
            </div>

            <div className="mt-2 flex w-full justify-between font-semibold text-gray-500">
              <ActionList entityId={post.id} actions={actions} />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={commentOpen}>
        <DialogTrigger className="sr-only">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="hidden">
              Comment on @{user.username}
            </DialogTitle>
            <DialogDescription className="hidden">
              This is a dialog to comment on @{user.username}&apos;s post.
            </DialogDescription>
          </DialogHeader>
          <div>
            <PostForm
              parentId={post.id}
              type="comment"
              handleOnOpenChange={handleOnOpenChange}
            />
          </div>
        </DialogContent>
      </Dialog>

      <BlockAlertDialog
        username={user.username}
        open={alertOpen}
        onOpenChange={handleBlockAlertChange}
        onClick={handleBlock}
      />
    </li>
  );
}

interface BlockAlertDialogProps {
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClick: () => void;
}

export function BlockAlertDialog({
  username,
  open,
  onOpenChange,
  onClick,
}: BlockAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className="flex cursor-pointer items-center"></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to block @{username}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You won&apos;t see their posts and they won&apos;t be able to see
            your posts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Block</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
