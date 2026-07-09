export function methodNotAllowed(res, allowedMethods = []) {
  if (allowedMethods.length > 0) {
    res.setHeader("Allow", allowedMethods.join(", "));
  }

  return res.status(405).json({ error: "Method not allowed." });
}

export function sendError(res, statusCode, message, details = null) {
  const payload = { error: message };

  if (details && Object.keys(details).length > 0) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
}

export function sendValidationError(res, errors) {
  return sendError(res, 400, "Validation failed.", errors);
}

export function sendServerError(res, error) {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  return sendError(res, 500, "An unexpected error occurred. Please try again later.");
}

export function parseNoticeId(rawId) {
  const id = Number.parseInt(String(rawId), 10);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}
