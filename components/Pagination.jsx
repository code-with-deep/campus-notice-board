export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((pageNumber) => {
    if (totalPages <= 5) return true;
    if (pageNumber === 1 || pageNumber === totalPages) return true;
    return Math.abs(pageNumber - page) <= 1;
  });

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Showing {start}-{end} of {total} notices
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Previous
        </button>

        {pages.map((pageNumber, index) => {
          const previousPage = pages[index - 1];
          const showEllipsis = previousPage && pageNumber - previousPage > 1;

          return (
            <span key={pageNumber} className="flex items-center gap-2">
              {showEllipsis ? <span className="px-1 text-slate-400">...</span> : null}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pageNumber === page
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {pageNumber}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
