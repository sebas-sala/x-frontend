import { apiFetch, setSearchParams } from "~/lib/api-utils";
import { NotificationApiResponseList } from "~/types/notification";

export async function getNotifications({
  token,
  page,
}: {
  token?: string;
  page?: number;
}): Promise<NotificationApiResponseList> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/notifications`);

  setSearchParams(url, { page });

  return apiFetch<NotificationApiResponseList>(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}
