import {
  Home as HomeIcon,
  Hash as HashIcon,
  Bell as BellIcon,
  Inbox as InboxIcon,
  Bookmark as BookmarkIcon,
  User as UserIcon,
} from "lucide-react";

export const links = [
  { name: "Home", href: "/home", icon: <HomeIcon /> },
  { name: "Explore", href: "/explore", icon: <HashIcon /> },
  { name: "Notifications", href: "/notifications", icon: <BellIcon /> },
  { name: "Messages", href: "/messages", icon: <InboxIcon /> },
  { name: "Bookmarks", href: "/bookmarks", icon: <BookmarkIcon /> },
  { name: "Profile", href: "/profile", icon: <UserIcon /> },
];
