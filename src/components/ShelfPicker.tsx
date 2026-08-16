import { useState } from 'react';
import { SHELVES, type Shelf } from '../types';

interface ShelfPickerProps {
  onAdd: (shelf: Shelf) => void;
}

export default function ShelfPicker({ onAdd }: ShelfPickerProps) {
  const [shelf, setShelf] = useState<Shelf>('want');

  return (
    <div className="flex gap-2">
      <select
        value={shelf}
        onChange={(e) => setShelf(e.target.value as Shelf)}
        className="flex-1 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-violet-500"
      >
        {SHELVES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onAdd(shelf)}
        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700"
      >
        הוסף
      </button>
    </div>
  );
}
