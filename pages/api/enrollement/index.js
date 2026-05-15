import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true }, async (req, res, { session }) => {
  if (req.method === "GET") {
    const enrollments = await prisma.enrollment.findMany({
      where:   { userId: session.user.id },
      include: { course: { select: { id: true, title: true, thumbnail: true, level: true, totalStudents: true } } },
      orderBy: { enrolledAt: "desc" },
    });
    return res.status(200).json({ success: true, enrollments });
  }

  if (req.method === "POST") {
    const { courseId } = z.object({ courseId: mongoId }).parse(req.body);

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
    if (!course) return res.status(404).json({ error: "Course not found." });

    const enrollment = await prisma.enrollment.create({
      data: { userId: session.user.id, courseId },
    });
    return res.status(201).json({ success: true, enrollment });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
