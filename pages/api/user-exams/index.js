import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { submitExamSchema } from "@/lib/validations";

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  const { examId, score, passed } = submitExamSchema.parse(req.body);

  const result = await prisma.userExam.upsert({
    where:  { userId_examId: { userId: session.user.id, examId } },
    update: { score, passed, attemptedAt: new Date() },
    create: { userId: session.user.id, examId, score, passed },
  });

  return res.status(200).json(result);
});
