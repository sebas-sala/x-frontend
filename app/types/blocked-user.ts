import type { User } from "~/types/user";

export interface BlockedUser {
  id: string;
  blockingUser: User;
  blockedUser: User;
  createdAt: Date;
}
