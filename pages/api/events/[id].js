import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true, role: ["ADMIN", "INSTRUCTOR"], methods: ["DELETE"] }, async (req, res) => {
  const { id } = z.object({ id: mongoId }).parse(req.query);

  const event = await prisma.speakingEvent.findUnique({ where: { id }, select: { id: true } });
  if (!event) return res.status(404).json({ error: "Event not found." });

  await prisma.speakingEvent.delete({ where: { id } });
  return res.status(204).end();
});
