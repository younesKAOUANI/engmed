import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { mongoId } from "@/lib/validations";
import { z } from "zod";

export default apiHandler({ auth: true, methods: ["POST"] }, async (req, res, { session }) => {
  const { courseId } = z.object({ courseId: mongoId }).parse(req.body);

  const certificate = await prisma.certificate.upsert({
    where:  { userId_courseId: { userId: session.user.id, courseId } },
    update: {},
    create: { userId: session.user.id, courseId },
  });

  return res.status(201).json(certificate);
});
