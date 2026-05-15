import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { updatePasswordSchema } from "@/lib/validations";

// Changes the authenticated user's own password.
// session.user.id is the source of truth — req.body.userId is ignored.
export default apiHandler({ auth: true, methods: ["PUT"] }, async (req, res, { session }) => {
  const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { password: true },
  });
  if (!user) return res.status(404).json({ error: "User not found." });

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(401).json({ error: "Current password is incorrect." });

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

  return res.status(200).json({ message: "Password updated successfully." });
});
