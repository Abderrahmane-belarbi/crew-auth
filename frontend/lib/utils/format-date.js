export function formatDate(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();

  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Today
  if (diffDays === 0) {
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    return `Today, ${timeFormatter.format(date)}`;
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Within a week
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Fallback: full date
  return date.toLocaleDateString();
}