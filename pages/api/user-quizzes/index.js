import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { submitQuizSchema } from "@/lib/validations";

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  const { quizId, score, passed } = submitQuizSchema.parse(req.body);

  const result = await prisma.userQuiz.upsert({
    where:  { userId_quizId: { userId: session.user.id, quizId } },
    update: { score, passed, attemptedAt: new Date() },
    create: { userId: session.user.id, quizId, score, passed },
  });

  return res.status(200).json(result);
});
