import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";

export default apiHandler({ auth: true, role: "ADMIN", methods: ["GET"] }, async (_req, res) => {
  const [
    totalUsers,
    studentCount,
    instructorCount,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalCertificates,
    pendingSpeeches,
    totalEvents,
    recentUsers,
    recentEnrollments,
    topCourses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT"    } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
    prisma.certificate.count(),
    prisma.userSpeechQuiz.count({ where: { score: null } }),
    prisma.speakingEvent.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take:    6,
      select:  { id: true, name: true, email: true, role: true, createdAt: true, profession: true },
    }),
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      take:    5,
      select:  {
        id: true, enrolledAt: true,
        user:   { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.course.findMany({
      where:   { published: true },
      orderBy: { totalStudents: "desc" },
      take:    5,
      select:  { id: true, title: true, totalStudents: true, rating: true, price: true, level: true },
    }),
  ]);

  return res.status(200).json({
    users:     { total: totalUsers, students: studentCount, instructors: instructorCount, admins: totalUsers - studentCount - instructorCount },
    courses:   { total: totalCourses, published: publishedCourses, draft: totalCourses - publishedCourses },
    enrollments:    totalEnrollments,
    certificates:   totalCertificates,
    pendingSpeeches,
    events:         totalEvents,
    recentUsers,
    recentEnrollments,
    topCourses,
  });
});
