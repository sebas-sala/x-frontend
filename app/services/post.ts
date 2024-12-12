import { apiFetch, setSearchParams } from "~/lib/api-utils";
import { Filter } from "~/types";

import type { PostApiResponse, PostApiResponseList } from "~/types/post";

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function createPost({
  content,
  file,
  parentId,
}: {
  content: string;
  file: File | null;
  parentId?: string;
}) {
  const url = `${import.meta.env.VITE_API_URL}/posts`;

  const formData = new FormData();
  formData.append("content", content);
  if (file) {
    const base64Image = await convertToBase64(file);
    formData.append("image", base64Image);
  }
  if (parentId) {
    formData.append("parentId", parentId);
  }

  return apiFetch<PostApiResponse>(url, {
    method: "POST",
    credentials: "include",
    body: formData,
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
  filters?: Filter[];
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
