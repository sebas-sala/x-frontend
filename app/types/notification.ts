import { ApiResponse, ApiResponseList } from ".";
import { User } from "./user";

export const NotificationTypes = [
  "like",
  "comment",
  "follow",
  "message",
  "mention",
] as const;
export const NotificationPriorities = ["low", "medium", "high"] as const;
export const EntityTypes = ["post", "message", "comment", "like"] as const;

export type EntityType = (typeof EntityTypes)[number];
export type NotificationType = (typeof NotificationTypes)[number];
export type NotificationPriority = (typeof NotificationPriorities)[number];

export interface Notification {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  message: string;
  title: string;
  isRead: boolean;
  readAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  entityId?: string;
  entityType?: EntityType;
  type: NotificationType;
  priority: NotificationPriority;
  link?: string;
  receivers: User[];
  sender?: User | null | string;
}

export type NotificationApiResponse = ApiResponse<Notification>;
export type NotificationApiResponseList = ApiResponseList<Notification>;
