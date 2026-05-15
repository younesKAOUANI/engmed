import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { checkExamSchema } from "@/lib/validations";

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  const { examId } = checkExamSchema.parse(req.body);

  const record = await prisma.userExam.findUnique({
    where:  { userId_examId: { userId: session.user.id, examId } },
    select: { passed: true, score: true },
  });

  return res.status(200).json({ passed: record?.passed ?? false, score: record?.score ?? null });
});
