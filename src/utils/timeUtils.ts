// Utility functions for time handling and formatting

export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 9 * 60 + 41; // fallback 9:41 AM

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3] ? match[3].toUpperCase() : 'AM';

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  let minutes = totalMinutes % (24 * 60);
  if (minutes < 0) minutes += 24 * 60;

  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const modifier = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedMins = mins.toString().padStart(2, '0');
  return `${hours}:${paddedMins} ${modifier}`;
}

export function addMinutesToTimeString(timeStr: string, minutesToAdd: number): string {
  const currentMinutes = parseTimeToMinutes(timeStr);
  return formatMinutesToTime(currentMinutes + minutesToAdd);
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const clean = name.replace(/["'()]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
