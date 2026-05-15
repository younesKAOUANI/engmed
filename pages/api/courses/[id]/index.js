import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { updateCourseSchema, examSchema, mongoId } from "@/lib/validations";
import { z } from "zod";

/** Full nested course include — reused in GET and PUT responses. */
function courseInclude(userId) {
  return {
    sequences: {
      orderBy: { order: "asc" },
      include: {
        quiz: {
          include: {
            userQuizzes: userId ? { where: { userId } } : false,
            questions:   { orderBy: { order: "asc" } },
          },
        },
        speechQuiz: {
          include: {
            userSpeechQuizzes: userId ? { where: { userId } } : false,
            questions:         true,
          },
        },
        video: true,
        file:  true,
      },
    },
    exam: { include: { questions: { orderBy: { order: "asc" } } } },
  };
}

export default apiHandler({}, async (req, res) => {
  const { id }     = z.object({ id: mongoId }).parse(req.query);
  const userId     = typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (req.method === "GET") {
    const course = await prisma.course.findUnique({
      where:   { id },
      include: courseInclude(userId),
    });
    if (!course) return res.status(404).json({ error: "Course not found." });
    return res.status(200).json(course);
  }

  if (req.method === "PUT") {
    const updateCourseWithExamSchema = updateCourseSchema.extend({
      exam: examSchema.optional(),
    });
    const { exam, ...courseFields } = updateCourseWithExamSchema.parse(req.body);

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...courseFields,
        ...(courseFields.published === true ? { publishedAt: new Date() } : {}),
        ...(exam ? {
          exam: {
            upsert: {
              create: {
                title:        exam.title,
                duration:     exam.duration,
                passingScore: exam.passingScore,
                questions:    { create: exam.questions.map((q, i) => ({ ...q, type: "MCQ", order: i + 1 })) },
              },
              update: {
                title:        exam.title,
                duration:     exam.duration,
                passingScore: exam.passingScore,
                questions: {
                  deleteMany: {},
                  create: exam.questions.map((q, i) => ({ ...q, type: "MCQ", order: i + 1 })),
                },
              },
            },
          },
        } : {}),
      },
      include: courseInclude(userId),
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.course.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
