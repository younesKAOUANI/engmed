import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true, methods: ["DELETE"] }, async (req, res, { session }) => {
  const { id } = z.object({ id: mongoId }).parse(req.query);

  // Verify ownership before deleting
  const entry = await prisma.glossary.findUnique({ where: { id }, select: { userId: true } });
  if (!entry) return res.status(404).json({ error: "Glossary entry not found." });
  if (entry.userId !== session.user.id && session.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You do not own this glossary entry." });
  }

  await prisma.glossary.delete({ where: { id } });
  return res.status(204).end();
});
