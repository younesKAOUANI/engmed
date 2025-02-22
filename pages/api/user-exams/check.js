import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, examId } = req.body;

    if (!userId || !examId) {
      return res.status(400).json({ error: "userId and examId are required" });
    }

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(examId)) {
      return res.status(400).json({ error: "Invalid userId or examId format" });
    }

    try {
      const userExam = await prisma.userExam.findUnique({
        where: { userId_examId: { userId, examId } },
      });
      res.status(200).json({ passed: userExam?.passed || false });
    } catch (error) {
      console.error("Error checking exam status:", error);
      res.status(500).json({ error: "Failed to check exam status" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}