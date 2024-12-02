import { apiFetch } from "~/lib/api-utils";

import type { UserApiResponse, UserApiResponseList } from "~/types/user";

export async function getUser(userId: string) {
  const url = `${import.meta.env.VITE_API_URL}/users/${userId}`;
  return apiFetch<UserApiResponse>(url, {
    method: "GET",
    credentials: "include",
  });
}

export async function getUserByUsername(username: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/users/${username}`;
    return apiFetch<UserApiResponse>(url, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    return {
      data: null,
    };
  }
}

export async function getUsers({
  page = 1,
  perPage = 15,
  filters,
  token,
}: {
  page?: number;
  perPage?: number;
  filters?: Record<string, string | number | boolean>[];
  token?: string;
} = {}): Promise<UserApiResponseList> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/users`);

  url.searchParams.append("page", page.toString());
  url.searchParams.append("perPage", perPage.toString());

  if (filters) {
    filters.forEach((filter) => {
      Object.entries(filter).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    });
  }

  return apiFetch<UserApiResponseList>(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

export async function getFollowers({
  username,
  page,
  token,
}: {
  username: string;
  page?: number;
  token?: string;
}) {
  const url = new URL(
    `${import.meta.env.VITE_API_URL}/users/${username}/followers`,
  );

  if (page) {
    url.searchParams.append("page", page.toString());
  }

  return apiFetch<UserApiResponseList>(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

export async function getFollowing({
  username,
  page,
  token,
}: {
  username: string;
  page?: number;
  token?: string;
}) {
  const url = new URL(
    `${import.meta.env.VITE_API_URL}/users/${username}/following`,
  );

  if (page) {
    url.searchParams.append("page", page.toString());
  }

  return apiFetch<UserApiResponseList>(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

export async function followUser(userId: string) {
  const url = `${import.meta.env.VITE_API_URL}/users/${userId}/follow`;
  return apiFetch<UserApiResponseList>(url, {
    method: "POST",
    credentials: "include",
  });
}

export async function unfollowUser(userId: string) {
  const url = `${import.meta.env.VITE_API_URL}/users/${userId}/unfollow`;
  return apiFetch<UserApiResponseList>(url, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function blockUser(userId: string) {
  const url = `${import.meta.env.VITE_API_URL}/users/${userId}/block`;
  return apiFetch<UserApiResponseList>(url, {
    method: "POST",
    credentials: "include",
  });
}

export async function unblockUser(userId: string) {
  const url = `${import.meta.env.VITE_API_URL}/users/${userId}/unblock`;
  return apiFetch<UserApiResponseList>(url, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function getBlockedUsers({
  page,
  token,
}: {
  page?: number;
  token?: string;
}) {
  const url = new URL(`${import.meta.env.VITE_API_URL}/users/blocked`);

  if (page) {
    url.searchParams.append("page", page.toString());
  }

  return apiFetch<UserApiResponseList>(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}
