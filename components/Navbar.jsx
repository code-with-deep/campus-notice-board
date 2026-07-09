import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900">
            NB
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Campus Notice Board</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Official campus announcements</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/notices/new"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-offset-slate-900"
          >
            Create Notice
          </Link>
        </div>
      </div>
    </header>
  );
}
