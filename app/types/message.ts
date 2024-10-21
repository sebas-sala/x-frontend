import type { Chat } from "~/types/chat";
import type { User } from "~/types/user";

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  chat: Chat;
}
