/**
 * Utility to format Date objects or ISO strings into readable IST strings.
 */
export function formatToIST(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  
  // Format options matching standard Indian conventions
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

/**
 * Returns a relative time display (e.g., "3 hours ago") mapped correctly to IST timezone.
 */
export function getRelativeTimeIST(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'Yesterday';
  
  return formatToIST(date);
}
