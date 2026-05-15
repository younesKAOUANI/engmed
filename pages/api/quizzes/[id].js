import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true, methods: ["GET"] }, async (req, res) => {
  const { id } = z.object({ id: mongoId }).parse(req.query);

  const quiz = await prisma.quiz.findUnique({
    where:   { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) return res.status(404).json({ error: "Quiz not found." });

  return res.status(200).json(quiz);
});
