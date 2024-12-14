import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import NotificationsList from "~/components/notifications/notifications-list";
import { useMemo, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getNotifications } from "~/services/notifications-service";
import { ErrorPage } from "~/components/error-page";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { getSession } from "~/sessions";
import { Notification } from "~/types/notification";
import { useInfiniteScroll } from "react-continous-scroll";
import { Loader } from "~/components/loader";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const token = session.get("token");

  try {
    const notificationsResponse = await getNotifications({ token });

    return {
      notificationsResponse,
    };
  } catch {
    throw new Error("Failed to load notifications");
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorPage error={error} />;
}

export default function Notifications() {
  const { notificationsResponse } = useLoaderData<typeof loader>();

  const { data: notifications, meta } = notificationsResponse;

  const [pagination, setPagination] = useState(meta.pagination);

  const [activeTab, setActiveTab] = useState("all");

  async function fetchMore(page: number) {
    try {
      const res = await getNotifications({ page });
      setPagination(res.meta.pagination);

      return res.data;
    } catch (e) {
      return [];
    }
  }

  const { data, loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData: notifications as unknown as Notification[],
    loadMore: pagination.hasNextPage,
    onLoadMore: () => fetchMore(pagination.page + 1),
    maxAttempts: 3,
  });

  const filteredNotifications = useMemo(() => {
    return activeTab === "all"
      ? data
      : data.filter((notification) => notification.type === activeTab);
  }, [activeTab, data]);

  return (
    <main className="mx-auto">
      <h1 className="sticky top-0 mb-2 px-2 pt-2 text-2xl font-bold">
        Notifications
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        defaultValue="all"
        className="w-full"
      >
        <TabsList className="sticky top-0 grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="follow">Follows</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
        <TabsContent value="comment">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
        <TabsContent value="follow">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
        <TabsContent value="like">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
      </Tabs>

      <Loader ref={loadMoreRef} loading={loading} loadMore={loadMore}>
        <p className="text-gray-500">No more posts to load</p>
      </Loader>
    </main>
  );
}
