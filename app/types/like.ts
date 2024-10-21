import type { User } from "~/types/user";
import type { Post } from "~/types/post";

export interface Like {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  post?: Post;
  comment: Comment;
}
