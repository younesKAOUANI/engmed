<div align="center">

<img src="public/logo.png" alt="EngMed Logo" width="120" />

# EngMed

### Medical English Learning Platform for Healthcare Professionals

*A full-stack LMS built for doctors, medical students, and healthcare workers in France who need to master English in a clinical context.*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v4-purple?style=for-the-badge)](https://next-auth.js.org/)

</div>

---

## What is EngMed?

EngMed is a specialised English Learning Management System (LMS) designed specifically for the medical community. Unlike generic language apps, every piece of content — quizzes, vocabulary, exams, speaking exercises — is grounded in real medical and clinical contexts.

**Who is it for?**
- Medical students in France preparing for international residencies or exams
- Doctors and nurses needing to communicate with international colleagues
- Healthcare professionals who write research papers or attend global conferences
- Anyone in the medical field who wants to go from "functional" to "fluent" in English

---

## Features

### For Students

| Feature | Description |
|---|---|
| **Course Catalogue** | Browse published courses sorted by popularity and rating |
| **Video Lessons** | Watch embedded video lessons per course sequence |
| **Downloadable Resources** | Access PDF/file attachments within course sequences |
| **Multiple-Choice Quizzes** | Per-sequence quizzes with auto-grading and score tracking |
| **Speech Quizzes** | Record audio answers directly in the browser; reviewed and scored by instructors |
| **Course Exams** | End-of-course timed exams with a configurable passing score |
| **Certificates** | Auto-issued certificates upon passing the course exam |
| **Progress Tracking** | Per-course progress bar updated as you complete sequences |
| **Placement Test** | 148-question diagnostic test (Grammar · Vocabulary · Reading · Listening) to place you at A1–C2 |
| **Let's Speak Events** | Join live speaking events created by the admin team |
| **Online Meetings** | Book 1-on-1 video sessions with specialist English teachers |
| **University Courses** | Explore curated university-level medical English programmes |
| **Glossary** | Build a personal medical vocabulary list with translations and explanations; accessible via a floating popup on any page |
| **Medical Word Game** | 50-level word-unscramble game with Beginner → Expert difficulty progression; progress saved locally |
| **Crosswords** | Medical English crossword puzzles |
| **Profile & Settings** | Update personal info, specialty, year of study, and password |
| **Enrollments Dashboard** | See all your active enrolments in one place |
| **Certifications Dashboard** | View and download all earned certificates |

### For Admins

| Feature | Description |
|---|---|
| **Admin Dashboard** | Central overview panel for platform activity |
| **Course Management** | Create, edit, and publish courses; manage sequences (video / file / quiz / speech quiz) |
| **User Management** | View all registered users, roles, and verification status |
| **Speech Quiz Review** | Listen to student audio submissions, add notes, and assign scores |
| **Event Management** | Create and manage Let's Speak speaking events |
| **Settings** | Platform-level configuration |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (Pages Router) |
| **UI Library** | [React 18](https://react.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (via MongoDB Atlas) |
| **ORM** | [Prisma 6](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) — JWT sessions, credentials provider |
| **Password Hashing** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **File Uploads** | [Multer](https://github.com/expressjs/multer) |
| **Video Player** | [React Player](https://github.com/cookpete/react-player) |
| **Animations** | [AOS](https://michalsnik.github.io/aos/) (Animate On Scroll) |
| **Icons** | [Heroicons](https://heroicons.com/), [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |

---

## Local Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **MongoDB** database — [MongoDB Atlas free tier](https://www.mongodb.com/atlas) works perfectly

### Step-by-step

**1. Clone the repository**

```bash
git clone https://github.com/younesKAOUANI/engmed.git
cd engmed
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# MongoDB Atlas connection string
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/engmed?retryWrites=true&w=majority"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your_secret_here"

# Local development URL
NEXTAUTH_URL="http://localhost:3000"
```

**4. Generate the Prisma client**

```bash
npx prisma generate
```

> Prisma reads your `DATABASE_URL` and generates a type-safe client. No schema migration is needed for MongoDB — Prisma works directly with the existing collections.

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**6. (Optional) Seed an admin account**

There is no automatic seed script. Register a new account via the UI at `/auth/signup`, then manually update the user's `role` field to `ADMIN` in your MongoDB database (Atlas UI or Compass).

---

## Project Structure

```
engmed/
├── components/
│   ├── main/               # Layout, Header, Footer, Sidebar, Glossary popup
│   ├── pages/
│   │   ├── CoursePage/     # Video player, quiz modal, speech quiz modal, exam modal
│   │   ├── GamePage/       # Medical word unscramble game component
│   │   ├── LandingPage/    # Hero, Services, About, Contact, Testimonials
│   │   └── PlacementTestPage/ # Placement test sections, results
│   └── ui/                 # Shared UI primitives (Button, Card, Input, Tabs…)
├── data/
│   ├── gameLevels.js       # 50 game levels with medical vocabulary
│   ├── teachers.js         # Static teacher/instructor profiles
│   └── universityCourses.js
├── lib/
│   ├── auth.js             # NextAuth configuration (providers, callbacks)
│   └── cn.js               # Tailwind class merge utility
├── pages/
│   ├── api/                # All backend API routes
│   │   ├── auth/           # NextAuth handler, login, signup
│   │   ├── courses/        # CRUD for courses
│   │   ├── sequences/      # CRUD for course sequences
│   │   ├── quizzes/        # Quiz fetch & submit
│   │   ├── user-quizzes/   # Record quiz attempts
│   │   ├── user-exams/     # Record exam attempts
│   │   ├── certificates/   # Certificate issuance & retrieval
│   │   ├── enrollement/    # Enroll / unenroll
│   │   ├── events/         # Speaking events CRUD + participate
│   │   ├── glossary/       # Personal glossary CRUD
│   │   ├── users/          # User profile management
│   │   ├── user-speech-quizzes.js  # Speech quiz submissions
│   │   └── admin/          # Admin-only endpoints
│   ├── admin/              # Admin panel pages
│   ├── auth/               # Login & signup pages
│   ├── dashboard/          # Student-facing dashboard pages
│   ├── game/               # Word unscramble & crossword games
│   ├── placement-test/     # Placement test page
│   └── index.js            # Landing page
├── prisma/
│   └── schema.prisma       # Database schema (MongoDB + Prisma)
├── public/                 # Static assets & uploaded media
├── styles/
│   └── globals.css         # Global Tailwind styles
├── .env.example            # Environment variable template
├── next.config.mjs         # Next.js configuration
├── tailwind.config.mjs     # Tailwind configuration
└── package.json
```

---

## Screenshots

> Screenshots should be placed in `public/screenshots/` and referenced below.

| Page | File |
|---|---|
| Landing Page | `public/screenshots/landing.png` |
| Student Dashboard | `public/screenshots/dashboard.png` |
| Course View | `public/screenshots/course.png` |
| Placement Test | `public/screenshots/placement-test.png` |
| Medical Word Game | `public/screenshots/game.png` |
| Admin Panel | `public/screenshots/admin.png` |

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please keep PRs focused and include a clear description of what you changed and why.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Portfolio Note

EngMed was built as a full-stack portfolio project to demonstrate end-to-end product engineering skills — from database schema design and REST API development to React component architecture and UX. The domain (medical English for healthcare workers in France) was chosen deliberately to show the ability to build for a specific, real-world user base rather than a generic demo.

**Key engineering decisions showcased:**
- Role-based access control (ADMIN / INSTRUCTOR / STUDENT) at the API and UI layer
- Prisma + MongoDB for a flexible, schema-driven NoSQL data layer
- JWT session management with NextAuth, including custom callbacks to propagate role data
- Audio recording and upload pipeline for the speech quiz feature
- Stateless placement test with 148 questions across four skill domains, with CEFR-level scoring
- Gamification system with 50 progressive difficulty levels backed by localStorage persistence

---

<div align="center">

**Built by [Your Name](https://your-portfolio.com)**
&nbsp;·&nbsp;
[LinkedIn](https://linkedin.com/in/your-handle)
&nbsp;·&nbsp;
[GitHub](https://github.com/younesKAOUANI)

</div>
