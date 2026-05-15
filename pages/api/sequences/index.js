import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { createSequenceSchema } from "@/lib/validations";

const SEQUENCE_INCLUDE = {
  video:      true,
  file:       true,
  quiz:       { include: { questions: { orderBy: { order: "asc" } } } },
  speechQuiz: { include: { questions: true } },
};

export default apiHandler({ auth: true, role: ["ADMIN", "INSTRUCTOR"], methods: ["POST"] }, async (req, res) => {
  const body = createSequenceSchema.parse(req.body);

  // Verify the course exists before creating a sequence
  const course = await prisma.course.findUnique({ where: { id: body.courseId }, select: { id: true } });
  if (!course) return res.status(404).json({ error: "Course not found." });

  const sequence = await prisma.courseSequence.create({
    data: {
      title:       body.title,
      description: body.description,
      order:       body.order,
      courseId:    body.courseId,
      ...(body.video     ? { video:      { create: body.video } } : {}),
      ...(body.file      ? { file:       { create: body.file } } : {}),
      ...(body.quiz      ? { quiz:       { create: {
        title:     body.quiz.title,
        duration:  body.quiz.duration,
        attempts:  body.quiz.attempts,
        questions: { create: body.quiz.questions.map((q, i) => ({ ...q, type: "MCQ", order: i + 1 })) },
      }}} : {}),
      ...(body.speechQuiz ? { speechQuiz: { create: {
        title:     body.speechQuiz.title,
        duration:  body.speechQuiz.duration,
        attempts:  body.speechQuiz.attempts,
        questions: { create: body.speechQuiz.questions.map(q => ({ ...q, type: "SPEECH" })) },
      }}} : {}),
    },
    include: SEQUENCE_INCLUDE,
  });

  return res.status(201).json(sequence);
});
