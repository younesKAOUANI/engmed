import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }

  if (req.method === "GET") {
    try {
      const submissions = await prisma.userSpeechQuiz.findMany({
        include: {
          user: { select: { name: true, email: true } },
          speechQuiz: true,
          question: true,
        },
      });
      console.log("Backend fetched submissions:", submissions);
      return res.status(200).json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return res.status(500).json({ error: "Failed to fetch submissions" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, score, notes, passed } = req.body;
      if (!id || score === undefined || passed === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const updatedSubmission = await prisma.userSpeechQuiz.update({
        where: { id },
        data: { score, notes, passed, scoredAt: new Date() },
      });
      return res.status(200).json(updatedSubmission);
    } catch (error) {
      console.error("Error updating submission:", error);
      return res.status(500).json({ error: "Failed to update submission" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}