import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/home', icon: '🏠', label: 'בית' },
  { to: '/library', icon: '📚', label: 'ספרייה' },
  { to: '/stats', icon: '📈', label: 'סטטיסטיקה' },
  { to: '/settings', icon: '⚙️', label: 'הגדרות' },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-violet-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-stretch justify-around px-2 py-1.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-stone-400 hover:text-stone-600'
              }`
            }
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
