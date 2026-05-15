import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────

export const mongoId = z
  .string({ required_error: "ID is required." })
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format.");

export const cefrLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional();

const nonEmptyString = (label, max = 2000) =>
  z.string({ required_error: `${label} is required.` })
    .trim()
    .min(1, `${label} cannot be empty.`)
    .max(max, `${label} must be at most ${max} characters.`);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name:          nonEmptyString("Name", 100),
  email:         z.string().email("Enter a valid email address."),
  password:      z.string().min(8, "Password must be at least 8 characters.").max(128),
  phoneNumber:   z.string().max(20).optional(),
  profession:    z.enum(["Student", "Instructor", "Professional", "Other"]).optional(),
  yearOfStudy:   z.number().int().min(1).max(10).optional(),
  specialty:     z.string().max(100).optional(),
  profilePicture:z.string().url("Must be a valid URL.").optional(),
});

// ─── Courses ──────────────────────────────────────────────────────────────────

export const createCourseSchema = z.object({
  title:       nonEmptyString("Title", 200),
  description: nonEmptyString("Description", 2000),
  price:       z.number({ required_error: "Price is required." }).min(0, "Price cannot be negative."),
  thumbnail:   z.string().url("Thumbnail must be a valid URL.").optional(),
  level:       cefrLevel,
  language:    z.string().max(50).optional(),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  published: z.boolean().optional(),
});

// ─── Sequences ────────────────────────────────────────────────────────────────

const questionSchema = z.object({
  content:       nonEmptyString("Question content", 1000),
  answers:       z.array(z.string().min(1)).min(2).max(6).optional(),
  correctAnswer: z.string().optional(),
  points:        z.number().int().min(1).max(100).optional(),
  order:         z.number().int().min(1).optional(),
});

const quizSchema = z.object({
  title:     nonEmptyString("Quiz title", 200),
  duration:  z.number().int().min(30).optional(),
  attempts:  z.number().int().min(1).max(10).default(1),
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

const speechQuizSchema = z.object({
  title:     nonEmptyString("Speech quiz title", 200),
  duration:  z.number().int().min(30).optional(),
  attempts:  z.number().int().min(1).max(10).default(1),
  questions: z.array(z.object({ content: nonEmptyString("Prompt", 500) })).min(1),
});

const videoSchema = z.object({
  title:     nonEmptyString("Video title", 200),
  duration:  z.number().int().min(1),
  format:    z.string().max(20),
  link:      z.string().url("Video link must be a valid URL."),
  thumbnail: z.string().url().optional(),
});

const fileSchema = z.object({
  fileName: nonEmptyString("File name", 200),
  url:      z.string().url("File URL must be valid."),
  mimeType: z.string().max(100).optional(),
  sizeBytes:z.number().int().optional(),
});

export const createSequenceSchema = z.object({
  title:       nonEmptyString("Title", 200),
  description: z.string().max(500).optional(),
  order:       z.number({ required_error: "Order is required." }).int().min(1),
  courseId:    mongoId,
  video:       videoSchema.optional(),
  file:        fileSchema.optional(),
  quiz:        quizSchema.optional(),
  speechQuiz:  speechQuizSchema.optional(),
});

export const updateSequenceSchema = z.object({
  title:       z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  order:       z.number().int().min(1).optional(),
  video:       videoSchema.optional(),
  file:        fileSchema.optional(),
  quiz:        quizSchema.optional(),
  speechQuiz:  speechQuizSchema.optional(),
});

// ─── Exam ─────────────────────────────────────────────────────────────────────

export const examSchema = z.object({
  title:        nonEmptyString("Exam title", 200),
  duration:     z.number().int().min(60, "Exam must be at least 60 seconds."),
  passingScore: z.number().int().min(1).max(100).default(70),
  questions:    z.array(questionSchema).min(1),
});

// ─── User progress ────────────────────────────────────────────────────────────

export const submitQuizSchema = z.object({
  quizId: mongoId,
  score:  z.number().int().min(0),
  passed: z.boolean(),
});

export const submitExamSchema = z.object({
  examId: mongoId,
  score:  z.number().int().min(0),
  passed: z.boolean(),
});

export const checkQuizSchema = z.object({
  quizId: mongoId,
});

export const checkExamSchema = z.object({
  examId: mongoId,
});

// ─── Profile / settings ───────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name:       nonEmptyString("Name", 100).optional(),
  phoneNumber:z.string().max(20).optional().or(z.literal("")),
  profession: z.enum(["Student", "Instructor", "Professional", "Other"]).optional(),
  yearOfStudy:z.number().int().min(1).max(10).optional(),
  specialty:  z.string().max(100).optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword:     z.string().min(8, "New password must be at least 8 characters.").max(128),
}).refine(d => d.currentPassword !== d.newPassword, {
  message: "New password must differ from current password.",
  path: ["newPassword"],
});

// ─── Glossary ─────────────────────────────────────────────────────────────────

export const createGlossarySchema = z.object({
  word:        nonEmptyString("Word", 100),
  translation: nonEmptyString("Translation", 200),
  explanation: nonEmptyString("Explanation", 1000),
});

// ─── Events ───────────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
  title:       nonEmptyString("Title", 200),
  description: nonEmptyString("Description", 1000),
  date:        z.string().datetime({ message: "Date must be a valid ISO 8601 datetime." })
                .refine(d => new Date(d) > new Date(), { message: "Event date must be in the future." }),
});

// ─── Admin scoring ────────────────────────────────────────────────────────────

export const scoreSpeechSchema = z.object({
  id:     mongoId,
  score:  z.number().int().min(0).max(100),
  passed: z.boolean(),
  notes:  z.string().max(2000).optional(),
});
