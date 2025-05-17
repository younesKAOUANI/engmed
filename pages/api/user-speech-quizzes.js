import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { join, basename } from "path";
import { mkdir, writeFile } from "fs/promises"; // Updated import to include mkdir

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  upload.single("audio")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Failed to process audio file" });
    }

    try {
      const { userId, speechQuizId, questionId } = req.body;
      const audio = req.file;

      console.log("Received submission:", { userId, speechQuizId, questionId, audio: !!audio });

      if (!userId || !speechQuizId || !questionId || !audio) {
        return res.status(400).json({ error: "Missing required fields: userId, speechQuizId, questionId, or audio" });
      }

      // Ensure the uploads directory exists
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true }); // Creates directory if it doesn't exist

      // Save audio file
      const audioPath = join(uploadDir, `${Date.now()}.webm`);
      await writeFile(audioPath, audio.buffer);
      const audioUrl = `/uploads/${basename(audioPath)}`;

      // Create database record
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
      // Handle unique constraint violation (e.g., duplicate submission)
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Submission already exists for this user, quiz, and question" });
      }
      console.error("Error saving speech quiz submission:", error);
      res.status(500).json({ error: "Failed to save submission" });
    }
  });
}