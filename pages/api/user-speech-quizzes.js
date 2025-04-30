import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { join } from "path";
import { writeFile } from "fs/promises";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for processing
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
});

const prisma = new PrismaClient();

// Middleware to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use multer middleware to parse FormData
  upload.single("audio")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Failed to process audio file" });
    }

    try {
      const { userId, speechQuizId, questionId } = req.body;
      const audio = req.file; // Multer stores the file here

      console.log("Received submission:", { userId, speechQuizId, questionId, audio: !!audio }); // Debug

      if (!userId || !speechQuizId || !questionId || !audio) {
        return res.status(400).json({ error: "Missing required fields: userId, speechQuizId, questionId, or audio" });
      }

      // Save audio file (example: store in public/uploads)
      const audioPath = join(process.cwd(), "public", "uploads", `${Date.now()}.webm`);
      await writeFile(audioPath, audio.buffer);
      const audioUrl = `/uploads/${audioPath.split("/").pop()}`;

      const userSpeechQuiz = await prisma.userSpeechQuiz.create({
        data: {
          userId,
          speechQuizId,
          questionId,
          audioUrl,
          attemptedAt: new Date(),
        },
        include: {
          question: true,
          speechQuiz: true,
          user: { select: { name: true, email: true } },
        },
      });

      res.status(201).json({ message: "Submission saved for review", userSpeechQuiz });
    } catch (error) {
      console.error("Error saving speech quiz submission:", error);
      res.status(500).json({ error: "Failed to save submission" });
    }
  });
}