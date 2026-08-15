import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import BookDetailPage from './pages/BookDetailPage';

export default function App() {
  return (
    <LibraryProvider>
      <HashRouter>
        <div className="min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/library" replace />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="*" element={<Navigate to="/library" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </LibraryProvider>
  );
}
