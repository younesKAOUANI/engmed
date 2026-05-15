import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import axios from "axios";
import { User, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function Avatar({ name, size = 56 }) {
  const initials = (name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-hidden="true"
    >{initials}</div>
  );
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", phoneNumber: "", specialty: "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [passMsg, setPassMsg] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (status === "loading" || !userId) return;
    axios.get("/api/users/me", { params: { userId } }).then(r => {
      setUserData(r.data);
      setProfile({ name: r.data.name || "", phoneNumber: r.data.phoneNumber || "", specialty: r.data.specialty || "" });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId, status]);

  const setP = f => e => setProfile(p => ({ ...p, [f]: e.target.value }));
  const setPw = f => e => setPasswords(p => ({ ...p, [f]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true); setProfileMsg(null);
    try {
      await axios.put("/api/users/profile", { userId, ...profile });
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Failed to update." });
    } finally { setProfileLoading(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return setPassMsg({ type: "error", text: "Passwords don't match." });
    if (passwords.newPass.length < 8) return setPassMsg({ type: "error", text: "Min. 8 characters." });
    setPassLoading(true); setPassMsg(null);
    try {
      await axios.put("/api/users/password", { userId, currentPassword: passwords.current, newPassword: passwords.newPass });
      setPassMsg({ type: "success", text: "Password updated." });
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPassMsg({ type: "error", text: err.response?.data?.error || "Failed to update." });
    } finally { setPassLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Head><title>Settings — Admin · EngMed</title></Head>
      <div className="max-w-2xl pb-12">
        <h1 className="heading-lg text-ink-900 mb-6">Account settings</h1>

        {/* Profile strip */}
        <div className="bg-surface border border-ink-100 rounded-md p-5 shadow-1 flex items-center gap-4 mb-6">
          <Avatar name={userData?.name} />
          <div>
            <p className="heading-sm text-ink-900">{userData?.name}</p>
            <p className="body-sm text-ink-500">{userData?.email}</p>
            <p className="mono-sm text-ink-300 mt-0.5">{userData?.role}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-100 mb-6 gap-1">
          {[{ id: "profile", label: "Profile", icon: User }, { id: "password", label: "Password", icon: Lock }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}
              className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors ${tab === id ? "border-brand-600 text-brand-600" : "border-transparent text-ink-500 hover:text-ink-900"}`}>
              <Icon className="w-4 h-4" aria-hidden="true" />{label}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <form onSubmit={saveProfile} className="bg-surface border border-ink-100 rounded-md p-6 shadow-1 flex flex-col gap-4">
            <Input label="Full name" value={profile.name} onChange={setP("name")} required />
            <div className="flex flex-col gap-1.5">
              <label className="eyebrow text-ink-700">Email address</label>
              <p className="body-base text-ink-900 py-2">{userData?.email}</p>
              <p className="body-sm text-ink-500">Email cannot be changed.</p>
            </div>
            <Input label="Phone number" type="tel" value={profile.phoneNumber} onChange={setP("phoneNumber")} placeholder="+213 …" />
            <Input label="Specialty" value={profile.specialty} onChange={setP("specialty")} placeholder="e.g. Medical English" />
            {profileMsg && (
              <p role={profileMsg.type === "error" ? "alert" : "status"} className={`body-sm ${profileMsg.type === "success" ? "text-success" : "text-danger"}`}>
                {profileMsg.text}
              </p>
            )}
            <Button type="submit" variant="primary" size="md" loading={profileLoading} className="self-start">Save changes</Button>
          </form>
        )}

        {tab === "password" && (
          <form onSubmit={savePassword} className="bg-surface border border-ink-100 rounded-md p-6 shadow-1 flex flex-col gap-4">
            <Input label="Current password" type="password" value={passwords.current} onChange={setPw("current")} required />
            <Input label="New password" type="password" value={passwords.newPass} onChange={setPw("newPass")} helper="Minimum 8 characters" required />
            <Input label="Confirm new password" type="password" value={passwords.confirm} onChange={setPw("confirm")} required />
            {passMsg && (
              <p role={passMsg.type === "error" ? "alert" : "status"} className={`body-sm ${passMsg.type === "success" ? "text-success" : "text-danger"}`}>
                {passMsg.text}
              </p>
            )}
            <Button type="submit" variant="primary" size="md" loading={passLoading} className="self-start">Update password</Button>
          </form>
        )}
      </div>
    </>
  );
}

export { adminServerSideProps as getServerSideProps } from "@/lib/admin-auth";
