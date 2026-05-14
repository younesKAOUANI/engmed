import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Sign in — EngMed</title>
      </Head>
      <div className="min-h-screen flex">
        {/* Left — form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-paper">
          <div className="w-full max-w-[420px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-10" aria-label="EngMed home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="w-8 h-8" aria-hidden="true" />
              <span className="font-display text-[22px] italic text-ink-900">EngMed</span>
            </Link>

            <h1 className="display-md text-ink-900 mb-2">Welcome back</h1>
            <p className="body-base text-ink-500 mb-8">
              Sign in to continue your learning journey.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.dz"
                required
                autoComplete="email"
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="eyebrow text-ink-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="body-sm text-brand-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 px-3 w-full bg-surface border border-ink-300 rounded-sm text-ink-900 text-[15px] placeholder:text-ink-300 transition-all duration-150 focus:outline-none focus:border-brand-600 focus:shadow-focus"
                />
              </div>

              {error && (
                <p role="alert" aria-live="polite" className="body-sm text-danger">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-2"
              >
                Sign in
              </Button>

              {/* Quick-access demo buttons */}
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => signIn("credentials", { redirect: true, email: "admin@engmed.com", password: "123456" })}
                  className="flex-1 h-9 rounded-sm border border-ink-200 bg-surface2 text-ink-600 text-[13px] font-medium hover:border-brand-500 hover:text-brand-700 transition-colors"
                >
                  Quick Login — Admin
                </button>
                <button
                  type="button"
                  onClick={() => signIn("credentials", { redirect: true, email: "student@engmed.com", password: "123456789" })}
                  className="flex-1 h-9 rounded-sm border border-ink-200 bg-surface2 text-ink-600 text-[13px] font-medium hover:border-brand-500 hover:text-brand-700 transition-colors"
                >
                  Quick Login — Student
                </button>
              </div>
            </form>

            <p className="body-sm text-ink-500 text-center mt-6">
              New to EngMed?{" "}
              <Link href="/auth/signup" className="text-brand-600 font-semibold hover:underline">
                Create an account
              </Link>
            </p>

            <div className="mt-8 pt-6 border-t border-ink-100 text-center">
              <Link href="/" className="body-sm text-ink-500 hover:text-ink-900 transition-colors">
                ← Return to homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Right — editorial panel */}
        <div
          className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
          style={{ background: "var(--brand-700)" }}
        >
          {/* Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-sm text-center">
            <blockquote className="display-md italic text-white mb-6 leading-snug">
              "Clear communication is a clinical skill. EngMed made it teachable."
            </blockquote>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-display text-white text-xl italic">H</span>
              </div>
              <div>
                <p className="text-white font-semibold text-[15px]">Hana Boulahrouz</p>
                <p className="text-white/60 text-[13px]">TEFL/TESOL · Founder, EngMed</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-pill bg-white ${i === 2 ? "w-6" : "w-2 opacity-40"}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
