import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { getBookById } from '../lib/googleBooks';
import { SHELVES, type Book, type Shelf } from '../types';
import ProgressEditor from '../components/ProgressEditor';
import RatingStars from '../components/RatingStars';
import ReviewForm from '../components/ReviewForm';
import WishlistButton from '../components/WishlistButton';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    getBook,
    addBook,
    removeBook,
    setShelf,
    setProgress,
    setRating,
    setReview,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    collections,
    addCollection,
    toggleBookCollection,
  } = useLibrary();

  const libraryBook = id ? getBook(id) : undefined;
  const [fallbackBook, setFallbackBook] = useState<Book | null>(
    (location.state as Book | undefined) ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (libraryBook || fallbackBook || !id) return;
    setLoading(true);
    getBookById(id)
      .then((book) => {
        if (book) setFallbackBook(book);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, libraryBook, fallbackBook]);

  if (!id) return null;

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-stone-500">טוען...</p>;
  }

  const book: Book | undefined = libraryBook ?? fallbackBook ?? undefined;

  if (notFound || !book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-stone-500">
        <p className="mb-3">הספר לא נמצא.</p>
        <Link to="/search" className="font-medium text-violet-600 hover:underline">
          חזרה לחיפוש
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-stone-500 hover:text-stone-700"
      >
        ← חזרה
      </button>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="mx-auto w-40 shrink-0 overflow-hidden rounded-lg bg-stone-100 shadow sm:mx-0">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`כריכת הספר ${book.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center text-xs text-stone-400">
              אין כריכה זמינה
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-stone-800">{book.title}</h1>
          <p className="mt-1 text-stone-500">
            {book.authors.length ? book.authors.join(', ') : 'מחבר לא ידוע'}
          </p>
          {book.publishedDate && (
            <p className="mt-1 text-xs text-stone-400">
              תאריך פרסום: {book.publishedDate}
            </p>
          )}

          {!libraryBook ? (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {SHELVES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addBook(book, s.id)}
                    className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    הוסף אל "{s.label}"
                  </button>
                ))}
              </div>
              <div className="w-48">
                <WishlistButton
                  inWishlist={wishlist.some((b) => b.id === book.id)}
                  onAdd={() => addToWishlist(book)}
                  onRemove={() => removeFromWishlist(book.id)}
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-5">
              <div>
                <p className="mb-1.5 text-sm font-medium text-stone-700">מדף</p>
                <div className="flex flex-wrap gap-2">
                  {SHELVES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShelf(libraryBook.id, s.id as Shelf)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        libraryBook.shelf === s.id
                          ? 'bg-violet-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-stone-700">אוספים</p>
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => {
                    const active = libraryBook.collectionIds?.includes(c.id) ?? false;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleBookCollection(libraryBook.id, c.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? 'bg-violet-600 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      const name = window.prompt('שם האוסף החדש:');
                      if (!name?.trim()) return;
                      const collection = addCollection(name.trim());
                      toggleBookCollection(libraryBook.id, collection.id);
                    }}
                    className="rounded-full border border-dashed border-stone-300 px-3 py-1 text-xs font-medium text-stone-500 hover:border-violet-400 hover:text-violet-600"
                  >
                    + אוסף חדש
                  </button>
                </div>
              </div>

              {libraryBook.shelf === 'reading' && (
                <div>
                  <p className="mb-1.5 text-sm font-medium text-stone-700">
                    התקדמות קריאה
                  </p>
                  <ProgressEditor
                    currentPage={libraryBook.currentPage}
                    pageCount={libraryBook.pageCount}
                    onChange={(page) => setProgress(libraryBook.id, page)}
                  />
                </div>
              )}

              {libraryBook.shelf === 'finished' && (
                <div>
                  <p className="mb-1.5 text-sm font-medium text-stone-700">דירוג</p>
                  <RatingStars
                    rating={libraryBook.rating ?? 0}
                    onChange={(rating) =>
                      setRating(libraryBook.id, rating === 0 ? undefined : rating)
                    }
                  />
                </div>
              )}

              <div>
                <p className="mb-1.5 text-sm font-medium text-stone-700">
                  ביקורת אישית
                </p>
                <ReviewForm
                  review={libraryBook.review ?? ''}
                  onSave={(review) => setReview(libraryBook.id, review)}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  removeBook(libraryBook.id);
                  navigate('/library');
                }}
                className="self-start text-sm text-red-600 hover:underline"
              >
                הסר מהספרייה
              </button>
            </div>
          )}
        </div>
      </div>

      {book.description && (
        <div className="mt-8">
          <h2 className="mb-2 text-lg font-semibold text-stone-800">תיאור</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600">
            {book.description}
          </p>
        </div>
      )}
    </div>
  );
}
