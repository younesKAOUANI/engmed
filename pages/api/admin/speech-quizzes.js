import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { scoreSpeechSchema } from "@/lib/validations";

export default apiHandler({ auth: true, role: "ADMIN" }, async (req, res) => {
  if (req.method === "GET") {
    const submissions = await prisma.userSpeechQuiz.findMany({
      where:   { score: null },
      include: {
        user:       { select: { name: true, email: true } },
        speechQuiz: { select: { title: true } },
        question:   { select: { content: true } },
      },
      orderBy: { attemptedAt: "asc" }, // oldest first for fairness
    });
    return res.status(200).json(submissions);
  }

  if (req.method === "PUT") {
    const { id, score, notes, passed } = scoreSpeechSchema.parse(req.body);

    const record = await prisma.userSpeechQuiz.findUnique({ where: { id }, select: { id: true } });
    if (!record) return res.status(404).json({ error: "Submission not found." });

    const updated = await prisma.userSpeechQuiz.update({
      where: { id },
      data:  { score, notes, passed, scoredAt: new Date() },
    });
    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
