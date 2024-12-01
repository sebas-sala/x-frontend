import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import NotificationsList from "~/components/notifications/notifications-list";
import { useNotificationStore } from "~/store/notification";
import { useMemo, useState } from "react";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const notifications = useNotificationStore().notifications;

  const filteredNotifications = useMemo(() => {
    return activeTab === "all"
      ? notifications
      : notifications.filter((notification) => notification.type === activeTab);
  }, [notifications, activeTab]);

  return (
    <main className="mx-auto max-w-2xl">
      <h1 className="mb-2 px-2 pt-2 text-2xl font-bold">Notifications</h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        defaultValue="all"
        className="w-full"
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
        <TabsContent value="message">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
        <TabsContent value="comment">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
        <TabsContent value="like">
          <NotificationsList notifications={filteredNotifications} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
