export const CATEGORIES = ["Exam", "Event", "General"];

export const PRIORITIES = ["Normal", "Urgent"];

export const CATEGORY_OPTIONS = CATEGORIES.map((value) => ({
  value,
  label: value,
}));

export const PRIORITY_OPTIONS = PRIORITIES.map((value) => ({
  value,
  label: value,
}));

export const NOTICE_ORDER_BY = [
  { priority: "desc" },
  { publishDate: "desc" },
  { createdAt: "desc" },
];

export const DEFAULT_PAGE_SIZE = 6;
