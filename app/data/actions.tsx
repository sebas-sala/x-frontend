import { Heart, Bookmark, BarChart2, MessageCircleIcon } from "lucide-react";

export const postActions = [
  {
    name: "Comment",
    icon: () => <MessageCircleIcon size={16} />,
  },
  {
    name: "Like",
    icon: () => <Heart size={16} />,
  },
  {
    name: "Views",
    icon: () => <BarChart2 size={16} />,
  },
  {
    name: "Bookmark",
    icon: () => <Bookmark size={16} />,
  },
];
