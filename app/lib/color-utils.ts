export function getActionIconColor(action: string) {
  const color = action.toLowerCase();

  const colors = {
    comment: "bg-blue-500",
    like: "bg-red-500",
    views: "bg-green-500",
    bookmark: "bg-yellow-500",
  };

  return colors[color as keyof typeof colors];
}

export function getActionColorName(action: string) {
  const color = action.toLowerCase();

  const colors = {
    comment: "text-blue-500",
    like: "text-red-500",
    views: "text-green-500",
    bookmark: "text-yellow-500",
  };

  return colors[color as keyof typeof colors];
}
