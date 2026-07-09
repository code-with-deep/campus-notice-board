import { methodNotAllowed, sendServerError, sendValidationError } from "@/lib/api";
import { parseNoticesListQuery } from "@/lib/notices-query";
import { prisma } from "@/lib/prisma";
import { validateNoticeInput } from "@/lib/validation";
import { NOTICE_ORDER_BY } from "@/utils/constants";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { where, skip, take, page, limit } = parseNoticesListQuery(req.query);

      const [notices, total] = await Promise.all([
        prisma.notice.findMany({
          where,
          orderBy: NOTICE_ORDER_BY,
          skip,
          take,
        }),
        prisma.notice.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return res.status(200).json({
        notices,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    }

    if (req.method === "POST") {
      const { data, errors, isValid } = validateNoticeInput(req.body);

      if (!isValid) {
        return sendValidationError(res, errors);
      }

      const notice = await prisma.notice.create({ data });

      return res.status(201).json({ notice });
    }

    return methodNotAllowed(res, ["GET", "POST"]);
  } catch (error) {
    return sendServerError(res, error);
  }
}
