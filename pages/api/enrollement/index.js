import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({ error: "courseId is required" });
      }

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });

      if (existingEnrollment) {
        return res.status(400).json({ error: "User is already enrolled in this course" });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
        },
      });

      return res.status(201).json({ success: true, enrollment });
    } catch (error) {
      console.error("Enrollment creation failed:", error);
      return res.status(500).json({ error: "Failed to create enrollment" });
    }
  }

  if (req.method === "GET") {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: { course: true },
      });

      return res.status(200).json({ success: true, enrollments });
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      return res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}