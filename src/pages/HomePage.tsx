import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { addDays, startOfWeek, todayStr, WEEKDAY_LABELS_SHORT } from '../lib/dates';
import StartSessionForm from '../components/StartSessionForm';

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

export default function HomePage() {
  const { books, sessions, addSession, goal } = useLibrary();
  const today = todayStr();
  const [selectedDay, setSelectedDay] = useState(today);
  const [showForm, setShowForm] = useState(false);

  const weekDays = useMemo(() => {
    const start = startOfWeek(today);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [today]);

  const eligibleBooks = books.filter((b) => b.shelf !== 'finished');
  const defaultBookId =
    [...books]
      .filter((b) => b.shelf === 'reading')
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.id ??
    eligibleBooks[0]?.id;

  const daySessions = sessions
    .filter((s) => s.date === selectedDay)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const todayPages = sessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.pagesRead, 0);

  const goalPercent =
    goal.dailyPages && goal.dailyPages > 0
      ? Math.min(100, Math.round((todayPages / goal.dailyPages) * 100))
      : 0;

  function bookTitle(bookId: string): string {
    return books.find((b) => b.id === bookId)?.title ?? 'ספר שהוסר מהספרייה';
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold text-stone-800">היום</h1>

      <div className="mt-4 flex justify-between gap-1">
        {weekDays.map((day) => {
          const dayNum = Number(day.split('-')[2]);
          const isSelected = day === selectedDay;
          const isToday = day === today;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs transition-colors ${
                isSelected
                  ? 'bg-violet-600 text-white'
                  : isToday
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <span>{WEEKDAY_LABELS_SHORT[Number(new Date(day).getDay())]}</span>
              <span className="font-semibold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-stone-700">יעד קריאה יומי</span>
          {goal.dailyPages ? (
            <span className="text-stone-500">
              {todayPages} מתוך {goal.dailyPages} עמודים היום
            </span>
          ) : (
            <Link to="/settings" className="font-medium text-violet-600 hover:underline">
              הגדר יעד →
            </Link>
          )}
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100">
          {goal.dailyPages ? (
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${goalPercent}%` }}
            />
          ) : (
            <div
              className="h-full w-full rounded-full opacity-60"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, #e7e5e4, #e7e5e4 6px, #f5f5f4 6px, #f5f5f4 12px)',
              }}
            />
          )}
        </div>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          + התחל קריאה
        </button>
      ) : (
        <StartSessionForm
          books={eligibleBooks}
          defaultBookId={defaultBookId}
          onSubmit={(bookId, pages, minutes) => {
            addSession(bookId, pages, minutes, selectedDay);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-stone-500">
          {selectedDay === today ? 'סשנים של היום' : `סשנים של ${selectedDay}`}
        </h2>
        {daySessions.length === 0 ? (
          <p className="text-sm text-stone-400">אין עדיין סשני קריאה ביום הזה.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {daySessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-stone-100 bg-white px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-stone-700">{bookTitle(s.bookId)}</p>
                  <p className="text-xs text-stone-400">{formatTime(s.createdAt)}</p>
                </div>
                <div className="text-left text-xs text-stone-500">
                  <p>{s.pagesRead} עמודים</p>
                  {s.minutes > 0 && <p>{s.minutes} דק׳</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
