import type { Book } from '../types';

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

interface GoogleVolume {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}

interface GoogleBooksResponse {
  items?: GoogleVolume[];
}

// Google Books מחזיר לעיתים תיאור עם תגיות HTML בסיסיות; מסירים אותן כדי
// שנוכל להציג טקסט רגיל בבטחה (בלי dangerouslySetInnerHTML).
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function normalize(volume: GoogleVolume): Book {
  const info = volume.volumeInfo ?? {};
  // ה-API מחזיר קישורי כריכה ב-http; דפדפנים מודרניים חוסמים תוכן מעורב, אז משדרגים ל-https.
  const cover = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return {
    id: volume.id,
    title: info.title ?? 'ללא כותרת',
    authors: info.authors ?? [],
    coverUrl: cover?.replace(/^http:/, 'https:'),
    description: info.description ? stripHtml(info.description) : undefined,
    pageCount: info.pageCount,
    publishedDate: info.publishedDate,
  };
}

export async function searchBooks(query: string): Promise<Book[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${API_URL}?q=${encodeURIComponent(trimmed)}&maxResults=24`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('החיפוש נכשל, נסה שוב מאוחר יותר');
  }

  const data: GoogleBooksResponse = await res.json();
  return (data.items ?? []).map(normalize);
}

export async function getBookById(id: string): Promise<Book | null> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  const volume: GoogleVolume = await res.json();
  return normalize(volume);
}
