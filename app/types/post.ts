import type { Like } from "~/types/like";
import type { User } from "~/types/user";

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments?: Comment[];
  likes?: Like[];
}
