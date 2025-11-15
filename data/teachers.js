// Available teachers/instructors for online meetings
export const teachers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Medical English Specialist",
    expertise: ["Medical Terminology", "Clinical Communication", "Healthcare English"],
    languages: ["English", "French"],
    availability: "Monday - Friday, 9:00 AM - 5:00 PM",
    image: "/uploads/teacher1.jpg",
    bio: "Dr. Johnson has over 10 years of experience teaching medical English to healthcare professionals and students.",
    rating: 4.9,
    totalSessions: 150
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    title: "Clinical English Instructor",
    expertise: ["Patient Communication", "Medical Writing", "Pronunciation"],
    languages: ["English", "Arabic", "French"],
    availability: "Monday - Thursday, 10:00 AM - 6:00 PM",
    image: "/uploads/teacher2.jpg",
    bio: "Professor Chen specializes in helping medical students improve their clinical communication skills.",
    rating: 4.8,
    totalSessions: 200
  },
  {
    id: 3,
    name: "Dr. Emma Williams",
    title: "Healthcare Communication Expert",
    expertise: ["Medical Presentations", "Research English", "Academic Writing"],
    languages: ["English", "French"],
    availability: "Tuesday - Saturday, 2:00 PM - 8:00 PM",
    image: "/uploads/teacher3.jpg",
    bio: "Dr. Williams helps medical students prepare for international conferences and research publications.",
    rating: 4.9,
    totalSessions: 175
  },
  {
    id: 4,
    name: "Dr. Ahmed Khalil",
    title: "Medical English Coach",
    expertise: ["IELTS Medical", "Interview Preparation", "Medical Vocabulary"],
    languages: ["English", "Arabic", "French"],
    availability: "Monday - Friday, 3:00 PM - 9:00 PM",
    image: "/uploads/teacher4.jpg",
    bio: "Dr. Khalil specializes in preparing students for medical English exams and job interviews.",
    rating: 4.7,
    totalSessions: 130
  },
  {
    id: 5,
    name: "Dr. Lisa Martin",
    title: "Clinical English Trainer",
    expertise: ["Nursing English", "Pharmacy Communication", "Patient Care"],
    languages: ["English", "French"],
    availability: "Wednesday - Sunday, 9:00 AM - 3:00 PM",
    image: "/uploads/teacher5.jpg",
    bio: "Dr. Martin focuses on practical English skills for clinical settings and patient interactions.",
    rating: 4.8,
    totalSessions: 165
  },
  {
    id: 6,
    name: "Prof. David Brown",
    title: "Medical Communication Professor",
    expertise: ["Emergency Medicine English", "Surgical Terms", "Medical Ethics"],
    languages: ["English", "French", "Spanish"],
    availability: "Monday - Friday, 8:00 AM - 4:00 PM",
    image: "/uploads/teacher6.jpg",
    bio: "Professor Brown brings real-world medical experience to his English teaching practice.",
    rating: 5.0,
    totalSessions: 220
  }
];

// Meeting duration options
export const meetingDurations = [
  { id: 30, label: "30 minutes", value: 30 },
  { id: 60, label: "1 hour", value: 60 },
  { id: 90, label: "1.5 hours", value: 90 },
  { id: 120, label: "2 hours", value: 120 }
];

// Meeting topics
export const meetingTopics = [
  "Medical Terminology",
  "Clinical Communication",
  "Patient Interaction",
  "Medical Writing",
  "Pronunciation Practice",
  "IELTS/TOEFL Preparation",
  "Interview Preparation",
  "Research Presentation",
  "Academic English",
  "General Consultation",
  "Other"
];

// Time slots (example - in real app, these would be dynamic based on teacher availability)
export const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
];

export const getTeacherById = (id) => {
  return teachers.find(teacher => teacher.id === id);
};

export const getTeachersByExpertise = (expertise) => {
  return teachers.filter(teacher => 
    teacher.expertise.some(exp => exp.toLowerCase().includes(expertise.toLowerCase()))
  );
};
