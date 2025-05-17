import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, eventId } = req.body;

    // Validate required fields
    if (!userId || !ObjectId.isValid(userId) || !eventId || !ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Valid userId and eventId are required" });
    }

    try {
      const participation = await prisma.eventParticipation.upsert({
        where: { userId_eventId: { userId, eventId } },
        update: {},
        create: { userId, eventId },
      });
      res.status(200).json(participation);
    } catch (error) {
      console.error("Error joining event:", error);
      res.status(500).json({ error: "Failed to join event" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}