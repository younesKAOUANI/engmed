import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Check } from "lucide-react";

const PROFESSIONS = [
  { value: "Student",      label: "Student",      desc: "Medical school, residency" },
  { value: "Instructor",   label: "Instructor",   desc: "Teaching & academia" },
  { value: "Professional", label: "Professional", desc: "Practicing clinician" },
  { value: "Other",        label: "Other",        desc: "Related field" },
];

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
    { label: "Number or symbol", ok: /[\d!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-danger", "bg-warning", "bg-brand-500", "bg-success"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-pill transition-colors duration-300 ${
              i < score ? colors[score - 1] : "bg-ink-100"
            }`}
          />
        ))}
        <span className="body-sm text-ink-500 ml-2 whitespace-nowrap">{labels[score]}</span>
      </div>
    </div>
  );
}

function StepIndicator({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all duration-220 ${
              i < step
                ? "bg-brand-600 text-white"
                : i === step
                ? "bg-brand-50 text-brand-700 border-2 border-brand-600"
                : "bg-ink-100 text-ink-500"
            }`}
          >
            {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-8 ${i < step ? "bg-brand-600" : "bg-ink-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    yearOfStudy: "",
    specialty: "",
    phoneNumber: "",
  });

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber || undefined,
          profession: form.profession || undefined,
          yearOfStudy: form.profession === "Student" ? parseInt(form.yearOfStudy) || undefined : undefined,
          specialty: form.specialty || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/auth/login");
      } else {
        setError(data.error || "Registration failed. Please try again.");
        setStep(0);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create account — EngMed</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
        <div className="w-full max-w-[520px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 justify-center" aria-label="EngMed home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="w-8 h-8" aria-hidden="true" />
            <span className="font-display text-[22px] italic text-ink-900">EngMed</span>
          </Link>

          <div className="bg-surface border border-ink-100 rounded-lg p-8 shadow-1">
            <StepIndicator step={step} total={3} />

            {/* Step 0 — Account */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="heading-lg text-ink-900">Create your account</h1>
                  <p className="body-sm text-ink-500 mt-1">Get started with EngMed for free.</p>
                </div>
                <Input label="Full name" value={form.name} onChange={set("name")} placeholder="Dr. Ahmed Bensalem" required />
                <Input label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="you@clinic.fr" required />
                <div className="flex flex-col gap-1.5">
                  <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" required />
                  <PasswordStrength password={form.password} />
                </div>
                {error && <p role="alert" className="body-sm text-danger">{error}</p>}
                <Button
                  variant="primary" size="lg"
                  className="w-full"
                  onClick={() => {
                    if (!form.name || !form.email || !form.password) return setError("Please fill in all required fields.");
                    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
                    setError(null);
                    setStep(1);
                  }}
                >
                  Continue →
                </Button>
              </div>
            )}

            {/* Step 1 — About you */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="heading-lg text-ink-900">About you</h2>
                  <p className="body-sm text-ink-500 mt-1">This helps us personalize your experience.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="eyebrow text-ink-700">I am a…</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFESSIONS.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, profession: value }))}
                        className={`text-left p-3 rounded-sm border transition-all duration-150 ${
                          form.profession === value
                            ? "border-brand-600 bg-brand-50 text-brand-700"
                            : "border-ink-200 text-ink-700 hover:border-brand-300"
                        }`}
                      >
                        <p className="text-[14px] font-semibold">{label}</p>
                        <p className="text-[12px] opacity-70 mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {form.profession === "Student" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="eyebrow text-ink-700">Year of study</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, yearOfStudy: String(Math.max(1, parseInt(p.yearOfStudy || "1") - 1)) }))}
                        className="w-8 h-8 rounded-sm border border-ink-300 text-ink-700 hover:bg-surface2 transition-colors"
                      >−</button>
                      <span className="mono-sm text-ink-900 w-8 text-center">{form.yearOfStudy || "1"}</span>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, yearOfStudy: String(Math.min(10, parseInt(p.yearOfStudy || "1") + 1)) }))}
                        className="w-8 h-8 rounded-sm border border-ink-300 text-ink-700 hover:bg-surface2 transition-colors"
                      >+</button>
                    </div>
                  </div>
                )}
                <Input label="Specialty (optional)" value={form.specialty} onChange={set("specialty")} placeholder="e.g. Cardiology, Pediatrics" />
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep(0)}>← Back</Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={() => setStep(2)}>Continue →</Button>
                </div>
              </div>
            )}

            {/* Step 2 — Optional details */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="heading-lg text-ink-900">Almost done</h2>
                  <p className="body-sm text-ink-500 mt-1">Optional details — you can skip and add later.</p>
                </div>
                <Input label="Phone number (optional)" type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="+213 …" />
                {error && <p role="alert" className="body-sm text-danger">{error}</p>}
                <Button variant="primary" size="lg" className="w-full" loading={loading} onClick={handleSubmit}>
                  Create account
                </Button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="body-sm text-ink-500 hover:text-ink-900 text-center transition-colors"
                >
                  Skip and finish later →
                </button>
                <Button variant="ghost" size="md" className="w-full" onClick={() => setStep(1)}>← Back</Button>
              </div>
            )}

            <p className="body-sm text-ink-500 text-center mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
