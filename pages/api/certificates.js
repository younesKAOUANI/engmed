import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, courseId, issuedAt } = req.body;

    if (!userId || !courseId || !issuedAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid userId or courseId format" });
    }

    try {
      const certificate = await prisma.certificate.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { issuedAt },
        create: { userId, courseId, issuedAt },
      });
      res.status(201).json(certificate);
    } catch (error) {
      console.error("Error saving certificate:", error);
      res.status(500).json({ error: "Failed to save certificate" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}