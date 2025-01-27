import {  PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const prisma = new PrismaClient();

    const { method } = req;
    const { id } = req.query;

    switch (method) {
        // Get a sequence by ID
        case 'GET':
            try {
                const sequence = await prisma.courseSequence.findUnique({
                    where: { id },
                    include: { quiz: { include: { questions: true } } },
                });

                if (!sequence) {
                    return res.status(404).json({ message: 'Sequence not found' });
                }

                return res.status(200).json(sequence);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to retrieve sequence', error });
            }

        // Update a sequence
        case 'PUT':
            try {
                const { title, order, video, file } = req.body;

                const updatedSequence = await prisma.courseSequence.update({
                    where: { id },
                    data: {
                        title,
                        order: parseInt(order),
                        video: video || null,
                        file: file || null,
                    },
                });

                return res.status(200).json(updatedSequence);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to update sequence', error });
            }

        // Delete a sequence
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
