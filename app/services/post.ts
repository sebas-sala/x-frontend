import { apiFetch, setSearchParams } from "~/lib/api-utils";

import type { PostApiResponse, PostApiResponseList } from "~/types/post";

export async function createPost({ content }: { content: string }) {
  const url = `${import.meta.env.VITE_API_URL}/posts`;

  return apiFetch<PostApiResponse>(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

export async function getPost({
  postId,
  token,
}: {
  postId: string;
  token?: string;
}): Promise<PostApiResponse> {
  const url = `${import.meta.env.VITE_API_URL}/posts/${postId}`;

  return apiFetch<PostApiResponse>(url, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

export async function createPostView(postId: string) {
  const url = `${import.meta.env.VITE_API_URL}/views`;

  return apiFetch<PostApiResponse>(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ postId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getPosts({
  page = 1,
  token,
  orderBy,
  filters,
}: {
  page?: number;
  token?: string;
  orderBy?: string;
  filters?: Record<string, string | number | boolean>[];
}): Promise<PostApiResponseList> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/posts`);

  filters?.forEach((filter) => setSearchParams(url, filter));
  setSearchParams(url, { page });

  if (orderBy) {
    setSearchParams(url, { orderBy });
  }

  return apiFetch<PostApiResponseList>(url, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
    credentials: "include",
  });
}

export async function likePost(postId: string) {
  const url = `${import.meta.env.VITE_API_URL}/posts/${postId}/likes`;
  return apiFetch<PostApiResponse>(url, {
    method: "POST",
    credentials: "include",
  });
}

export async function unlikePost(postId: string) {
  const url = `${import.meta.env.VITE_API_URL}/posts/${postId}/likes`;
  return await apiFetch<PostApiResponse>(url, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function bookmarkPost(postId: string) {
  const url = `${import.meta.env.VITE_API_URL}/posts/${postId}/bookmarks`;
  return apiFetch<PostApiResponse>(url, {
    method: "POST",
    credentials: "include",
  });
}

export async function unbookmarkPost(postId: string) {
  const url = `${import.meta.env.VITE_API_URL}/posts/${postId}/bookmarks`;
  return apiFetch<PostApiResponse>(url, {
    method: "DELETE",
    credentials: "include",
  });
}
