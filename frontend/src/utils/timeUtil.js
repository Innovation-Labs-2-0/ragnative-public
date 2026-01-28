export const humanizeTime = (dateString) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString + "Z");
  const now = new Date();

  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just Now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  // Same year → no year shown, but use user's locale
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  }

  // Different year → show year
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
