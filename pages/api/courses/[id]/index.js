import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handleError = (res, error) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
};

export default async function handler(req, res) {
  const { id } = req.query;
  const { userId } = req.query; // Add userId from query params for user-specific quiz data
  console.log('id:', id, 'userId:', userId);

  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const method = req.method.toUpperCase();
    const handlers = {
      GET: async () => {
        const course = await prisma.course.findUnique({
          where: { id: id },
          include: {
            sequences: {
              orderBy: { order: 'asc' }, // Ensure consistent order
              include: {
                quiz: {
                  include: {
                    userQuizzes: userId
                      ? { where: { userId: userId } }
                      : false, // Only include userQuizzes if userId is provided
                    questions: true, // Include quiz questions
                  },
                },
                speechQuiz: {
                  include: {
                    userSpeechQuizzes: userId
                      ? { where: { userId: userId } }
                      : false, // Only include userSpeechQuizzes if userId is provided
                    questions: true, // Include speech quiz questions
                  },
                },
                video: true,
                file: true,
              },
            },
            exam: {
              include: {
                questions: true,
              },
            },
          },
        });

        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }

        console.log("Course response - sequences:", course.sequences); // Debug
        res.status(200).json(course);
      },

      PUT: async () => {
        const { title, description, price, thumbnail, exam } = req.body;

        // Validate required fields
        if (!title || !description || !price || !thumbnail) {
          return res.status(400).json({
            error: 'All fields (title, description, price, thumbnail) are required.',
          });
        }

        try {
          // Update the course data
          const updatedCourse = await prisma.course.update({
            where: { id },
            data: {
              title,
              description,
              price: parseInt(price),
              thumbnail,
              // Update the exam if provided
              exam: exam
                ? {
                    upsert: {
                      create: {
                        title: exam.title || 'Default Exam Title',
                        duration: exam.duration || 0,
                        passingScore: exam.passingScore || 70, // Default passing score
                        questions: {
                          create: exam.questions.map((q) => ({
                            content: q.content,
                            points: q.points || 1, // Default points
                            correctAnswer: q.correctAnswer,
                            answers: q.answers,
                          })),
                        },
                      },
                      update: {
                        title: exam.title || 'Default Exam Title',
                        duration: exam.duration || 0,
                        passingScore: exam.passingScore || 70,
                        questions: {
                          deleteMany: {}, // Clear existing questions
                          create: exam.questions.map((q) => ({
                            content: q.content,
                            points: q.points || 1,
                            correctAnswer: q.correctAnswer,
                            answers: q.answers,
                          })),
                        },
                      },
                    },
                  }
                : undefined,
            },
            include: {
              sequences: {
                include: {
                  quiz: {
                    include: {
                      userQuizzes: userId ? { where: { userId } } : false,
                      questions: true, // Include quiz questions
                    },
                  },
                  speechQuiz: {
                    include: {
                      userSpeechQuizzes: userId ? { where: { userId } } : false,
                      questions: true, // Include speech quiz questions
                    },
                  },
                  video: true,
                  file: true,
                },
              },
              exam: {
                include: {
                  questions: true,
                },
              },
            },
          });

          res.status(200).json(updatedCourse);
        } catch (err) {
          console.error(err);
          res.status(500).json({
            error: 'Failed to update the course.',
          });
        }
      },

      DELETE: async () => {
        // Check if the course exists
        const course = await prisma.course.findUnique({
          where: { id: id },
        });

        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }

        // Delete the course (cascades to related data per schema)
        await prisma.course.delete({
          where: { id: id },
        });

        res.status(204).end();
      },
    };

    if (!handlers[method]) {
      return res
        .setHeader('Allow', Object.keys(handlers))
        .status(405)
        .json({ error: `Method ${method} Not Allowed` });
    }

    await handlers[method]();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    handleError(res, error);
  }
}