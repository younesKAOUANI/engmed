import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handleError = (res, error) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
};

export default async function handler(req, res) {
  try {
    const method = req.method.toUpperCase();
    const handlers = {
      GET: async () => {
        const courses = await prisma.course.findMany({
          include: { sequences: { include: { quiz: true } }, exam: true },
        });
        res.status(200).json(courses);
      },

      POST: async () => {
        const { title, description, price, thumbnail } = req.body;
        
        if (!title || !description || !price || !thumbnail) {
          return res
            .status(400)
            .json({ error: 'All fields (title, description, price, thumbnail) are required.' });
        }

        const course = await prisma.course.create({
          data: { 
            title, 
            description, 
            price: parseInt(price), // Convert price to number
            thumbnail 
          },
        });
        res.status(201).json(course);
      },

      PUT: async () => {
        const { id, ...data } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'ID is required for updating a course.' });
        }

        const course = await prisma.course.update({ 
          where: { id }, 
          data: {
            ...data,
            price: data.price ? parseInt(data.price) : undefined
          }
        });
        res.status(200).json(course);
      },

      DELETE: async () => {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: 'ID is required for deleting a course.' });
        }

        await prisma.course.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
      },
    };

    if (!handlers[method]) {
      return res
        .setHeader('Allow', Object.keys(handlers))
        .status(405)
        .json({ error: `Method ${method} Not Allowed` });
    }

    // Execute the handler directly without await
    return handlers[method]();
  } catch (error) {
    handleError(res, error);
  }
}