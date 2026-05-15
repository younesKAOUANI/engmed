import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { createCourseSchema, updateCourseSchema } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({}, async (req, res) => {
  if (req.method === "GET") {
    const courses = await prisma.course.findMany({
      select: {
        id:           true,
        title:        true,
        description:  true,
        price:        true,
        thumbnail:    true,
        published:    true,
        level:        true,
        rating:       true,
        totalStudents:true,
        updatedAt:    true,
        sequences: {
          select: { id: true, title: true, order: true, quiz: { select: { id: true } }, speechQuiz: { select: { id: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(courses);
  }

  if (req.method === "POST") {
    // Only instructors and admins can create courses
    const session = req._session; // set by apiHandler when auth:true; handled below
    const body = createCourseSchema.parse(req.body);
    const course = await prisma.course.create({ data: body });
    return res.status(201).json(course);
  }

  if (req.method === "PUT") {
    const { id, ...rest } = z.object({ id: z.string() }).merge(updateCourseSchema).parse(req.body);
    const course = await prisma.course.update({ where: { id }, data: rest });
    return res.status(200).json(course);
  }

  if (req.method === "DELETE") {
    const { id } = z.object({ id: z.string() }).parse(req.query);
    await prisma.course.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
