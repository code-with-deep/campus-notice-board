/**
 * Format a date for display in the UI.
 */
export function formatPublishDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Convert a Date or ISO string to the value expected by datetime-local inputs.
 */
export function toDateTimeLocalValue(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
}

export function getCategoryBadgeClass(category) {
  const classes = {
    Exam: "bg-violet-100 text-violet-800 ring-violet-200",
    Event: "bg-sky-100 text-sky-800 ring-sky-200",
    General: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  };

  return classes[category] || "bg-slate-100 text-slate-700 ring-slate-200";
}

export function getPriorityBadgeClass(priority) {
  if (priority === "Urgent") {
    return "bg-red-600 text-white ring-red-700";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

/**
 * Lightweight fetch wrapper with consistent error handling.
 */
export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.error || "Something went wrong. Please try again.");
    error.status = response.status;
    error.details = payload?.details || null;
    throw error;
  }

  return payload;
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error.details && typeof error.details === "object") {
    const firstDetail = Object.values(error.details).find(Boolean);
    if (firstDetail) return firstDetail;
  }

  if (error.message && !error.message.includes("fetch")) {
    return error.message;
  }

  if (error.status === 404) {
    return "The requested notice could not be found.";
  }

  if (error.status >= 500) {
    return "A server error occurred. Please try again later.";
  }

  return fallback;
}

export function buildNoticesQueryString({ q = "", category = "", priority = "", page = 1, limit = 6 } = {}) {
  const params = new URLSearchParams();

  if (q.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  if (priority) params.set("priority", priority);
  if (page > 1) params.set("page", String(page));
  if (limit !== 6) params.set("limit", String(limit));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
