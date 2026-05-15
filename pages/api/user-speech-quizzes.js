import multer from "multer";
import { join, basename } from "path";
import { mkdir, writeFile } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";

export const config = { api: { bodyParser: false } };

// Allowed MIME types for audio submissions
const ALLOWED_MIMES = new Set(["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_FILE_SIZE },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      return cb(new Error("Only audio files are accepted (webm, ogg, wav, mp3)."));
    }
    cb(null, true);
  },
});

/** Wraps multer in a promise so we can await it. */
function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("audio")(req, res, (err) => (err ? reject(err) : resolve()));
  });
}

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  try {
    await runMulter(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message || "Failed to process audio file." });
  }

  const audio        = req.file;
  const speechQuizId = mongoId.parse(req.body?.speechQuizId);
  const questionId   = mongoId.parse(req.body?.questionId);

  if (!audio) return res.status(400).json({ error: "Audio file is required." });

  // Validate the speech quiz belongs to an enrolled course
  const speechQuiz = await prisma.speechQuiz.findUnique({
    where:   { id: speechQuizId },
    select:  { id: true, sequence: { select: { courseId: true } } },
  });
  if (!speechQuiz) return res.status(404).json({ error: "Speech quiz not found." });

  // Persist audio with a collision-safe name (userId + timestamp + random)
  const uploadDir  = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filename   = `${session.user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
  const audioPath  = join(uploadDir, filename);
  await writeFile(audioPath, audio.buffer);
  const audioUrl   = `/uploads/${filename}`;

  const record = await prisma.userSpeechQuiz.create({
    data: { userId: session.user.id, speechQuizId, questionId, audioUrl },
    include: { question: true, speechQuiz: { select: { title: true } } },
  });

  return res.status(201).json({ message: "Submission saved. Your instructor will review it shortly.", record });
});
