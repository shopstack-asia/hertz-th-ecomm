"use client";

interface PointsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PointsPagination({
  page,
  totalPages,
  onPageChange,
}: PointsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2 py-6"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="min-h-tap rounded-lg border border-hertz-border px-3 py-2 text-sm font-medium disabled:opacity-50"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="px-3 text-sm text-hertz-black-80">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="min-h-tap rounded-lg border border-hertz-border px-3 py-2 text-sm font-medium disabled:opacity-50"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
