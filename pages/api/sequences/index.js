import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { title, order, courseId, video, file, quiz, speechQuiz } = req.body;

        if (!title || !order || !courseId) {
          return res
            .status(400)
            .json({ message: 'Missing required fields: title, order, or courseId' });
        }

        const quizData = quiz
          ? {
              create: {
                title: quiz.title,
                duration: quiz.duration ? parseInt(quiz.duration, 10) : null,
                attempts: quiz.attempts ? parseInt(quiz.attempts, 10) : 1,
                questions: {
                  create: quiz.questions.map((question) => ({
                    content: question.content,
                    answers: question.answers,
                    correctAnswer: question.correctAnswer,
                    points: parseInt(question.points, 10) || 1,
                  })),
                },
              },
            }
          : undefined;

        const speechQuizData = speechQuiz
          ? {
              create: {
                title: speechQuiz.title,
                duration: speechQuiz.duration ? parseInt(speechQuiz.duration, 10) : null,
                attempts: speechQuiz.attempts ? parseInt(speechQuiz.attempts, 10) : 1,
                questions: {
                  create: speechQuiz.questions.map((question) => ({
                    content: question.content, // Only content for speech quiz questions
                  })),
                },
              },
            }
          : undefined;

        const videoData = video
          ? {
              create: {
                title: video.title,
                duration: parseInt(video.duration, 10),
                format: video.format,
                link: video.link,
                thumbnail: video.thumbnail,
              },
            }
          : undefined;

        const fileData = file
          ? {
              create: {
                fileName: file.fileName,
                url: file.url,
              },
            }
          : undefined;

        const newSequence = await prisma.courseSequence.create({
          data: {
            title,
            order: parseInt(order, 10),
            courseId,
            video: videoData,
            file: fileData,
            quiz: quizData,
            speechQuiz: speechQuizData,
          },
          include: {
            video: true,
            file: true,
            quiz: { include: { questions: true } },
            speechQuiz: { include: { questions: true } },
          },
        });

        return res.status(201).json(newSequence);
      } catch (error) {
        console.error('Error creating sequence:', error);
        return res
          .status(500)
          .json({ message: 'Failed to create sequence', error: error.message });
      }

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}