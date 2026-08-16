import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import type {
  Book,
  Collection,
  LibraryBook,
  ReadingGoal,
  ReadingSession,
  Shelf,
  WishlistItem,
} from '../types';
import {
  loadCollections,
  loadGoal,
  loadLibrary,
  loadSessions,
  loadWishlist,
  resetAllData,
  saveCollections,
  saveGoal,
  saveLibrary,
  saveSessions,
  saveWishlist,
} from '../lib/storage';
import { todayStr } from '../lib/dates';

type BookAction =
  | { type: 'ADD_BOOK'; book: Book; shelf: Shelf }
  | { type: 'REMOVE_BOOK'; id: string }
  | { type: 'SET_SHELF'; id: string; shelf: Shelf }
  | { type: 'SET_PROGRESS'; id: string; currentPage: number }
  | { type: 'SET_RATING'; id: string; rating: number | undefined }
  | { type: 'SET_REVIEW'; id: string; review: string }
  | { type: 'BUMP_PROGRESS'; id: string; delta: number }
  | { type: 'TOGGLE_COLLECTION'; id: string; collectionId: string };

function touch(book: LibraryBook): LibraryBook {
  return { ...book, updatedAt: new Date().toISOString() };
}

function booksReducer(state: LibraryBook[], action: BookAction): LibraryBook[] {
  switch (action.type) {
    case 'ADD_BOOK': {
      if (state.some((b) => b.id === action.book.id)) return state;
      const now = new Date().toISOString();
      const newBook: LibraryBook = {
        ...action.book,
        shelf: action.shelf,
        currentPage: 0,
        addedAt: now,
        updatedAt: now,
      };
      return [newBook, ...state];
    }
    case 'REMOVE_BOOK':
      return state.filter((b) => b.id !== action.id);
    case 'SET_SHELF':
      return state.map((b) =>
        b.id === action.id ? touch({ ...b, shelf: action.shelf }) : b,
      );
    case 'SET_PROGRESS':
      return state.map((b) =>
        b.id === action.id
          ? touch({ ...b, currentPage: action.currentPage })
          : b,
      );
    case 'SET_RATING':
      return state.map((b) =>
        b.id === action.id ? touch({ ...b, rating: action.rating }) : b,
      );
    case 'SET_REVIEW':
      return state.map((b) =>
        b.id === action.id ? touch({ ...b, review: action.review }) : b,
      );
    case 'BUMP_PROGRESS':
      return state.map((b) => {
        if (b.id !== action.id) return b;
        const max = b.pageCount && b.pageCount > 0 ? b.pageCount : Infinity;
        const currentPage = Math.min(max, b.currentPage + action.delta);
        const shelf: Shelf = b.shelf === 'want' ? 'reading' : b.shelf;
        return touch({ ...b, currentPage, shelf });
      });
    case 'TOGGLE_COLLECTION':
      return state.map((b) => {
        if (b.id !== action.id) return b;
        const current = b.collectionIds ?? [];
        const collectionIds = current.includes(action.collectionId)
          ? current.filter((c) => c !== action.collectionId)
          : [...current, action.collectionId];
        return touch({ ...b, collectionIds });
      });
    default:
      return state;
  }
}

interface LibraryContextValue {
  books: LibraryBook[];
  getBook: (id: string) => LibraryBook | undefined;
  addBook: (book: Book, shelf: Shelf) => void;
  removeBook: (id: string) => void;
  setShelf: (id: string, shelf: Shelf) => void;
  setProgress: (id: string, currentPage: number) => void;
  setRating: (id: string, rating: number | undefined) => void;
  setReview: (id: string, review: string) => void;
  toggleBookCollection: (id: string, collectionId: string) => void;

  sessions: ReadingSession[];
  addSession: (bookId: string, pagesRead: number, minutes: number, date?: string) => void;

  wishlist: WishlistItem[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (id: string) => void;
  moveWishlistToLibrary: (id: string, shelf: Shelf) => void;

  collections: Collection[];
  addCollection: (name: string) => Collection;
  removeCollection: (id: string) => void;

  goal: ReadingGoal;
  setGoal: (goal: ReadingGoal) => void;

  resetAll: () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, dispatchBooks] = useReducer(booksReducer, undefined, loadLibrary);
  const [sessions, setSessions] = useState<ReadingSession[]>(loadSessions);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(loadWishlist);
  const [collections, setCollections] = useState<Collection[]>(loadCollections);
  const [goal, setGoalState] = useState<ReadingGoal>(loadGoal);

  useEffect(() => saveLibrary(books), [books]);
  useEffect(() => saveSessions(sessions), [sessions]);
  useEffect(() => saveWishlist(wishlist), [wishlist]);
  useEffect(() => saveCollections(collections), [collections]);
  useEffect(() => saveGoal(goal), [goal]);

  const value: LibraryContextValue = {
    books,
    getBook: (id) => books.find((b) => b.id === id),
    addBook: (book, shelf) => dispatchBooks({ type: 'ADD_BOOK', book, shelf }),
    removeBook: (id) => dispatchBooks({ type: 'REMOVE_BOOK', id }),
    setShelf: (id, shelf) => dispatchBooks({ type: 'SET_SHELF', id, shelf }),
    setProgress: (id, currentPage) =>
      dispatchBooks({ type: 'SET_PROGRESS', id, currentPage }),
    setRating: (id, rating) => dispatchBooks({ type: 'SET_RATING', id, rating }),
    setReview: (id, review) => dispatchBooks({ type: 'SET_REVIEW', id, review }),
    toggleBookCollection: (id, collectionId) =>
      dispatchBooks({ type: 'TOGGLE_COLLECTION', id, collectionId }),

    sessions,
    addSession: (bookId, pagesRead, minutes, date = todayStr()) => {
      const session: ReadingSession = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        bookId,
        date,
        pagesRead,
        minutes,
        createdAt: new Date().toISOString(),
      };
      setSessions((prev) => [session, ...prev]);
      if (pagesRead > 0) {
        dispatchBooks({ type: 'BUMP_PROGRESS', id: bookId, delta: pagesRead });
      }
    },

    wishlist,
    addToWishlist: (book) => {
      setWishlist((prev) => {
        if (prev.some((b) => b.id === book.id)) return prev;
        return [{ ...book, addedAt: new Date().toISOString() }, ...prev];
      });
    },
    removeFromWishlist: (id) =>
      setWishlist((prev) => prev.filter((b) => b.id !== id)),
    moveWishlistToLibrary: (id, shelf) => {
      const item = wishlist.find((b) => b.id === id);
      if (!item) return;
      dispatchBooks({ type: 'ADD_BOOK', book: item, shelf });
      setWishlist((prev) => prev.filter((b) => b.id !== id));
    },

    collections,
    addCollection: (name) => {
      const collection: Collection = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
      };
      setCollections((prev) => [...prev, collection]);
      return collection;
    },
    removeCollection: (id) => {
      setCollections((prev) => prev.filter((c) => c.id !== id));
      books
        .filter((b) => b.collectionIds?.includes(id))
        .forEach((b) => dispatchBooks({ type: 'TOGGLE_COLLECTION', id: b.id, collectionId: id }));
    },

    goal,
    setGoal: setGoalState,

    resetAll: () => {
      resetAllData();
      window.location.reload();
    },
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary חייב לרוץ בתוך LibraryProvider');
  return ctx;
}
