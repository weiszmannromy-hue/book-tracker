import type { LibraryBook, ReadingSession } from '../types';
import { addDays, todayStr } from './dates';

export function datesWithSessions(sessions: ReadingSession[]): Set<string> {
  return new Set(sessions.map((s) => s.date));
}

/** רצף ימים רצוף (streak) שמסתיים היום - אם היום אין סשן, הרצף הוא 0. */
export function streakDays(sessions: ReadingSession[]): number {
  const dates = datesWithSessions(sessions);
  let streak = 0;
  let cursor = todayStr();
  while (dates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function readingDaysInMonth(
  sessions: ReadingSession[],
  year: number,
  month: number,
): number {
  const dates = new Set(
    sessions
      .filter((s) => {
        const [y, m] = s.date.split('-').map(Number);
        return y === year && m - 1 === month;
      })
      .map((s) => s.date),
  );
  return dates.size;
}

export function totalMinutes(sessions: ReadingSession[]): number {
  return sessions.reduce((sum, s) => sum + s.minutes, 0);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} שע׳ ${rest} דק׳` : `${hours} שע׳`;
}

export interface RatingBucket {
  stars: number;
  count: number;
}

export function ratingDistribution(books: LibraryBook[]): RatingBucket[] {
  const rated = books.filter((b) => b.shelf === 'finished' && b.rating);
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: rated.filter((b) => b.rating === stars).length,
  }));
}
