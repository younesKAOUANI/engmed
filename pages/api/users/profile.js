import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { updateProfileSchema } from "@/lib/validations";

// Updates the authenticated user's own profile.
// Never trusts userId from the request body — always uses session.user.id.
export default apiHandler({ auth: true, methods: ["PUT"] }, async (req, res, { session }) => {
  const body = updateProfileSchema.parse(req.body);

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(body.name       !== undefined ? { name:       body.name }       : {}),
      ...(body.phoneNumber !== undefined ? { phoneNumber:body.phoneNumber }: {}),
      ...(body.profession !== undefined ? { profession: body.profession }  : {}),
      ...(body.yearOfStudy!== undefined ? { yearOfStudy:body.yearOfStudy }: {}),
      ...(body.specialty  !== undefined ? { specialty:  body.specialty }   : {}),
    },
    select: {
      id: true, name: true, email: true, phoneNumber: true,
      profession: true, yearOfStudy: true, specialty: true,
      profilePicture: true, role: true, updatedAt: true,
    },
  });

  return res.status(200).json(updated);
});
