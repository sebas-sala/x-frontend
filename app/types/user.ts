import type { Chat } from "~/types/chat";
import type { Like } from "~/types/like";
import type { Post } from "~/types/post";
import type { Follow } from "~/types/follow";
import type { Profile } from "~/types/profle";
import type { Message } from "~/types/message";
import type { BlockedUser } from "~/types/blocked-user";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  profile: Profile;
  posts?: Post[];
  likes?: Like[];
  chats?: Chat[];
  followers?: Follow[];
  following?: Follow[];
  comments?: Comment[];
  messages?: Message[];
  blockedBy?: BlockedUser[];
  blockedUsers?: BlockedUser[];
  notifications?: Notification[];
}
