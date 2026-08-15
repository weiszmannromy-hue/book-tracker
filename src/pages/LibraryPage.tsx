import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import BookCard from '../components/BookCard';
import ShelfTabs from '../components/ShelfTabs';
import ProgressBar from '../components/ProgressBar';
import RatingStars from '../components/RatingStars';
import type { Shelf } from '../types';

export default function LibraryPage() {
  const { books } = useLibrary();
  const [activeShelf, setActiveShelf] = useState<Shelf | 'all'>('all');
  const navigate = useNavigate();

  const counts = useMemo(
    () => ({
      want: books.filter((b) => b.shelf === 'want').length,
      reading: books.filter((b) => b.shelf === 'reading').length,
      finished: books.filter((b) => b.shelf === 'finished').length,
    }),
    [books],
  );

  const visibleBooks =
    activeShelf === 'all' ? books : books.filter((b) => b.shelf === activeShelf);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-stone-800">הספרייה שלי</h1>
      <ShelfTabs active={activeShelf} counts={counts} onChange={setActiveShelf} />

      {books.length === 0 ? (
        <div className="mt-12 text-center text-stone-500">
          <p className="mb-3">הספרייה שלך ריקה עדיין.</p>
          <Link
            to="/search"
            className="font-medium text-emerald-700 hover:underline"
          >
            חפש ספרים כדי להתחיל →
          </Link>
        </div>
      ) : visibleBooks.length === 0 ? (
        <p className="mt-12 text-center text-stone-500">אין ספרים במדף הזה.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/book/${book.id}`)}
              footer={
                <div className="flex flex-col gap-2">
                  {book.shelf === 'reading' && (
                    <ProgressBar
                      currentPage={book.currentPage}
                      pageCount={book.pageCount}
                    />
                  )}
                  {book.shelf === 'finished' && (
                    <RatingStars rating={book.rating ?? 0} size="sm" />
                  )}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
