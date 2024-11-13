import { apiFetch } from "~/lib/api-utils";
import { ApiResponse } from "~/types";

import type { User } from "~/types/user";

export async function getProfile({
  username,
  token,
}: {
  username: string;
  token?: string;
}): Promise<ApiResponse<User>> {
  const url = `${import.meta.env.VITE_API_URL}/users/${username}/profile`;

  return apiFetch<ApiResponse<User>>(url, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
    credentials: "include",
  });
}
