import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const sequence = await prisma.courseSequence.findUnique({
          where: { id },
          include: {
            quiz: { include: { questions: true } },
            speechQuiz: { include: { questions: true } },
            video: true,
            file: true,
          },
        });

        if (!sequence) {
          return res.status(404).json({ message: 'Sequence not found' });
        }

        return res.status(200).json(sequence);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve sequence', error });
      }

    case 'PUT':
      try {
        const { title, order, video, file, quiz, speechQuiz } = req.body;

        const updatedSequence = await prisma.courseSequence.update({
          where: { id },
          data: {
            title,
            order: parseInt(order),
            video: video
              ? {
                  upsert: {
                    create: {
                      title: video.title,
                      duration: parseInt(video.duration),
                      format: video.format,
                      link: video.link,
                      thumbnail: video.thumbnail,
                    },
                    update: {
                      title: video.title,
                      duration: parseInt(video.duration),
                      format: video.format,
                      link: video.link,
                      thumbnail: video.thumbnail,
                    },
                  },
                }
              : undefined,
            file: file
              ? {
                  upsert: {
                    create: {
                      fileName: file.fileName,
                      url: file.url,
                    },
                    update: {
                      fileName: file.fileName,
                      url: file.url,
                    },
                  },
                }
              : undefined,
            quiz: quiz
              ? {
                  upsert: {
                    create: {
                      title: quiz.title,
                      duration: quiz.duration ? parseInt(quiz.duration) : null,
                      attempts: quiz.attempts ? parseInt(quiz.attempts) : 1,
                      questions: {
                        create: quiz.questions.map((q) => ({
                          content: q.content,
                          answers: q.answers,
                          correctAnswer: q.correctAnswer,
                          points: parseInt(q.points) || 1,
                        })),
                      },
                    },
                    update: {
                      title: quiz.title,
                      duration: quiz.duration ? parseInt(quiz.duration) : null,
                      attempts: quiz.attempts ? parseInt(quiz.attempts) : 1,
                      questions: {
                        deleteMany: {},
                        create: quiz.questions.map((q) => ({
                          content: q.content,
                          answers: q.answers,
                          correctAnswer: q.correctAnswer,
                          points: parseInt(q.points) || 1,
                        })),
                      },
                    },
                  },
                }
              : undefined,
            speechQuiz: speechQuiz
              ? {
                  upsert: {
                    create: {
                      title: speechQuiz.title,
                      duration: speechQuiz.duration ? parseInt(speechQuiz.duration) : null,
                      attempts: speechQuiz.attempts ? parseInt(speechQuiz.attempts) : 1,
                      questions: {
                        create: speechQuiz.questions.map((q) => ({
                          content: q.content,
                        })),
                      },
                    },
                    update: {
                      title: speechQuiz.title,
                      duration: speechQuiz.duration ? parseInt(speechQuiz.duration) : null,
                      attempts: speechQuiz.attempts ? parseInt(speechQuiz.attempts) : 1,
                      questions: {
                        deleteMany: {},
                        create: speechQuiz.questions.map((q) => ({
                          content: q.content,
                        })),
                      },
                    },
                  },
                }
              : undefined,
          },
          include: {
            quiz: { include: { questions: true } },
            speechQuiz: { include: { questions: true } },
            video: true,
            file: true,
          },
        });

        return res.status(200).json(updatedSequence);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update sequence', error });
      }

    case 'DELETE':
      try {
        await prisma.courseSequence.delete({ where: { id } });
        return res.status(200).json({ message: 'Sequence deleted successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete sequence', error });
      }

    default:
      return res.setHeader('Allow', ['GET', 'PUT', 'DELETE']).status(405).end(`Method ${method} Not Allowed`);
  }
}