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

export async function getPosts({
  page = 1,
  token,
  filters,
}: {
  page?: number;
  token?: string;
  filters?: Record<string, string | number | boolean>[];
}): Promise<PostApiResponseList> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/posts`);

  filters?.forEach((filter) => setSearchParams(url, filter));
  setSearchParams(url, { page });

  return apiFetch<PostApiResponseList>(url, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

export async function likePost(postId: string) {
  const url = `${import.meta.env.VITE_API_URL}/posts/${postId}/likes`;
  return apiFetch<PostApiResponse>(url, { method: "POST" });
}
