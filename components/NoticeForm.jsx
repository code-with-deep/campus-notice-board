import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/utils/constants";
import { toDateTimeLocalValue } from "@/utils/helpers";

const EMPTY_FORM = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
  image: "",
};

export default function NoticeForm({
  initialValues = null,
  onSubmit,
  onCancelHref = "/",
  submitLabel = "Save Notice",
  isSubmitting = false,
  serverErrors = null,
  showReset = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [clientErrors, setClientErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const isSubmittingRef = useRef(false);
  const isEditMode = Boolean(initialValues);

  const applyInitialValues = useCallback((values) => {
    if (!values) {
      setFormData(EMPTY_FORM);
      return;
    }

    setFormData({
      title: values.title || "",
      body: values.body || "",
      category: values.category || "General",
      priority: values.priority || "Normal",
      publishDate: toDateTimeLocalValue(values.publishDate),
      image: values.image || "",
    });
  }, []);

  useEffect(() => {
    applyInitialValues(initialValues);
  }, [initialValues, applyInitialValues]);

  useEffect(() => {
    setImagePreviewError(false);
  }, [formData.image]);

  const fieldError = (field) => clientErrors[field] || serverErrors?.[field] || "";

  const inputClassName = useMemo(
    () =>
      "block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700 dark:disabled:bg-slate-800",
    [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (clientErrors[name] || serverErrors?.[name]) {
      setClientErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const validateClient = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!formData.body.trim()) {
      errors.body = "Body is required.";
    }

    if (!formData.publishDate) {
      errors.publishDate = "Publish date is required.";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || isSubmittingRef.current) {
      return;
    }

    if (!validateClient()) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await onSubmit({
        title: formData.title.trim(),
        body: formData.body.trim(),
        category: formData.category,
        priority: formData.priority,
        publishDate: new Date(formData.publishDate).toISOString(),
        image: formData.image.trim() || null,
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleReset = () => {
    setClientErrors({});
    setImagePreviewError(false);
    applyInitialValues(isEditMode ? initialValues : null);
  };

  const showImagePreview = formData.image.trim() && !imagePreviewError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
              placeholder="Enter notice title"
            />
            {fieldError("title") ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fieldError("title")}</p> : null}
          </div>

          <div>
            <label htmlFor="body" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              rows={8}
              value={formData.body}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
              placeholder="Write the notice details"
            />
            <div className="mt-2 flex items-center justify-between gap-4">
              {fieldError("body") ? <p className="text-sm text-red-600 dark:text-red-400">{fieldError("body")}</p> : <span />}
              <p className="text-xs text-slate-400 dark:text-slate-500">{formData.body.length} characters</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClassName}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldError("category") ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fieldError("category")}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="priority" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClassName}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldError("priority") ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fieldError("priority")}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="publishDate" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Publish Date
            </label>
            <input
              id="publishDate"
              name="publishDate"
              type="datetime-local"
              value={formData.publishDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
            />
            {fieldError("publishDate") ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fieldError("publishDate")}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Image URL <span className="text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
              placeholder="https://example.com/image.jpg"
            />
            {fieldError("image") ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fieldError("image")}</p> : null}

            {showImagePreview ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image.trim()}
                  alt="Notice preview"
                  className="h-48 w-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ErrorMessage message={serverErrors?.form} />

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-700 sm:flex-row sm:justify-end">
        {showReset ? (
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Reset Form
          </button>
        ) : null}
        <Link
          href={onCancelHref}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-slate-900/40 dark:border-t-slate-900" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
