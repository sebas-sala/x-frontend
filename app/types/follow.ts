import type { User } from "~/types/user";

export interface Follow {
  id: string;
  follower: User;
  following: User;
  createdAt: Date;
}
