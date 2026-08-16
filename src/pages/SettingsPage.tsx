import { useState, type FormEvent } from 'react';
import { useLibrary } from '../context/LibraryContext';

export default function SettingsPage() {
  const { goal, setGoal, resetAll, collections, removeCollection } = useLibrary();
  const [dailyPages, setDailyPages] = useState(String(goal.dailyPages ?? ''));

  function handleSaveGoal(e: FormEvent) {
    e.preventDefault();
    const value = Number(dailyPages);
    setGoal({ dailyPages: value > 0 ? value : undefined });
  }

  function handleReset() {
    if (window.confirm('לאפס את כל הנתונים באפליקציה? הפעולה בלתי הפיכה.')) {
      resetAll();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">הגדרות</h1>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="mb-1 text-sm font-semibold text-stone-700">יעד קריאה יומי</h2>
        <p className="mb-3 text-xs text-stone-500">
          כמה עמודים תרצי לקרוא ביום? יופיע כמד התקדמות במסך "היום".
        </p>
        <form onSubmit={handleSaveGoal} className="flex gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={dailyPages}
            onChange={(e) => setDailyPages(e.target.value)}
            placeholder="לדוגמה: 20"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            שמור
          </button>
        </form>
      </section>

      {collections.length > 0 && (
        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-stone-700">אוספים</h2>
          <ul className="flex flex-col gap-2">
            {collections.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-700">{c.name}</span>
                <button
                  type="button"
                  onClick={() => removeCollection(c.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  מחק אוסף
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
        <h2 className="mb-1 text-sm font-semibold text-red-700">איפוס נתונים</h2>
        <p className="mb-3 text-xs text-red-600">
          מוחק את הספרייה, רשימת המשאלות, הסשנים והאוספים - לצמיתות.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          אפס את כל הנתונים
        </button>
      </section>

      <p className="mt-8 text-center text-xs text-stone-400">המדף שלי · המידע נשמר בדפדפן שלך בלבד</p>
    </div>
  );
}
