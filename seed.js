/**
 * EngMed — Database seed script
 * Run with: node seed.js
 *
 * Creates:
 *  - 1 admin user  (admin@engmed.com / 123456)
 *  - 1 student user (student@engmed.com / 123456789)
 *  - 4 published courses with full sequences:
 *      sequences = video + quiz questions  (+ speech quiz on some)
 *      each course ends with a final exam
 *  - 3 speaking events
 *  - 5 glossary entries for the student
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ─── helpers ─────────────────────────────────────────────────────────────────

const hash = (pw) => bcrypt.hashSync(pw, 10);

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ─── data ────────────────────────────────────────────────────────────────────

const COURSES = [
  {
    title: "Medical English Foundations",
    description:
      "Master the essential vocabulary, grammar, and communication patterns used in everyday clinical settings. Designed for A1–B1 learners entering the medical field.",
    price: 0,
    rating: 4.8,
    totalStudents: 312,
    thumbnail: "https://placehold.co/600x400/ECF6F6/10797F?text=Medical+Foundations",
    sequences: [
      {
        title: "Introduction to Medical Terminology",
        order: 1,
        video: {
          title: "Medical Terminology Overview",
          duration: 720,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "Terminology Quiz",
          duration: 300,
          attempts: 2,
          questions: [
            {
              content: "What does the prefix 'cardio-' refer to?",
              answers: ["Heart", "Liver", "Lung", "Kidney"],
              correctAnswer: "Heart",
              points: 10,
            },
            {
              content: "The suffix '-itis' means:",
              answers: ["Inflammation", "Surgery", "Disease", "Study of"],
              correctAnswer: "Inflammation",
              points: 10,
            },
            {
              content: "What does 'hypo-' mean?",
              answers: ["Under / below normal", "Above normal", "Without", "Around"],
              correctAnswer: "Under / below normal",
              points: 10,
            },
          ],
        },
      },
      {
        title: "Patient History Taking",
        order: 2,
        video: {
          title: "How to Take a Patient History in English",
          duration: 900,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        speechQuiz: {
          title: "Patient History Speaking Practice",
          duration: 180,
          attempts: 3,
          questions: [
            { content: "Introduce yourself to a new patient and ask about their chief complaint." },
            { content: "Ask the patient about the duration and severity of their symptoms." },
          ],
        },
      },
      {
        title: "Describing Symptoms",
        order: 3,
        video: {
          title: "Vocabulary for Describing Pain and Symptoms",
          duration: 840,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "Symptoms Vocabulary Quiz",
          duration: 300,
          attempts: 2,
          questions: [
            {
              content: "A patient says 'I have a sharp, stabbing pain'. This type of pain is best described as:",
              answers: ["Acute", "Chronic", "Dull", "Radiating"],
              correctAnswer: "Acute",
              points: 10,
            },
            {
              content: "Which term describes pain that spreads from one location to another?",
              answers: ["Radiating", "Localised", "Referred", "Intermittent"],
              correctAnswer: "Radiating",
              points: 10,
            },
          ],
        },
      },
    ],
    exam: {
      title: "Medical English Foundations — Final Exam",
      duration: 1800,
      passingScore: 70,
      questions: [
        {
          content: "The prefix 'brady-' means:",
          answers: ["Slow", "Fast", "Large", "Small"],
          correctAnswer: "Slow",
          points: 10,
        },
        {
          content: "Which phrase is most appropriate when breaking bad news to a patient?",
          answers: [
            "I'm afraid I have some difficult news to share with you.",
            "You have cancer, deal with it.",
            "Nothing can be done for you.",
            "You should have come earlier.",
          ],
          correctAnswer: "I'm afraid I have some difficult news to share with you.",
          points: 15,
        },
        {
          content: "'Dyspnea' refers to:",
          answers: ["Difficulty breathing", "Chest pain", "Irregular heartbeat", "Swollen joints"],
          correctAnswer: "Difficulty breathing",
          points: 10,
        },
        {
          content: "A patient is 'febrile'. This means they have:",
          answers: ["A fever", "No pulse", "Low blood pressure", "A rash"],
          correctAnswer: "A fever",
          points: 10,
        },
      ],
    },
  },

  {
    title: "Clinical Communication for Doctors",
    description:
      "Advanced communication skills for clinical environments — ward rounds, handovers, referrals, and breaking bad news. Targets B2–C1 learners.",
    price: 25,
    rating: 4.9,
    totalStudents: 184,
    thumbnail: "https://placehold.co/600x400/ECF6F6/0B5D63?text=Clinical+Communication",
    sequences: [
      {
        title: "The SBAR Framework",
        order: 1,
        video: {
          title: "SBAR: Situation-Background-Assessment-Recommendation",
          duration: 960,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "SBAR Quiz",
          duration: 240,
          attempts: 2,
          questions: [
            {
              content: "In SBAR, what does the 'A' stand for?",
              answers: ["Assessment", "Action", "Answer", "Analysis"],
              correctAnswer: "Assessment",
              points: 10,
            },
            {
              content: "SBAR is primarily used for:",
              answers: [
                "Clinical handovers and referrals",
                "Writing prescriptions",
                "Patient discharge summaries",
                "Taking a patient history",
              ],
              correctAnswer: "Clinical handovers and referrals",
              points: 10,
            },
          ],
        },
      },
      {
        title: "Breaking Bad News — The SPIKES Protocol",
        order: 2,
        video: {
          title: "How to Break Bad News with the SPIKES Protocol",
          duration: 1080,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        speechQuiz: {
          title: "Breaking Bad News Speaking Practice",
          duration: 300,
          attempts: 2,
          questions: [
            { content: "Using the SPIKES protocol, set up and begin delivering difficult news to a patient with a new cancer diagnosis." },
          ],
        },
      },
      {
        title: "Writing Effective Referral Letters",
        order: 3,
        video: {
          title: "Structure and Language of Medical Referral Letters",
          duration: 780,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "Referral Letter Quiz",
          duration: 300,
          attempts: 2,
          questions: [
            {
              content: "A referral letter should begin with:",
              answers: [
                "The reason for referral",
                "The doctor's personal opinion",
                "The hospital's address",
                "The patient's insurance details",
              ],
              correctAnswer: "The reason for referral",
              points: 10,
            },
          ],
        },
      },
    ],
    exam: {
      title: "Clinical Communication — Final Exam",
      duration: 2400,
      passingScore: 70,
      questions: [
        {
          content: "Which word best replaces 'myocardial infarction' in patient-friendly language?",
          answers: ["Heart attack", "Chest infection", "Heart failure", "Angina"],
          correctAnswer: "Heart attack",
          points: 10,
        },
        {
          content: "During a handover, which information is LEAST critical to communicate?",
          answers: [
            "The patient's favourite food",
            "Current medications",
            "Pending test results",
            "Allergies",
          ],
          correctAnswer: "The patient's favourite food",
          points: 10,
        },
        {
          content: "A colleague says 'the patient is obtunded'. This means:",
          answers: [
            "Reduced level of consciousness",
            "In severe pain",
            "Fully alert",
            "Unable to speak",
          ],
          correctAnswer: "Reduced level of consciousness",
          points: 15,
        },
      ],
    },
  },

  {
    title: "Medical Research Writing in English",
    description:
      "Learn to write abstracts, case reports, and research papers that meet international publication standards. C1–C2 level.",
    price: 35,
    rating: 4.7,
    totalStudents: 97,
    thumbnail: "https://placehold.co/600x400/F6ECD2/C58A2A?text=Research+Writing",
    sequences: [
      {
        title: "Structure of a Research Paper (IMRaD)",
        order: 1,
        video: {
          title: "Introduction to IMRaD Structure",
          duration: 840,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "IMRaD Structure Quiz",
          duration: 300,
          attempts: 2,
          questions: [
            {
              content: "What does IMRaD stand for?",
              answers: [
                "Introduction, Methods, Results, and Discussion",
                "Introduction, Material, Research, and Data",
                "Index, Methodology, Results, and Data",
                "Introduction, Management, References, and Discussion",
              ],
              correctAnswer: "Introduction, Methods, Results, and Discussion",
              points: 10,
            },
            {
              content: "In which section do you present your statistical findings?",
              answers: ["Results", "Discussion", "Introduction", "Methods"],
              correctAnswer: "Results",
              points: 10,
            },
          ],
        },
      },
      {
        title: "Writing a Structured Abstract",
        order: 2,
        video: {
          title: "How to Write a Publishable Medical Abstract",
          duration: 720,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "Abstract Writing Quiz",
          duration: 300,
          attempts: 2,
          questions: [
            {
              content: "A structured abstract typically does NOT include:",
              answers: ["Author biography", "Objective", "Methods", "Conclusions"],
              correctAnswer: "Author biography",
              points: 10,
            },
          ],
        },
      },
    ],
    exam: {
      title: "Research Writing — Final Exam",
      duration: 2700,
      passingScore: 70,
      questions: [
        {
          content: "Passive voice is preferred in the Methods section because:",
          answers: [
            "It focuses on the process, not the researcher",
            "It is easier to write",
            "Journals require first person",
            "It sounds more casual",
          ],
          correctAnswer: "It focuses on the process, not the researcher",
          points: 15,
        },
        {
          content: "Which tense is standard for reporting your own results?",
          answers: ["Simple past", "Present perfect", "Future simple", "Present continuous"],
          correctAnswer: "Simple past",
          points: 10,
        },
      ],
    },
  },

  {
    title: "Pharmacy English — Drug Counselling",
    description:
      "Essential English for pharmacists: explaining prescriptions, drug interactions, dosage instructions, and counselling patients effectively.",
    price: 18,
    rating: 4.6,
    totalStudents: 145,
    thumbnail: "https://placehold.co/600x400/E6F4EC/147651?text=Pharmacy+English",
    sequences: [
      {
        title: "Explaining Dosage Instructions",
        order: 1,
        video: {
          title: "How to Explain Prescriptions Clearly in English",
          duration: 660,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        quiz: {
          title: "Dosage Instructions Quiz",
          duration: 240,
          attempts: 2,
          questions: [
            {
              content: "How would you explain 'take one tablet twice daily with food' to a patient?",
              answers: [
                "Take one pill every morning and evening, with a meal",
                "Take two tablets once a day",
                "Take the tablet when you feel pain",
                "Take with water only",
              ],
              correctAnswer: "Take one pill every morning and evening, with a meal",
              points: 10,
            },
            {
              content: "The term 'PRN' on a prescription means:",
              answers: ["As needed", "Before meals", "At bedtime", "Every morning"],
              correctAnswer: "As needed",
              points: 10,
            },
          ],
        },
      },
      {
        title: "Counselling on Drug Interactions",
        order: 2,
        video: {
          title: "Common Drug Interactions — How to Counsel Patients",
          duration: 900,
          format: "mp4",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        speechQuiz: {
          title: "Drug Counselling Speaking Practice",
          duration: 240,
          attempts: 2,
          questions: [
            { content: "A patient is prescribed warfarin. Counsel them on foods and drugs to avoid, using clear everyday language." },
            { content: "Explain the side effects of metformin to a newly diagnosed diabetic patient." },
          ],
        },
      },
    ],
    exam: {
      title: "Pharmacy English — Final Exam",
      duration: 1800,
      passingScore: 70,
      questions: [
        {
          content: "Which of the following is correct patient counselling language?",
          answers: [
            "This medicine may cause mild stomach upset — take it with food to reduce this.",
            "This drug causes gastrointestinal adverse events.",
            "This medication has a high incidence of GI side effects.",
            "Contraindicated in patients with hepatic impairment.",
          ],
          correctAnswer: "This medicine may cause mild stomach upset — take it with food to reduce this.",
          points: 15,
        },
        {
          content: "OTC stands for:",
          answers: ["Over the counter", "One time capsule", "Official treatment criteria", "Out of cost"],
          correctAnswer: "Over the counter",
          points: 10,
        },
      ],
    },
  },
];

const EVENTS = [
  {
    title: "Weekly Speaking Circle — Clinical Cases",
    description:
      "Present a clinical case in English and receive feedback from peers. All levels welcome. We meet every Tuesday online.",
    date: daysFromNow(3),
  },
  {
    title: "Pronunciation Workshop: Anatomical Terms",
    description:
      "Practise pronouncing the most commonly mispronounced anatomical terms. Recording available after the session.",
    date: daysFromNow(7),
  },
  {
    title: "IELTS Academic Preparation — Medical Track",
    description:
      "Focused preparation for healthcare professionals sitting the IELTS Academic exam. Writing Task 1 and Speaking Part 3.",
    date: daysFromNow(14),
  },
];

const GLOSSARY_ENTRIES = [
  { word: "Dyspnea", translation: "Essoufflement / ضيق التنفس", explanation: "Difficult or laboured breathing; shortness of breath. Common in cardiac and respiratory conditions." },
  { word: "Palpitation", translation: "Palpitation / خفقان", explanation: "An abnormally rapid or irregular heartbeat noticeable to the patient. Often reported as 'fluttering' or 'racing'." },
  { word: "Oedema", translation: "Œdème / وذمة", explanation: "Swelling caused by excess fluid trapped in the body's tissues. Commonly pitting or non-pitting." },
  { word: "Haemoptysis", translation: "Hémoptysie / نفث الدم", explanation: "Coughing up blood from the respiratory tract. A red-flag symptom requiring urgent investigation." },
  { word: "Syncope", translation: "Syncope / إغماء", explanation: "A temporary loss of consciousness due to reduced blood flow to the brain. Commonly known as fainting." },
];

// ─── seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding EngMed database…\n");

  // ── wipe existing content (keep auth tables) ──────────────────────────────
  console.log("🧹 Clearing old content…");
  const toClear = [
    "userSpeechQuiz", "userQuiz", "userExam", "certificate",
    "eventParticipation", "enrollment", "userCourse",
    "glossary", "note", "question",
    "quiz", "speechQuiz", "exam", "video", "file",
    "courseSequence", "speakingEvent", "course",
  ];
  for (const model of toClear) {
    await prisma[model].deleteMany({});
  }
  // wipe users so we can recreate them cleanly
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✓ Cleared\n");

  // ── users ─────────────────────────────────────────────────────────────────
  console.log("👤 Creating users…");

  const admin = await prisma.user.create({
    data: {
      name: "Admin EngMed",
      email: "admin@engmed.com",
      password: hash("123456"),
      role: "ADMIN",
      isVerified: true,
      profession: "Instructor",
      specialty: "Medical English",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Amira Bensalem",
      email: "student@engmed.com",
      password: hash("123456789"),
      role: "STUDENT",
      isVerified: true,
      profession: "Student",
      yearOfStudy: 3,
      specialty: "General Medicine",
    },
  });

  console.log(`  ✓ Admin   → ${admin.email}`);
  console.log(`  ✓ Student → ${student.email}\n`);

  // ── courses ───────────────────────────────────────────────────────────────
  console.log("📚 Creating courses…");

  for (const courseData of COURSES) {
    const { sequences: seqData, exam: examData, ...courseFields } = courseData;

    const course = await prisma.course.create({
      data: { ...courseFields, published: true },
    });

    // sequences
    for (const seqItem of seqData) {
      const { video: videoData, quiz: quizData, speechQuiz: speechData, ...seqFields } = seqItem;

      const sequence = await prisma.courseSequence.create({
        data: { ...seqFields, courseId: course.id },
      });

      if (videoData) {
        await prisma.video.create({ data: { ...videoData, sequenceId: sequence.id } });
      }

      if (quizData) {
        const { questions, ...quizFields } = quizData;
        const quiz = await prisma.quiz.create({ data: { ...quizFields, sequenceId: sequence.id } });
        for (const q of questions) {
          await prisma.question.create({ data: { ...q, quizId: quiz.id } });
        }
      }

      if (speechData) {
        const { questions, ...speechFields } = speechData;
        const sq = await prisma.speechQuiz.create({ data: { ...speechFields, sequenceId: sequence.id } });
        for (const q of questions) {
          await prisma.question.create({ data: { content: q.content, speechQuizId: sq.id } });
        }
      }
    }

    // final exam
    if (examData) {
      const { questions, ...examFields } = examData;
      const exam = await prisma.exam.create({ data: { ...examFields, courseId: course.id } });
      for (const q of questions) {
        await prisma.question.create({ data: { ...q, examId: exam.id } });
      }
    }

    // enroll the demo student in every course
    await prisma.enrollment.create({
      data: { userId: student.id, courseId: course.id },
    });

    console.log(`  ✓ ${course.title}`);
  }

  // ── speaking events ───────────────────────────────────────────────────────
  console.log("\n🎙  Creating speaking events…");

  for (const ev of EVENTS) {
    const event = await prisma.speakingEvent.create({
      data: { ...ev, createdBy: admin.id },
    });
    // student joins all events
    await prisma.eventParticipation.create({
      data: { userId: student.id, eventId: event.id },
    });
    console.log(`  ✓ ${event.title}`);
  }

  // ── glossary ──────────────────────────────────────────────────────────────
  console.log("\n📖 Adding glossary entries for student…");

  for (const entry of GLOSSARY_ENTRIES) {
    await prisma.glossary.create({ data: { ...entry, userId: student.id } });
    console.log(`  ✓ ${entry.word}`);
  }

  // ── summary ───────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete!\n");
  console.log("┌─────────────────────────────────────────────┐");
  console.log("│  Quick login credentials                    │");
  console.log("│  Admin:   admin@engmed.com   / 123456       │");
  console.log("│  Student: student@engmed.com / 123456789    │");
  console.log("└─────────────────────────────────────────────┘\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
