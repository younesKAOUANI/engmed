import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  const { eventId } = z.object({ eventId: mongoId }).parse(req.body);

  const event = await prisma.speakingEvent.findUnique({ where: { id: eventId }, select: { id: true } });
  if (!event) return res.status(404).json({ error: "Event not found." });

  const participation = await prisma.eventParticipation.upsert({
    where:  { userId_eventId: { userId: session.user.id, eventId } },
    update: {},
    create: { userId: session.user.id, eventId },
  });

  return res.status(200).json(participation);
});
