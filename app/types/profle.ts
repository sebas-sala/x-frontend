import type { User } from "~/types/user";

export interface Profile {
  id: string;
  bio?: string;
  location?: string;
  birthdate?: string;
  website?: string;
  isPublic: boolean;
  updatedAt: string;
  user: User;
}
