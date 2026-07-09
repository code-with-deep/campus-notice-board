export default function LoadingSpinner({ size = "md", label = "Loading..." }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-slate-700 ${sizeClasses[size] || sizeClasses.md}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      {label ? <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p> : null}
    </div>
  );
}
