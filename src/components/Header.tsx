import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-emerald-700 text-white'
      : 'text-stone-600 hover:bg-stone-100'
  }`;

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink to="/library" className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <span className="text-lg font-bold text-stone-800">המדף שלי</span>
        </NavLink>
        <nav className="flex gap-2">
          <NavLink to="/search" className={navLinkClass}>
            חיפוש ספרים
          </NavLink>
          <NavLink to="/library" className={navLinkClass}>
            הספרייה שלי
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
