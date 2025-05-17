import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, quizId, score, passed } = req.body;

    try {
      const userQuiz = await prisma.userQuiz.upsert({
        where: { userId_quizId: { userId, quizId } },
        update: { score, passed, attemptedAt: new Date() },
        create: { userId, quizId, score, passed },
      });
      res.status(200).json(userQuiz);
    } catch (error) {
        console.error("Failed to save quiz result:", error);
      res.status(500).json({ error: "Failed to save quiz result" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}