import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true }, async (req, res, { session }) => {
  const { id } = z.object({ id: mongoId }).parse(req.query);

  if (req.method === "GET") {
    const enrollment = await prisma.enrollment.findUnique({
      where:   { id },
      include: { course: true },
    });
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found." });
    if (enrollment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You do not own this enrollment." });
    }
    return res.status(200).json({ success: true, enrollment });
  }

  if (req.method === "DELETE") {
    const enrollment = await prisma.enrollment.findUnique({ where: { id }, select: { userId: true } });
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found." });
    if (enrollment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You do not own this enrollment." });
    }
    await prisma.enrollment.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
