import type { User } from "~/types/user";
import type { Message } from "~/types/message";

export interface Chat {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  messages: Message[];
  isChatGroup: boolean;
}
