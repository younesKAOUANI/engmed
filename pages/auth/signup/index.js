import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/ui/Button";
import CustomLink from "@/components/ui/CustomLink";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profession, setProfession] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const userData = {
      name,
      email,
      password,
      phoneNumber: phoneNumber || undefined, // Optional
      profession: profession || undefined, // Optional
      yearOfStudy: profession === "Student" ? parseInt(yearOfStudy) || undefined : undefined, // Optional, only for students
      specialty: specialty || undefined, // Optional
      profilePicture: profilePicture || undefined, // Optional
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[300px] max-w-[400px]">
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
            placeholder="Password"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
            required
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number (optional)"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
          />
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
          >
            <option value="">Select Profession (optional)</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
            <option value="Professional">Professional</option>
            <option value="Other">Other</option>
          </select>
          {profession === "Student" && (
            <input
              type="number"
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              placeholder="Year of Study (optional)"
              className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
              min="1"
              max="10"
            />
          )}
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Specialty (optional)"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
          />
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="Profile Picture URL (optional)"
            className="border-2 border-gray-400 p-2 rounded-md focus:border-primary"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            type="submit"
            className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-primary text-white px-4 py-2 rounded-md hover:scale-95"
          >
            Sign-up
          </Button>
        </form>
        <p className="mt-4">
          Already have an account?
          <CustomLink href={"/auth/login"} className="font-semibold text-primary">
            {" "}
            Login here
          </CustomLink>
        </p>
        <CustomLink href={"/"} className="font-semibold text-blue-500 mt-6">
          {" "}
          <span className="text-black">Or </span>Return to homepage
        </CustomLink>
      </main>
    </div>
  );
}