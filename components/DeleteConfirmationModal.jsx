import { useEffect, useRef } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DeleteConfirmationModal({
  notice,
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus?.();
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !notice) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Close delete confirmation"
        onClick={isDeleting ? undefined : onCancel}
        disabled={isDeleting}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Are you sure?</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete <span className="font-medium text-slate-900 dark:text-slate-100">{notice.title}</span>.
          This action cannot be undone.
        </p>

        {isDeleting ? (
          <div className="mt-6">
            <LoadingSpinner size="sm" label="Deleting notice..." />
          </div>
        ) : (
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
