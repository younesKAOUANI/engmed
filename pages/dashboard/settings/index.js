import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Head from "next/head";
import { User, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function Avatar({ name, size = 64 }) {
  const initials = (name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({ name: "", phoneNumber: "", profession: "", yearOfStudy: "", specialty: "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [passMsg, setPassMsg] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (status === "loading" || !userId) return;
    axios.get("/api/users/me", { params: { userId } }).then((r) => {
      setUserData(r.data);
      setProfile({
        name: r.data.name || "",
        phoneNumber: r.data.phoneNumber || "",
        profession: r.data.profession || "",
        yearOfStudy: r.data.yearOfStudy || "",
        specialty: r.data.specialty || "",
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId, status]);

  const setP = (field) => (e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  const setPw = (field) => (e) => setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await axios.put("/api/users/profile", {
        userId,
        ...profile,
        yearOfStudy: profile.profession === "Student" ? parseInt(profile.yearOfStudy) || undefined : undefined,
      });
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      return setPassMsg({ type: "error", text: "New passwords do not match." });
    }
    if (passwords.newPass.length < 8) {
      return setPassMsg({ type: "error", text: "Password must be at least 8 characters." });
    }
    setPassLoading(true);
    setPassMsg(null);
    try {
      await axios.put("/api/users/password", { userId, currentPassword: passwords.current, newPassword: passwords.newPass });
      setPassMsg({ type: "success", text: "Password updated successfully." });
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPassMsg({ type: "error", text: err.response?.data?.error || "Failed to update password." });
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
  ];

  return (
    <>
      <Head><title>Settings — EngMed</title></Head>
      <div className="max-w-2xl pb-12">
        <h1 className="heading-lg text-ink-900 mb-6">Account settings</h1>

        {/* Avatar strip */}
        <div className="bg-surface border border-ink-100 rounded-md p-5 shadow-1 flex items-center gap-4 mb-6">
          <Avatar name={userData?.name} size={56} />
          <div>
            <p className="heading-sm text-ink-900">{userData?.name}</p>
            <p className="body-sm text-ink-500">{userData?.email}</p>
            <p className="mono-sm text-ink-300 mt-0.5">Role: {userData?.role}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-100 mb-6 gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              role="tab"
              aria-selected={activeTab === id}
              className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-ink-500 hover:text-ink-900"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSave} className="bg-surface border border-ink-100 rounded-md p-6 shadow-1 flex flex-col gap-4">
            <Input label="Full name" value={profile.name} onChange={setP("name")} required />
            <div className="flex flex-col gap-1.5">
              <label className="eyebrow text-ink-700">Email address</label>
              <p className="body-base text-ink-900 py-2">{userData?.email}</p>
              <p className="body-sm text-ink-500">Email cannot be changed.</p>
            </div>
            <Input label="Phone number" type="tel" value={profile.phoneNumber} onChange={setP("phoneNumber")} placeholder="+213 …" />
            <div className="flex flex-col gap-1.5">
              <label className="eyebrow text-ink-700">Profession</label>
              <select
                value={profile.profession}
                onChange={setP("profession")}
                className="h-10 px-3 w-full bg-surface border border-ink-300 rounded-sm text-ink-900 text-[15px] focus:outline-none focus:border-brand-600 focus:shadow-focus transition-all"
              >
                <option value="">Select (optional)</option>
                <option>Student</option>
                <option>Instructor</option>
                <option>Professional</option>
                <option>Other</option>
              </select>
            </div>
            {profile.profession === "Student" && (
              <Input label="Year of study" type="number" value={profile.yearOfStudy} onChange={setP("yearOfStudy")} min="1" max="10" />
            )}
            <Input label="Specialty" value={profile.specialty} onChange={setP("specialty")} placeholder="e.g. Cardiology" />
            {profileMsg && (
              <p role={profileMsg.type === "error" ? "alert" : "status"} className={`body-sm ${profileMsg.type === "success" ? "text-success" : "text-danger"}`}>
                {profileMsg.text}
              </p>
            )}
            <Button type="submit" variant="primary" size="md" loading={profileLoading} className="self-start">
              Save changes
            </Button>
          </form>
        )}

        {/* Password tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSave} className="bg-surface border border-ink-100 rounded-md p-6 shadow-1 flex flex-col gap-4">
            <Input label="Current password" type="password" value={passwords.current} onChange={setPw("current")} required />
            <Input label="New password" type="password" value={passwords.newPass} onChange={setPw("newPass")} helper="Minimum 8 characters" required />
            <Input label="Confirm new password" type="password" value={passwords.confirm} onChange={setPw("confirm")} required />
            {passMsg && (
              <p role={passMsg.type === "error" ? "alert" : "status"} className={`body-sm ${passMsg.type === "success" ? "text-success" : "text-danger"}`}>
                {passMsg.text}
              </p>
            )}
            <Button type="submit" variant="primary" size="md" loading={passLoading} className="self-start">
              Update password
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
