import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../lib/googleBooks';
import { useLibrary } from '../context/LibraryContext';
import { BROWSE_CATEGORIES } from '../data/categories';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import ShelfPicker from '../components/ShelfPicker';
import WishlistButton from '../components/WishlistButton';
import CategoryRow from '../components/CategoryRow';
import type { Book } from '../types';

export default function SearchPage() {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const { books, addBook, wishlist, addToWishlist, removeFromWishlist } = useLibrary();
  const navigate = useNavigate();

  async function handleSearch(query: string) {
    if (!query.trim()) {
      setSearched(false);
      return;
    }
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

  function clearSearch() {
    setSearched(false);
    setResults([]);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-stone-800">חיפוש ספרים</h1>
      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {searched ? (
        <>
          <button
            onClick={clearSearch}
            className="mt-4 text-sm font-medium text-violet-600 hover:underline"
          >
            ← חזרה לעיון לפי קטגוריה
          </button>

          {!loading && !error && results.length === 0 && (
            <p className="mt-8 text-center text-stone-500">לא נמצאו תוצאות.</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((book) => {
              const inLibrary = books.some((b) => b.id === book.id);
              const inWishlist = wishlist.some((b) => b.id === book.id);
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => navigate(`/book/${book.id}`, { state: book })}
                  footer={
                    <div className="flex flex-col gap-2">
                      {inLibrary ? (
                        <p className="text-center text-xs font-medium text-violet-700">
                          ✓ כבר בספרייה
                        </p>
                      ) : (
                        <>
                          <ShelfPicker onAdd={(shelf) => addBook(book, shelf)} />
                          <WishlistButton
                            inWishlist={inWishlist}
                            onAdd={() => addToWishlist(book)}
                            onRemove={() => removeFromWishlist(book.id)}
                          />
                        </>
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="mt-8">
          {BROWSE_CATEGORIES.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
