import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";

// ADMIN only — list all users with safe field selection (no passwords)
export default apiHandler({ auth: true, role: "ADMIN", methods: ["GET"] }, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id:            true,
      name:          true,
      email:         true,
      phoneNumber:   true,
      role:          true,
      profession:    true,
      specialty:     true,
      isVerified:    true,
      balance:       true,
      lastLoginAt:   true,
      createdAt:     true,
      updatedAt:     true,
      profilePicture:true,
    },
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json(users);
});
