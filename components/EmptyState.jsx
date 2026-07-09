import Link from "next/link";

export default function EmptyState({
  title = "No notices available.",
  message = "Create your first campus notice to keep students informed about exams, events, and general updates.",
  showCreateButton = true,
  actionLabel = "Create Notice",
  onAction = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300"
        aria-hidden="true"
      >
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>

      {showCreateButton ? (
        onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            href="/notices/new"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {actionLabel}
          </Link>
        )
      ) : null}
    </div>
  );
}
