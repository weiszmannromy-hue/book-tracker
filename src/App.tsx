import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import BookDetailPage from './pages/BookDetailPage';

export default function App() {
  return (
    <LibraryProvider>
      <HashRouter>
        <div className="min-h-screen bg-stone-50 pb-20">
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </HashRouter>
    </LibraryProvider>
  );
}
