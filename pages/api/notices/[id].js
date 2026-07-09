import {
  methodNotAllowed,
  parseNoticeId,
  sendError,
  sendServerError,
  sendValidationError,
} from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { validateNoticeInput } from "@/lib/validation";

export default async function handler(req, res) {
  const id = parseNoticeId(req.query.id);

  if (!id) {
    return sendError(res, 400, "Invalid notice ID.");
  }

  try {
    if (req.method === "GET") {
      const notice = await prisma.notice.findUnique({ where: { id } });

      if (!notice) {
        return sendError(res, 404, "Notice not found.");
      }

      return res.status(200).json({ notice });
    }

    if (req.method === "PUT") {
      const existingNotice = await prisma.notice.findUnique({ where: { id } });

      if (!existingNotice) {
        return sendError(res, 404, "Notice not found.");
      }

      const { data, errors, isValid } = validateNoticeInput(req.body);

      if (!isValid) {
        return sendValidationError(res, errors);
      }

      const notice = await prisma.notice.update({
        where: { id },
        data,
      });

      return res.status(200).json({ notice });
    }

    if (req.method === "DELETE") {
      const existingNotice = await prisma.notice.findUnique({ where: { id } });

      if (!existingNotice) {
        return sendError(res, 404, "Notice not found.");
      }

      await prisma.notice.delete({ where: { id } });

      return res.status(200).json({ success: true });
    }

    return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
  } catch (error) {
    return sendServerError(res, error);
  }
}
