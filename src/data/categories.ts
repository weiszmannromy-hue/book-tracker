/** קטגוריות ברירת מחדל לעיון בעמוד החיפוש, עם מונח subject מתאים ב-Google Books. */
export interface BrowseCategory {
  id: string;
  label: string;
  subject: string;
}

export const BROWSE_CATEGORIES: BrowseCategory[] = [
  { id: 'fiction', label: 'בדיוני', subject: 'fiction' },
  { id: 'fantasy', label: 'פנטזיה', subject: 'fantasy' },
  { id: 'scifi', label: 'מדע בדיוני', subject: 'science fiction' },
  { id: 'mystery', label: 'מתח ופשע', subject: 'mystery' },
  { id: 'romance', label: 'רומנטיקה', subject: 'romance' },
  { id: 'history', label: 'היסטוריה', subject: 'history' },
  { id: 'biography', label: 'עיון וביוגרפיה', subject: 'biography' },
  { id: 'children', label: 'ילדים ונוער', subject: 'juvenile fiction' },
];
