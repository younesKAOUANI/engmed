import { describe, it, expect } from "@jest/globals";
import {
  signupSchema,
  createCourseSchema,
  createGlossarySchema,
  updatePasswordSchema,
  createEventSchema,
  mongoId,
  scoreSpeechSchema,
  submitQuizSchema,
} from "../../lib/validations.js";

// ─── mongoId ─────────────────────────────────────────────────────────────────

describe("mongoId", () => {
  it("accepts a valid 24-char hex string", () => {
    expect(mongoId.parse("507f1f77bcf86cd799439011")).toBe("507f1f77bcf86cd799439011");
  });
  it("rejects a short id", () => {
    expect(() => mongoId.parse("abc123")).toThrow();
  });
  it("rejects an empty string", () => {
    expect(() => mongoId.parse("")).toThrow();
  });
  it("rejects non-hex characters", () => {
    expect(() => mongoId.parse("507f1f77bcf86cd79943901z")).toThrow();
  });
});

// ─── signupSchema ────────────────────────────────────────────────────────────

describe("signupSchema", () => {
  const valid = { name: "Dr. Smith", email: "dr@clinic.fr", password: "Password123" };

  it("accepts valid data", () => {
    const result = signupSchema.parse(valid);
    expect(result.name).toBe("Dr. Smith");
    expect(result.email).toBe("dr@clinic.fr");
  });

  it("rejects an invalid email", () => {
    expect(() => signupSchema.parse({ ...valid, email: "not-an-email" })).toThrow(/email/i);
  });

  it("rejects password shorter than 8 chars", () => {
    expect(() => signupSchema.parse({ ...valid, password: "abc123" })).toThrow(/8/);
  });

  it("rejects empty name", () => {
    expect(() => signupSchema.parse({ ...valid, name: "   " })).toThrow();
  });

  it("accepts optional fields", () => {
    const result = signupSchema.parse({ ...valid, profession: "Student", yearOfStudy: 3 });
    expect(result.profession).toBe("Student");
    expect(result.yearOfStudy).toBe(3);
  });

  it("rejects invalid profession", () => {
    expect(() => signupSchema.parse({ ...valid, profession: "DJ" })).toThrow();
  });
});

// ─── createCourseSchema ───────────────────────────────────────────────────────

describe("createCourseSchema", () => {
  const valid = { title: "Medical English", description: "A course.", price: 25 };

  it("accepts valid course data", () => {
    expect(createCourseSchema.parse(valid).title).toBe("Medical English");
  });

  it("rejects negative price", () => {
    expect(() => createCourseSchema.parse({ ...valid, price: -5 })).toThrow();
  });

  it("rejects empty title", () => {
    expect(() => createCourseSchema.parse({ ...valid, title: "" })).toThrow();
  });

  it("accepts valid CEFR level", () => {
    const result = createCourseSchema.parse({ ...valid, level: "B2" });
    expect(result.level).toBe("B2");
  });

  it("rejects invalid CEFR level", () => {
    expect(() => createCourseSchema.parse({ ...valid, level: "X9" })).toThrow();
  });
});

// ─── createGlossarySchema ─────────────────────────────────────────────────────

describe("createGlossarySchema", () => {
  const valid = { word: "Dyspnea", translation: "Difficulty breathing", explanation: "A respiratory symptom." };

  it("accepts valid entry", () => {
    expect(createGlossarySchema.parse(valid).word).toBe("Dyspnea");
  });

  it("rejects empty word", () => {
    expect(() => createGlossarySchema.parse({ ...valid, word: "" })).toThrow();
  });

  it("rejects missing explanation", () => {
    expect(() => createGlossarySchema.parse({ word: "Test", translation: "T" })).toThrow();
  });
});

// ─── updatePasswordSchema ─────────────────────────────────────────────────────

describe("updatePasswordSchema", () => {
  it("accepts valid password change", () => {
    const r = updatePasswordSchema.parse({ currentPassword: "old-pass-1", newPassword: "new-pass-123" });
    expect(r.newPassword).toBe("new-pass-123");
  });

  it("rejects when new password equals current", () => {
    expect(() =>
      updatePasswordSchema.parse({ currentPassword: "same-pass-1", newPassword: "same-pass-1" })
    ).toThrow(/differ/i);
  });

  it("rejects short new password", () => {
    expect(() =>
      updatePasswordSchema.parse({ currentPassword: "old-pass", newPassword: "short" })
    ).toThrow();
  });
});

// ─── createEventSchema ────────────────────────────────────────────────────────

describe("createEventSchema", () => {
  const futureDate = new Date(Date.now() + 86_400_000).toISOString(); // tomorrow

  it("accepts valid event with future date", () => {
    const r = createEventSchema.parse({ title: "Speaking Circle", description: "Weekly practice session", date: futureDate });
    expect(r.title).toBe("Speaking Circle");
  });

  it("rejects a past date", () => {
    const pastDate = new Date(Date.now() - 86_400_000).toISOString();
    expect(() =>
      createEventSchema.parse({ title: "Old Event", description: "This is past", date: pastDate })
    ).toThrow(/future/i);
  });

  it("rejects short title", () => {
    expect(() =>
      createEventSchema.parse({ title: "", description: "Valid description here", date: futureDate })
    ).toThrow();
  });
});

// ─── scoreSpeechSchema ────────────────────────────────────────────────────────

describe("scoreSpeechSchema", () => {
  const validId = "507f1f77bcf86cd799439011";

  it("accepts valid score data", () => {
    const r = scoreSpeechSchema.parse({ id: validId, score: 85, passed: true });
    expect(r.score).toBe(85);
    expect(r.passed).toBe(true);
  });

  it("rejects score above 100", () => {
    expect(() => scoreSpeechSchema.parse({ id: validId, score: 110, passed: true })).toThrow();
  });

  it("rejects score below 0", () => {
    expect(() => scoreSpeechSchema.parse({ id: validId, score: -5, passed: false })).toThrow();
  });

  it("rejects invalid id", () => {
    expect(() => scoreSpeechSchema.parse({ id: "bad", score: 80, passed: true })).toThrow();
  });
});

// ─── submitQuizSchema ─────────────────────────────────────────────────────────

describe("submitQuizSchema", () => {
  const validId = "507f1f77bcf86cd799439011";

  it("accepts valid quiz submission", () => {
    const r = submitQuizSchema.parse({ quizId: validId, score: 70, passed: true });
    expect(r.passed).toBe(true);
  });

  it("rejects missing quizId", () => {
    expect(() => submitQuizSchema.parse({ score: 70, passed: true })).toThrow();
  });
});
