const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteNonUserContent() {
  try {
    console.log("Starting deletion of non-user and non-authentication content...");

    // List of collections to delete
    const collectionsToDelete = [
      "enrollment",
      "userQuiz",
      "userCourse",
      "userExam",
      "certificate",
      "glossary",
      "speakingEvent",
      "eventParticipation",
      "quiz",
      "speechQuiz",
      "video",
      "file",
      "exam",
      "note", 
      "question",
      "courseSequence",
      "userSpeechQuiz",
      "course",
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