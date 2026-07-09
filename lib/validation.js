import { CATEGORIES, PRIORITIES } from "@/utils/constants";

const MAX_TITLE_LENGTH = 255;
const MAX_BODY_LENGTH = 10000;
const MAX_IMAGE_URL_LENGTH = 2048;

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function normalizeOptionalString(value) {
  const normalized = normalizeString(value);
  return normalized.length > 0 ? normalized : null;
}

function parsePublishDate(value) {
  if (value === undefined || value === null || value === "") {
    return { error: "Publish date is required." };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { error: "Publish date must be a valid date." };
  }

  return { value: date };
}

/**
 * Validate notice input for create and update operations.
 * Returns sanitized data and field-level errors.
 */
export function validateNoticeInput(input = {}, { isUpdate = false } = {}) {
  const errors = {};

  const hasTitle = Object.prototype.hasOwnProperty.call(input, "title");
  const hasBody = Object.prototype.hasOwnProperty.call(input, "body");
  const hasCategory = Object.prototype.hasOwnProperty.call(input, "category");
  const hasPriority = Object.prototype.hasOwnProperty.call(input, "priority");
  const hasPublishDate = Object.prototype.hasOwnProperty.call(input, "publishDate");
  const hasImage = Object.prototype.hasOwnProperty.call(input, "image");

  const data = {};

  if (!isUpdate || hasTitle) {
    const title = normalizeString(input.title);

    if (!title) {
      errors.title = "Title is required.";
    } else if (title.length > MAX_TITLE_LENGTH) {
      errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
    } else {
      data.title = title;
    }
  }

  if (!isUpdate || hasBody) {
    const body = normalizeString(input.body);

    if (!body) {
      errors.body = "Body is required.";
    } else if (body.length > MAX_BODY_LENGTH) {
      errors.body = `Body must be ${MAX_BODY_LENGTH} characters or fewer.`;
    } else {
      data.body = body;
    }
  }

  if (!isUpdate || hasCategory) {
    const category = normalizeString(input.category);

    if (!category) {
      errors.category = "Category is required.";
    } else if (!CATEGORIES.includes(category)) {
      errors.category = "Category must be Exam, Event, or General.";
    } else {
      data.category = category;
    }
  }

  if (!isUpdate || hasPriority) {
    const priority = normalizeString(input.priority);

    if (!priority) {
      errors.priority = "Priority is required.";
    } else if (!PRIORITIES.includes(priority)) {
      errors.priority = "Priority must be Normal or Urgent.";
    } else {
      data.priority = priority;
    }
  }

  if (!isUpdate || hasPublishDate) {
    const publishDateResult = parsePublishDate(input.publishDate);

    if (publishDateResult.error) {
      errors.publishDate = publishDateResult.error;
    } else {
      data.publishDate = publishDateResult.value;
    }
  }

  if (!isUpdate || hasImage) {
    const image = normalizeOptionalString(input.image);

    if (image) {
      if (image.length > MAX_IMAGE_URL_LENGTH) {
        errors.image = `Image URL must be ${MAX_IMAGE_URL_LENGTH} characters or fewer.`;
      } else if (!isValidUrl(image)) {
        errors.image = "Image must be a valid http or https URL.";
      } else {
        data.image = image;
      }
    } else {
      data.image = null;
    }
  }

  return {
    data,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
