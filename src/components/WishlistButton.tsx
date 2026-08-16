interface WishlistButtonProps {
  inWishlist: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export default function WishlistButton({ inWishlist, onAdd, onRemove }: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={inWishlist ? onRemove : onAdd}
      className={`w-full rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
        inWishlist
          ? 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100'
          : 'border-stone-200 text-stone-500 hover:border-violet-300 hover:text-violet-700'
      }`}
    >
      {inWishlist ? '♥ ברשימת המשאלות' : '♡ הוסף למשאלות'}
    </button>
  );
}
