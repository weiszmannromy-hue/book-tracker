import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import BookCard from '../components/BookCard';
import ShelfTabs from '../components/ShelfTabs';
import ShelfPicker from '../components/ShelfPicker';
import ProgressBar from '../components/ProgressBar';
import RatingStars from '../components/RatingStars';
import type { Shelf } from '../types';

type Tab = 'library' | 'wishlist';

export default function LibraryPage() {
  const { books, wishlist, removeFromWishlist, moveWishlistToLibrary, collections, addCollection } =
    useLibrary();
  const [tab, setTab] = useState<Tab>('library');
  const [activeShelf, setActiveShelf] = useState<Shelf | 'all'>('all');
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const navigate = useNavigate();

  const counts = useMemo(
    () => ({
      want: books.filter((b) => b.shelf === 'want').length,
      reading: books.filter((b) => b.shelf === 'reading').length,
      finished: books.filter((b) => b.shelf === 'finished').length,
    }),
    [books],
  );

  const byShelf =
    activeShelf === 'all' ? books : books.filter((b) => b.shelf === activeShelf);
  const visibleBooks =
    activeCollection === 'all'
      ? byShelf
      : byShelf.filter((b) => b.collectionIds?.includes(activeCollection));

  function handleNewCollection() {
    const name = window.prompt('שם האוסף החדש:');
    if (!name?.trim()) return;
    const collection = addCollection(name.trim());
    setActiveCollection(collection.id);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-800">הספרייה שלי</h1>
        <select
          value={activeCollection}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              handleNewCollection();
              return;
            }
            setActiveCollection(e.target.value);
          }}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-violet-500"
        >
          <option value="all">כל האוספים</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="__new__">+ אוסף חדש</option>
        </select>
      </div>

      <div className="mb-4 flex gap-2 rounded-full bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => setTab('library')}
          className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
            tab === 'library' ? 'bg-violet-600 text-white' : 'text-stone-500'
          }`}
        >
          הספרייה שלי
        </button>
        <button
          type="button"
          onClick={() => setTab('wishlist')}
          className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
            tab === 'wishlist' ? 'bg-violet-600 text-white' : 'text-stone-500'
          }`}
        >
          רשימת משאלות {wishlist.length > 0 && `(${wishlist.length})`}
        </button>
      </div>

      {tab === 'library' ? (
        <>
          <ShelfTabs active={activeShelf} counts={counts} onChange={setActiveShelf} />

          {books.length === 0 ? (
            <div className="mt-12 text-center text-stone-500">
              <p className="mb-3">הספרייה שלך ריקה עדיין.</p>
              <Link to="/search" className="font-medium text-violet-600 hover:underline">
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
        </>
      ) : wishlist.length === 0 ? (
        <div className="mt-12 text-center text-stone-500">
          <p className="mb-3">רשימת המשאלות שלך ריקה.</p>
          <Link to="/search" className="font-medium text-violet-600 hover:underline">
            חפש ספרים לשמור →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {wishlist.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              footer={
                <div className="flex flex-col gap-2">
                  <ShelfPicker onAdd={(shelf) => moveWishlistToLibrary(book.id, shelf)} />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(book.id)}
                    className="text-xs text-stone-400 hover:text-red-600"
                  >
                    הסר מהרשימה
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <Link
        to="/search"
        aria-label="חפש והוסף ספר"
        className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-2xl text-white shadow-lg transition-transform hover:scale-105"
      >
        +
      </Link>
    </div>
  );
}
