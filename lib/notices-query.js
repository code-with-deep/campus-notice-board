import { CATEGORIES, PRIORITIES } from "@/utils/constants";

export const DEFAULT_PAGE_SIZE = 6;
export const MAX_PAGE_SIZE = 50;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseNoticesListQuery(query = {}) {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(MAX_PAGE_SIZE, parsePositiveInt(query.limit, DEFAULT_PAGE_SIZE));
  const search = typeof query.q === "string" ? query.q.trim() : "";
  const category = CATEGORIES.includes(query.category) ? query.category : "";
  const priority = PRIORITIES.includes(query.priority) ? query.priority : "";

  const filters = [];

  if (search) {
    filters.push({
      OR: [{ title: { contains: search } }, { body: { contains: search } }],
    });
  }

  if (category) {
    filters.push({ category });
  }

  if (priority) {
    filters.push({ priority });
  }

  const where = filters.length > 0 ? { AND: filters } : undefined;

  return {
    page,
    limit,
    search,
    category,
    priority,
    where,
    skip: (page - 1) * limit,
    take: limit,
  };
}
