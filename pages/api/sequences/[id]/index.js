import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { updateSequenceSchema, mongoId } from "@/lib/validations";
import { z } from "zod";

const SEQUENCE_INCLUDE = {
  video:      true,
  file:       true,
  quiz:       { include: { questions: { orderBy: { order: "asc" } } } },
  speechQuiz: { include: { questions: true } },
};

export default apiHandler({ auth: true }, async (req, res) => {
  const { id } = z.object({ id: mongoId }).parse(req.query);

  if (req.method === "GET") {
    const sequence = await prisma.courseSequence.findUnique({ where: { id }, include: SEQUENCE_INCLUDE });
    if (!sequence) return res.status(404).json({ error: "Sequence not found." });
    return res.status(200).json(sequence);
  }

  if (req.method === "PUT") {
    const body = updateSequenceSchema.parse(req.body);

    const updated = await prisma.courseSequence.update({
      where: { id },
      data: {
        ...(body.title       ? { title:       body.title }       : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.order       ? { order:       body.order }       : {}),
        ...(body.video ? { video: { upsert: { create: body.video, update: body.video } } } : {}),
        ...(body.file  ? { file:  { upsert: { create: body.file,  update: body.file  } } } : {}),
        ...(body.quiz  ? { quiz:  { upsert: {
          create: {
            title: body.quiz.title, duration: body.quiz.duration, attempts: body.quiz.attempts,
            questions: { create: body.quiz.questions.map((q, i) => ({ ...q, type: "MCQ", order: i + 1 })) },
          },
          update: {
            title: body.quiz.title, duration: body.quiz.duration, attempts: body.quiz.attempts,
            questions: { deleteMany: {}, create: body.quiz.questions.map((q, i) => ({ ...q, type: "MCQ", order: i + 1 })) },
          },
        }}} : {}),
        ...(body.speechQuiz ? { speechQuiz: { upsert: {
          create: {
            title: body.speechQuiz.title, duration: body.speechQuiz.duration, attempts: body.speechQuiz.attempts,
            questions: { create: body.speechQuiz.questions.map(q => ({ ...q, type: "SPEECH" })) },
          },
          update: {
            title: body.speechQuiz.title, duration: body.speechQuiz.duration, attempts: body.speechQuiz.attempts,
            questions: { deleteMany: {}, create: body.speechQuiz.questions.map(q => ({ ...q, type: "SPEECH" })) },
          },
        }}} : {}),
      },
      include: SEQUENCE_INCLUDE,
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.courseSequence.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
