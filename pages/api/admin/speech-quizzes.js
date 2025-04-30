import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // Debug: Log all submissions to inspect passed values
        const allSubmissions = await prisma.userSpeechQuiz.findMany({
          include: {
            user: { select: { name: true, email: true } },
            speechQuiz: { select: { title: true } },
            question: { select: { content: true } },
          },
          orderBy: { attemptedAt: "asc" },
        });
        console.log("All UserSpeechQuiz submissions:", allSubmissions);

        // Original query for pending submissions
        const submissions = await prisma.userSpeechQuiz.findMany({
          where: { passed: null }, // Only pending submissions
          include: {
            user: { select: { name: true, email: true } },
            speechQuiz: { select: { title: true } },
            question: { select: { content: true } },
          },
          orderBy: { attemptedAt: "asc" },
        });

        res.status(200).json(submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
      }
      break;

    case "PUT":
      try {
        const { id, score, notes, passed } = req.body;
        if (!id || score === undefined || passed === undefined) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedSubmission = await prisma.userSpeechQuiz.update({
          where: { id },
          data: {
            score,
            notes,
            passed,
            scoredAt: new Date(),
          },
          include: {
            user: { select: { name: true, email: true } },
            speechQuiz: { select: { title: true } },
            question: { select: { content: true } },
          },
        });

        res.status(200).json(updatedSubmission);
      } catch (error) {
        console.error("Error updating submission:", error);
        res.status(500).json({ error: "Failed to update submission" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}