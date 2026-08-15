import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../lib/googleBooks';
import { useLibrary } from '../context/LibraryContext';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import ShelfPicker from '../components/ShelfPicker';
import type { Book } from '../types';

export default function SearchPage() {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const { books, addBook } = useLibrary();
  const navigate = useNavigate();

  async function handleSearch(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const items = await searchBooks(query);
      setResults(items);
    } catch {
      setError('החיפוש נכשל. בדוק את החיבור לאינטרנט ונסה שוב.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-stone-800">חיפוש ספרים</h1>
      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && searched && !error && results.length === 0 && (
        <p className="mt-8 text-center text-stone-500">לא נמצאו תוצאות.</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {results.map((book) => {
          const inLibrary = books.some((b) => b.id === book.id);
          return (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/book/${book.id}`, { state: book })}
              footer={
                inLibrary ? (
                  <p className="text-center text-xs font-medium text-emerald-700">
                    ✓ כבר בספרייה
                  </p>
                ) : (
                  <ShelfPicker onAdd={(shelf) => addBook(book, shelf)} />
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}
