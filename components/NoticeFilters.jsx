import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/utils/constants";

export default function NoticeFilters({ filters, onChange, onClear, hasActiveFilters }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Search
          </label>
          <input
            id="search"
            name="search"
            type="search"
            value={filters.q}
            onChange={(event) => onChange({ q: event.target.value, page: 1 })}
            placeholder="Search by title or body..."
            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
          />
        </div>

        <div>
          <label htmlFor="filter-category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value, page: 1 })}
            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-priority" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Priority
          </label>
          <select
            id="filter-priority"
            value={filters.priority}
            onChange={(event) => onChange({ priority: event.target.value, page: 1 })}
            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
