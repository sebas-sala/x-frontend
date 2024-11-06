import { apiFetch } from "~/lib/api-utils";
import { LoginApiResponse } from "~/types/auth";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const url = `${import.meta.env.VITE_API_URL}/auth/login`;

  return await apiFetch<LoginApiResponse>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}

export async function signup({
  email,
  name,
  password,
  username,
}: {
  email: string;
  name: string;
  password: string;
  username: string;
}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password, username }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error.message;
  }

  return res.json();
}
