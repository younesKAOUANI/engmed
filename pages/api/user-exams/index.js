import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, examId, score, passed } = req.body;

    if (!userId || !examId || typeof score !== "number" || typeof passed !== "boolean") {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(examId)) {
      return res.status(400).json({ error: "Invalid userId or examId format" });
    }

    try {
      const userExam = await prisma.userExam.upsert({
        where: { userId_examId: { userId, examId } },
        update: { score, passed, attemptedAt: new Date() },
        create: { userId, examId, score, passed },
      });
      res.status(200).json(userExam);
    } catch (error) {
      console.error("Error saving exam result:", error);
      res.status(500).json({ error: "Failed to save exam result" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}