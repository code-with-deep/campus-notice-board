export default function NoticeCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="h-44 bg-slate-200 dark:bg-slate-700" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex gap-2">
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-4 h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
          <div className="h-10 flex-1 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 flex-1 rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
