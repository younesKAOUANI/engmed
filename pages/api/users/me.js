import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";

// Returns the currently authenticated user's profile.
// Uses session.user.id — the userId in query params is ignored for security.
export default apiHandler({ auth: true, methods: ["GET"] }, async (_req, res, { session }) => {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id:            true,
      name:          true,
      email:         true,
      phoneNumber:   true,
      profession:    true,
      yearOfStudy:   true,
      specialty:     true,
      profilePicture:true,
      role:          true,
      isVerified:    true,
      createdAt:     true,
      updatedAt:     true,
    },
  });

  if (!user) return res.status(404).json({ error: "User not found." });
  return res.status(200).json(user);
});
