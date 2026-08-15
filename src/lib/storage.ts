import type { LibraryBook } from '../types';

const STORAGE_KEY = 'book-tracker:library';

export function loadLibrary(): LibraryBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLibrary(books: LibraryBook[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // localStorage לא זמין (מצב פרטי/חסימה) - מתעלמים בשקט
  }
}
