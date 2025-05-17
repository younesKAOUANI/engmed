import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const events = await prisma.speakingEvent.findMany({
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, email: true, phoneNumber: true },
              },
            },
          },
        },
        orderBy: { date: "asc" },
      });
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  } else if (req.method === "POST") {
    const { userId, title, description, date } = req.body;

    if (!userId || !ObjectId.isValid(userId) || !title || !description || !date) {
      return res.status(400).json({ error: "userId, title, description, and date are required" });
    }

    try {
      const event = await prisma.speakingEvent.create({
        data: {
          title,
          description,
          date: new Date(date),
          createdBy: userId,
        },
      });
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}