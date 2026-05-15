import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { checkQuizSchema } from "@/lib/validations";

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  const { quizId } = checkQuizSchema.parse(req.body);

  const record = await prisma.userQuiz.findUnique({
    where:  { userId_quizId: { userId: session.user.id, quizId } },
    select: { passed: true, score: true, attemptedAt: true },
  });

  return res.status(200).json({ passed: record?.passed ?? false, score: record?.score ?? null });
});
