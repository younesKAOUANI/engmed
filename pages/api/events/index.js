import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { createEventSchema } from "@/lib/validations";

export default apiHandler({ auth: true }, async (req, res, { session }) => {
  if (req.method === "GET") {
    const events = await prisma.speakingEvent.findMany({
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
      orderBy: { date: "asc" },
    });
    return res.status(200).json(events);
  }

  if (req.method === "POST") {
    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
      return res.status(403).json({ error: "Only admins and instructors can create events." });
    }
    const body  = createEventSchema.parse(req.body);
    const event = await prisma.speakingEvent.create({
      data: { ...body, date: new Date(body.date), createdBy: session.user.id },
    });
    return res.status(201).json(event);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});
