import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({
  initialValue = '',
  onSearch,
  loading,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="חפש לפי כותרת, מחבר או ISBN..."
        className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:opacity-60"
      >
        {loading ? 'מחפש...' : 'חפש'}
      </button>
    </form>
  );
}
