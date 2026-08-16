interface ProgressBarProps {
  currentPage: number;
  pageCount?: number;
}

export default function ProgressBar({
  currentPage,
  pageCount,
}: ProgressBarProps) {
  const percent =
    pageCount && pageCount > 0
      ? Math.min(100, Math.round((currentPage / pageCount) * 100))
      : 0;

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-stone-500">
        {pageCount
          ? `עמוד ${currentPage} מתוך ${pageCount} (${percent}%)`
          : `עמוד ${currentPage}`}
      </p>
    </div>
  );
}
