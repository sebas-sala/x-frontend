import { NotificationItem } from "~/components/notifications/notification-item";

import type { Notification } from "~/types/notification";

interface IProps {
  notifications: Notification[];
}

export default function NotificationsList({ notifications }: IProps) {
  return (
    <ul>
      {notifications.map((notification, index) => (
        <NotificationItem key={index} notification={notification} />
      ))}
    </ul>
  );
}
