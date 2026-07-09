import Link from "next/link";
import {
  formatPublishDate,
  getCategoryBadgeClass,
  getPriorityBadgeClass,
} from "@/utils/helpers";

export default function NoticeCard({ notice, onDelete, isDeleting = false }) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {notice.image ? (
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={notice.image}
            alt={`${notice.title} illustration`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryBadgeClass(notice.category)}`}
          >
            {notice.category}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getPriorityBadgeClass(notice.priority)}`}
          >
            {notice.priority}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{notice.title}</h2>
        <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
          {notice.body}
        </p>

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Published {formatPublishDate(notice.publishDate)}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
          <Link
            href={`/notices/edit/${notice.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(notice)}
            disabled={isDeleting}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900 sm:flex-none"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
