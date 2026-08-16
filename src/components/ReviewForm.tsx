import { useState, type FocusEvent } from 'react';

interface ReviewFormProps {
  review: string;
  onSave: (review: string) => void;
}

export default function ReviewForm({ review, onSave }: ReviewFormProps) {
  const [value, setValue] = useState(review);

  function handleBlur(e: FocusEvent<HTMLTextAreaElement>) {
    if (e.target.value !== review) onSave(e.target.value);
  }

  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="כתוב כאן את הביקורת האישית שלך על הספר..."
      rows={4}
      className="w-full resize-y rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
    />
  );
}
