import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/ui/Button";
import CustomLink from "@/components/ui/CustomLink";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Invalid email or password')
    }

  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Image src="/logo.png" width={32} height={32} alt="logo" />
        <p className="text-gray-700 font-bold text-2xl">EngMed</p>
      </div>
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[300px]">
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
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
            placeholder="Password"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            type="submit"
            className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-primary text-white px-4 py-2 rounded-md hover:scale-95"
          >Login </Button>
        </form>
        <p className="mt-4">Don't have an account?
          <CustomLink href={"/auth/signup"} className="font-semibold text-primary"> Register here</CustomLink>
        </p>
      </main>
    </div>
  );
}