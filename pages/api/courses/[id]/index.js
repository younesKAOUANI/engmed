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
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  if (!price || isNaN(parseInt(price))) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  if (!thumbnail) {
    return res.status(400).json({ error: 'Thumbnail is required' });
  }

  // Validate exam data if provided
  if (exam) {
    if (!exam.title) {
      return res.status(400).json({ error: 'Exam title is required' });
    }
    if (!exam.duration || isNaN(exam.duration)) {
      return res.status(400).json({ error: 'Valid exam duration is required' });
    }
    if (!exam.passingScore || isNaN(exam.passingScore)) {
      return res.status(400).json({ error: 'Valid passing score is required' });
    }
    if (!exam.questions || !Array.isArray(exam.questions) || exam.questions.length === 0) {
      return res.status(400).json({ error: 'Exam must include at least one question' });
    }
    for (const q of exam.questions) {
      if (!q.content) {
        return res.status(400).json({ error: 'Question content is required' });
      }
      if (!q.correctAnswer) {
        return res.status(400).json({ error: 'Correct answer is required for each question' });
      }
      if (!q.answers || !Array.isArray(q.answers)) {
        return res.status(400).json({ error: 'Answers array is required for each question' });
      }
    }
  }

  try {
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price: parseInt(price),
        thumbnail,
        exam: exam
          ? {
              upsert: {
                create: {
                  title: exam.title,
                  duration: exam.duration,
                  passingScore: exam.passingScore,
                  questions: {
                    create: exam.questions.map((q) => ({
                      content: q.content,
                      points: q.points || 1,
                      correctAnswer: q.correctAnswer,
                      answers: q.answers,
                    })),
                  },
                },
                update: {
                  title: exam.title,
                  duration: exam.duration,
                  passingScore: exam.passingScore,
                  questions: {
                    deleteMany: {},
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
                questions: true,
              },
            },
            speechQuiz: {
              include: {
                userSpeechQuizzes: userId ? { where: { userId } } : false,
                questions: true,
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
    console.error('PUT Error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(500).json({ error: 'Failed to update course', details: err.message });
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