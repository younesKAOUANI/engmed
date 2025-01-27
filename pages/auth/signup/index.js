import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/ui/Button";
import CustomLink from "@/components/ui/CustomLink";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/auth/login");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Image src="/logo.png" width={32} height={32} alt="logo" />
        <p className="text-gray-700 font-bold text-2xl">EngMed</p>
      </div>
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Signup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[300px]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            type="submit"
            className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-primary text-white px-4 py-2 rounded-md hover:scale-95"
          >Sign-up </Button>
        </form>
        <p className="mt-4">Already have an account?
          <CustomLink href={"/auth/login"} className="font-semibold text-primary"> Login here</CustomLink>
        </p>
      </main>
    </div>
  );
}
