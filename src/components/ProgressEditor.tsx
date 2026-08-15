import type { ChangeEvent } from 'react';

interface ProgressEditorProps {
  currentPage: number;
  pageCount?: number;
  onChange: (page: number) => void;
}

export default function ProgressEditor({
  currentPage,
  pageCount,
  onChange,
}: ProgressEditorProps) {
  const max = pageCount && pageCount > 0 ? pageCount : Math.max(currentPage, 1);
  const percent = Math.min(100, Math.round((currentPage / max) * 100));

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) return;
    onChange(Math.max(0, Math.min(value, max)));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={max}
          value={Math.min(currentPage, max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-emerald-700"
        />
        <input
          type="number"
          min={0}
          max={max}
          value={currentPage}
          onChange={handleNumberChange}
          className="w-20 rounded-lg border border-stone-300 px-2 py-1 text-sm outline-none focus:border-emerald-600"
        />
      </div>
      <p className="text-sm text-stone-500">
        עמוד {currentPage}
        {pageCount ? ` מתוך ${pageCount} (${percent}%)` : ''}
      </p>
    </div>
  );
}
