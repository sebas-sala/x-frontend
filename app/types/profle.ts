import type { User } from "~/types/user";

export interface Profile {
  id: string;
  bio?: string;
  location?: string;
  birthdate?: Date;
  website?: string;
  isPublic: boolean;
  updatedAt: Date;
  user: User;
}
