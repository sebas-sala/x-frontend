import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import type { Notification } from "~/types/notification";

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const { sender: user, message, createdAt } = notification;

  const time = new Date(createdAt).getTime();

  return (
    <li className="flex cursor-pointer items-start space-x-4 border-b bg-white p-4 shadow transition hover:bg-gray-50">
      {typeof user !== "string" ? (
        <>
          <div className="flex min-w-0 flex-1 gap-2">
            <Avatar>
              <AvatarFallback>{user?.name}</AvatarFallback>
              <AvatarImage src={user?.name} alt={`${user?.name}'s avatar`} />
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-bold">{user?.name}</span>
                </p>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(time, { addSuffix: true })}
                </p>
              </div>
              <p>{message}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <p className="mt-1 text-xs text-gray-400">
            {formatDistanceToNow(time, { addSuffix: true })}
          </p>
        </div>
      )}
    </li>
  );
}
