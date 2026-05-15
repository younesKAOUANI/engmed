import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { signupSchema } from "@/lib/validations";
import { authLimiter } from "@/lib/rate-limit";

export default apiHandler({ methods: ["POST"] }, async (req, res) => {
  const rl = authLimiter.check(req);
  if (!rl.success) return res.status(429).json({ error: rl.message });

  const body = signupSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);

  await prisma.user.create({
    data: {
      name:        body.name,
      email:       body.email,
      password:    hashedPassword,
      phoneNumber: body.phoneNumber,
      profession:  body.profession,
      yearOfStudy: body.yearOfStudy,
      specialty:   body.specialty,
      role:        "STUDENT",
      balance:     0,
    },
  });

  return res.status(201).json({ message: "Account created successfully." });
});
