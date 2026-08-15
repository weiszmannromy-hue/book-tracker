import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import type { Book, LibraryBook, Shelf } from '../types';
import { loadLibrary, saveLibrary } from '../lib/storage';

type Action =
  | { type: 'ADD_BOOK'; book: Book; shelf: Shelf }
  | { type: 'REMOVE_BOOK'; id: string }
  | { type: 'SET_SHELF'; id: string; shelf: Shelf }
  | { type: 'SET_PROGRESS'; id: string; currentPage: number }
  | { type: 'SET_RATING'; id: string; rating: number | undefined }
  | { type: 'SET_REVIEW'; id: string; review: string };

function touch(book: LibraryBook): LibraryBook {
  return { ...book, updatedAt: new Date().toISOString() };
}

function reducer(state: LibraryBook[], action: Action): LibraryBook[] {
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
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, dispatch] = useReducer(reducer, undefined, loadLibrary);

  useEffect(() => {
    saveLibrary(books);
  }, [books]);

  const value: LibraryContextValue = {
    books,
    getBook: (id) => books.find((b) => b.id === id),
    addBook: (book, shelf) => dispatch({ type: 'ADD_BOOK', book, shelf }),
    removeBook: (id) => dispatch({ type: 'REMOVE_BOOK', id }),
    setShelf: (id, shelf) => dispatch({ type: 'SET_SHELF', id, shelf }),
    setProgress: (id, currentPage) =>
      dispatch({ type: 'SET_PROGRESS', id, currentPage }),
    setRating: (id, rating) => dispatch({ type: 'SET_RATING', id, rating }),
    setReview: (id, review) => dispatch({ type: 'SET_REVIEW', id, review }),
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
