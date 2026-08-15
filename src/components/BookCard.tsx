import type { ReactNode } from 'react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  footer?: ReactNode;
  onClick?: () => void;
}

export default function BookCard({ book, footer, onClick }: BookCardProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Wrapper
        onClick={onClick}
        className={`flex flex-1 flex-col text-right ${onClick ? 'cursor-pointer' : ''}`}
      >
        <div className="flex aspect-[2/3] items-center justify-center bg-stone-100">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`כריכת הספר ${book.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="px-2 text-center text-xs text-stone-400">
              אין כריכה זמינה
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-stone-800">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-xs text-stone-500">
            {book.authors.length ? book.authors.join(', ') : 'מחבר לא ידוע'}
          </p>
        </div>
      </Wrapper>
      {footer && <div className="border-t border-stone-100 p-3">{footer}</div>}
    </div>
  );
}
