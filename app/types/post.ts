import type { Like } from "~/types/like";
import type { User } from "~/types/user";
import { ApiResponse, ApiResponseList } from ".";

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments?: Comment[];
  likes?: Like[];
  isLiked?: boolean;
  likesCount?: number;
  isBookmarked?: boolean;
  isViewed?: boolean;
  viewsCount?: number;
}

export type PostApiResponse = ApiResponse<Post>;
export type PostApiResponseList = ApiResponseList<Post>;
