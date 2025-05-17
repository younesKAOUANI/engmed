const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteNonUserContent() {
  try {
    console.log("Starting deletion of non-user and non-authentication content...");

    // List of collections to delete
    const collectionsToDelete = [
      "enrollments",
      "user_quizzes",
      "user_courses",
      "user_exams",
      "certificates",
      "glossary",
      "speaking_events",
      "event_participations",
      "courses",
      "quizzes",
      "videos",
      "files",
      "exams",
      "notes",
      "speech_quizzes",
      "questions",
      "user_speech_quizzes",
      "course_sequences",
    ];

    // Delete content from each collection
    for (const collection of collectionsToDelete) {
      console.log(`Deleting all records from ${collection}...`);
      await prisma[collection].deleteMany({});
      console.log(`Successfully deleted all records from ${collection}.`);
    }

    console.log("Deletion complete. The following collections were preserved:");
    console.log("- users");
    console.log("- accounts");
    console.log("- sessions");
    console.log("- verification_tokens");

  } catch (error) {
    console.error("Error during deletion:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteNonUserContent();