import { useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { todayStr } from '../lib/dates';
import {
  calendarCells,
  MONTH_LABELS,
  toDateStr,
  WEEKDAY_LABELS_SHORT,
} from '../lib/dates';
import {
  datesWithSessions,
  formatMinutes,
  ratingDistribution,
  readingDaysInMonth,
  streakDays,
  totalMinutes,
} from '../lib/stats';

const RING_SLOTS = 8;

export default function StatsPage() {
  const { books, sessions } = useLibrary();
  const today = todayStr();
  const now = new Date();
  const [viewedYear, setViewedYear] = useState(now.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(now.getMonth());

  const finishedCount = books.filter((b) => b.shelf === 'finished').length;
  const streak = streakDays(sessions);
  const monthDays = readingDaysInMonth(sessions, viewedYear, viewedMonth);
  const minutes = totalMinutes(sessions);
  const sessionDates = useMemo(() => datesWithSessions(sessions), [sessions]);
  const ratings = ratingDistribution(books);
  const maxRatingCount = Math.max(1, ...ratings.map((r) => r.count));

  const cells = calendarCells(viewedYear, viewedMonth);

  function changeMonth(delta: number) {
    let m = viewedMonth + delta;
    let y = viewedYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewedMonth(m);
    setViewedYear(y);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* טבעת סטריק */}
      <div className="relative mx-auto mt-4 h-64 w-64 rounded-full border-2 border-dashed border-violet-200">
        {Array.from({ length: RING_SLOTS }).map((_, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / RING_SLOTS;
          const radius = 118;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const filled = i < Math.min(finishedCount, RING_SLOTS);
          return (
            <span
              key={i}
              className="absolute text-2xl transition-opacity"
              style={{
                left: `calc(50% + ${x}px - 16px)`,
                top: `calc(50% + ${y}px - 16px)`,
                opacity: filled ? 1 : 0.25,
              }}
            >
              📖
            </span>
          );
        })}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-stone-800">{finishedCount}</span>
          <span className="text-sm text-stone-500">ספרים שסיימת</span>
        </div>
      </div>

      {/* שורת סטטיסטיקות */}
      <div className="mt-6 flex items-stretch justify-around rounded-xl border border-stone-200 bg-white py-4 text-center">
        <div>
          <p className="text-xl font-bold text-stone-800">{streak}</p>
          <p className="text-xs text-stone-500">ימי רצף</p>
        </div>
        <div className="w-px bg-stone-200" />
        <div>
          <p className="text-xl font-bold text-stone-800">{monthDays}</p>
          <p className="text-xs text-stone-500">ימי קריאה החודש</p>
        </div>
        <div className="w-px bg-stone-200" />
        <div>
          <p className="text-xl font-bold text-stone-800">{formatMinutes(minutes)}</p>
          <p className="text-xs text-stone-500">זמן קריאה כולל</p>
        </div>
      </div>

      {/* לוח פעילות חודשי */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="rounded-full px-2 py-1 text-stone-400 hover:bg-stone-100"
            aria-label="חודש קודם"
          >
            ‹
          </button>
          <h2 className="text-sm font-semibold text-stone-700">
            {MONTH_LABELS[viewedMonth]} {viewedYear}
          </h2>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="rounded-full px-2 py-1 text-stone-400 hover:bg-stone-100"
            aria-label="חודש הבא"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-stone-400">
          {WEEKDAY_LABELS_SHORT.map((d) => (
            <span key={d}>{d}</span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={`empty-${i}`} />;
            const dateStr = toDateStr(new Date(viewedYear, viewedMonth, day));
            const hasSession = sessionDates.has(dateStr);
            const isToday = dateStr === today;
            return (
              <div key={dateStr} className="flex justify-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                    hasSession
                      ? 'border-violet-500 bg-violet-500 text-white'
                      : 'border-stone-200 text-stone-600'
                  } ${isToday && !hasSession ? 'border-2 border-violet-500 text-violet-700' : ''}`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* התפלגות דירוגים */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-stone-700">דירוגים</h2>
        <div className="flex flex-col gap-2">
          {ratings.map((r) => (
            <div key={r.stars} className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 text-amber-500">{'★'.repeat(r.stars)}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${(r.count / maxRatingCount) * 100}%` }}
                />
              </div>
              <span className="w-4 shrink-0 text-stone-500">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
