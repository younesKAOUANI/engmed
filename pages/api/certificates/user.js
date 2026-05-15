import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";

export default apiHandler({ auth: true, methods: ["GET"] }, async (_req, res, { session }) => {
  const certificates = await prisma.certificate.findMany({
    where:   { userId: session.user.id },
    include: { course: { select: { id: true, title: true, thumbnail: true } } },
    orderBy: { issuedAt: "desc" },
  });
  return res.status(200).json(certificates);
});
