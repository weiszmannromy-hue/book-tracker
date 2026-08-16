import type {
  Collection,
  LibraryBook,
  ReadingGoal,
  ReadingSession,
  WishlistItem,
} from '../types';

const KEYS = {
  library: 'book-tracker:library',
  sessions: 'book-tracker:sessions',
  wishlist: 'book-tracker:wishlist',
  collections: 'book-tracker:collections',
  goal: 'book-tracker:goal',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage לא זמין (מצב פרטי/חסימה) - מתעלמים בשקט
  }
}

export function loadLibrary(): LibraryBook[] {
  const data = load<LibraryBook[]>(KEYS.library, []);
  return Array.isArray(data) ? data : [];
}
export function saveLibrary(books: LibraryBook[]): void {
  save(KEYS.library, books);
}

export function loadSessions(): ReadingSession[] {
  const data = load<ReadingSession[]>(KEYS.sessions, []);
  return Array.isArray(data) ? data : [];
}
export function saveSessions(sessions: ReadingSession[]): void {
  save(KEYS.sessions, sessions);
}

export function loadWishlist(): WishlistItem[] {
  const data = load<WishlistItem[]>(KEYS.wishlist, []);
  return Array.isArray(data) ? data : [];
}
export function saveWishlist(items: WishlistItem[]): void {
  save(KEYS.wishlist, items);
}

export function loadCollections(): Collection[] {
  const data = load<Collection[]>(KEYS.collections, []);
  return Array.isArray(data) ? data : [];
}
export function saveCollections(collections: Collection[]): void {
  save(KEYS.collections, collections);
}

export function loadGoal(): ReadingGoal {
  return load<ReadingGoal>(KEYS.goal, {});
}
export function saveGoal(goal: ReadingGoal): void {
  save(KEYS.goal, goal);
}

/** מוחק את כל הנתונים השמורים של האפליקציה (הגדרות > איפוס). */
export function resetAllData(): void {
  Object.values(KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // מתעלמים בשקט
    }
  });
}
