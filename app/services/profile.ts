import { ApiResponseError } from "~/types";
import { Profile } from "~/types/profle";

export async function getProfile(username: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/users/${username}/profile`,
  );

  if (!res.ok) {
    const error = (await res.json()) as Promise<ApiResponseError>;
    throw error;
  }

  return res.json() as Promise<Profile>;
}
