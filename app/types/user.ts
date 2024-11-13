import type { Chat } from "~/types/chat";
import type { Like } from "~/types/like";
import type { Post } from "~/types/post";
import type { Follow } from "~/types/follow";
import type { Profile } from "~/types/profle";
import type { Message } from "~/types/message";
import type { BlockedUser } from "~/types/blocked-user";
import type { ApiResponse, ApiResponseList } from ".";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  password: string;
  isFollowed?: boolean;
  profile: Profile;
  posts?: Post[];
  likes?: Like[];
  chats?: Chat[];
  followers?: Follow[];
  followersCount?: number;
  following?: Follow[];
  followingCount?: number;
  comments?: Comment[];
  messages?: Message[];
  blockedBy?: BlockedUser[];
  blockedUsers?: BlockedUser[];
  notifications?: Notification[];
}

export type UserApiResponse = ApiResponse<User>;
export type UserApiResponseList = ApiResponseList<User>;
