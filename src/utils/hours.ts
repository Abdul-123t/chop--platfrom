export interface DayHours {
  day: number;
  open: string;
  close: string;
  closed: boolean;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatTime(value: string): string {
  const [hoursText = '0', minutes = '00'] = value.split(':');
  const hours = Number(hoursText);
  const suffix = hours >= 12 ? 'pm' : 'am';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === '00' ? `${display}${suffix}` : `${display}:${minutes}${suffix}`;
}

export function describeDay(entry: DayHours | undefined): string {
  if (!entry || entry.closed) return 'Closed';
  if (entry.open === entry.close) return 'Open 24 hours';
  return `${formatTime(entry.open)} – ${formatTime(entry.close)}`;
}

export function lagosDay(now = new Date()): number {
  return new Date(now.getTime() + 60 * 60_000).getUTCDay();
}

export function todayHours(hours: DayHours[], now = new Date()): DayHours | undefined {
  const day = lagosDay(now);
  return hours.find((entry) => entry.day === day);
}
