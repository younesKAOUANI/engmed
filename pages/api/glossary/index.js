import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid userId is required" });
    }

    try {
      const glossary = await prisma.glossary.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(glossary);
    } catch (error) {
      console.error("Error fetching glossary:", error);
      res.status(500).json({ error: "Failed to fetch glossary" });
    }
  } else if (req.method === "POST") {
    const { userId, word, translation, explanation } = req.body;

    if (!userId || !ObjectId.isValid(userId) || !word || !translation || !explanation) {
      return res.status(400).json({ error: "userId, word, translation, and explanation are required" });
    }

    try {
      const entry = await prisma.glossary.create({
        data: {
          userId,
          word,
          translation,
          explanation,
        },
      });
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating glossary entry:", error);
      res.status(500).json({ error: "Failed to create glossary entry" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}