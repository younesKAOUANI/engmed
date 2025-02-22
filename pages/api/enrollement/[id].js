import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Corrected import path
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: { course: true, user: true }, // Include course and user details if needed
      });

      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      return res.status(200).json({ success: true, enrollment });
    } catch (error) {
      console.error("Failed to fetch enrollment:", error);
      return res.status(500).json({ error: "Failed to fetch enrollment" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.enrollment.delete({
        where: { id },
      });

      return res.status(200).json({ success: true, message: "Enrollment deleted" });
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
      return res.status(500).json({ error: "Failed to delete enrollment" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
