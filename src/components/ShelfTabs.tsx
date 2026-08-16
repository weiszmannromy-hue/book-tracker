import { SHELVES, type Shelf } from '../types';

interface ShelfTabsProps {
  active: Shelf | 'all';
  counts: Record<Shelf, number>;
  onChange: (shelf: Shelf | 'all') => void;
}

export default function ShelfTabs({ active, counts, onChange }: ShelfTabsProps) {
  const total = SHELVES.reduce((sum, s) => sum + counts[s.id], 0);
  const tabs: { id: Shelf | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'הכל', count: total },
    ...SHELVES.map((s) => ({ id: s.id, label: s.label, count: counts[s.id] })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-violet-600 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          {tab.label} <span className="opacity-70">({tab.count})</span>
        </button>
      ))}
    </div>
  );
}
