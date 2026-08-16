import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchByCategory } from '../lib/googleBooks';
import { useLibrary } from '../context/LibraryContext';
import type { BrowseCategory } from '../data/categories';
import BookCard from './BookCard';
import ShelfPicker from './ShelfPicker';

interface CategoryRowProps {
  category: BrowseCategory;
}

export default function CategoryRow({ category }: CategoryRowProps) {
  const [books, setBooks] = useState<Awaited<ReturnType<typeof searchByCategory>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { books: libraryBooks, addBook } = useLibrary();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    searchByCategory(category.subject)
      .then((items) => {
        if (!cancelled) setBooks(items);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category.subject]);

  if (!loading && !error && books.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-stone-800">{category.label}</h2>

      {loading && (
        <p className="text-sm text-stone-400">טוען...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-stone-400">לא ניתן לטעון קטגוריה זו כרגע.</p>
      )}

      {!loading && !error && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {books.map((book) => {
            const inLibrary = libraryBooks.some((b) => b.id === book.id);
            return (
              <div key={book.id} className="w-36 flex-shrink-0 sm:w-40">
                <BookCard
                  book={book}
                  onClick={() => navigate(`/book/${book.id}`, { state: book })}
                  footer={
                    inLibrary ? (
                      <p className="text-center text-xs font-medium text-emerald-700">
                        ✓ בספרייה
                      </p>
                    ) : (
                      <ShelfPicker onAdd={(shelf) => addBook(book, shelf)} />
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
