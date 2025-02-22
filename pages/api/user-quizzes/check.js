import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, quizId } = req.body;

    if (!userId || !quizId) {
      return res.status(400).json({ error: "userId and quizId are required" });
    }

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid userId or quizId format" });
    }

    try {
      const userQuiz = await prisma.userQuiz.findUnique({
        where: { userId_quizId: { userId, quizId } },
      });
      res.status(200).json({ passed: userQuiz?.passed || false });
    } catch (error) {
      console.error("Error checking quiz status:", error);
      res.status(500).json({ error: "Failed to check quiz status" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}