export type Shelf = 'want' | 'reading' | 'finished';

export const SHELVES: { id: Shelf; label: string }[] = [
  { id: 'want', label: 'רוצה לקרוא' },
  { id: 'reading', label: 'קורא כרגע' },
  { id: 'finished', label: 'סיימתי' },
];

export function shelfLabel(shelf: Shelf): string {
  return SHELVES.find((s) => s.id === shelf)?.label ?? shelf;
}

/** ספר כפי שמתקבל מתוצאות חיפוש (Google Books), לפני שהוא נוסף לספרייה. */
export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
}

/** ספר בספרייה האישית של המשתמש, כולל נתוני מעקב. */
export interface LibraryBook extends Book {
  shelf: Shelf;
  currentPage: number;
  rating?: number;
  review?: string;
  addedAt: string;
  updatedAt: string;
}
