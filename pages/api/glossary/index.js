import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { createGlossarySchema } from "@/lib/validations";

export default apiHandler({ auth: true }, async (req, res, { session }) => {
  if (req.method === "GET") {
    const entries = await prisma.glossary.findMany({
      where:   { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(entries);
  }

  if (req.method === "POST") {
    const body  = createGlossarySchema.parse(req.body);
    const entry = await prisma.glossary.create({
      data: { userId: session.user.id, ...body },
    });
    return res.status(201).json(entry);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
