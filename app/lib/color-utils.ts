export function getActionIconColor(action: string) {
  const color = action.toLowerCase();

  const colors = {
    comment: "bg-blue-500/60",
    likes: "bg-red-500/60",
    views: "bg-green-500/60",
    bookmarks: "bg-yellow-500/60",
  };

  return colors[color as keyof typeof colors];
}

export function getActionColorName(action: string) {
  const color = action.toLowerCase();

  const colors = {
    comment: "text-blue-500/60",
    likes: "text-red-500/60",
    views: "text-green-500/60",
    bookmarks: "text-yellow-500/60",
  };

  return colors[color as keyof typeof colors];
}
