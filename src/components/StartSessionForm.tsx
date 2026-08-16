import { useState, type FormEvent } from 'react';
import type { LibraryBook } from '../types';

interface StartSessionFormProps {
  books: LibraryBook[];
  defaultBookId?: string;
  onSubmit: (bookId: string, pagesRead: number, minutes: number) => void;
  onCancel: () => void;
}

export default function StartSessionForm({
  books,
  defaultBookId,
  onSubmit,
  onCancel,
}: StartSessionFormProps) {
  const [bookId, setBookId] = useState(defaultBookId ?? books[0]?.id ?? '');
  const [pages, setPages] = useState('');
  const [minutes, setMinutes] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pagesRead = Math.max(0, Number(pages) || 0);
    const minutesRead = Math.max(0, Number(minutes) || 0);
    if (!bookId || pagesRead <= 0) return;
    onSubmit(bookId, pagesRead, minutesRead);
  }

  if (books.length === 0) {
    return (
      <p className="mt-3 rounded-xl bg-violet-50 p-4 text-sm text-stone-600">
        אין לך עדיין ספרים בספרייה. הוסיפי ספר כדי להתחיל לתעד קריאה.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4"
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-stone-700">איזה ספר?</span>
        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
        >
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">כמה עמודים קראת?</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="0"
            className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">כמה דקות (לא חובה)</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="0"
            className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          שמור סשן קריאה
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
