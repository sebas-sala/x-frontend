import { ApiResponse } from ".";
import { User } from "./user";

type Login = {
  access_token: string;
  user: User;
};

export type LoginApiResponse = ApiResponse<Login>;
