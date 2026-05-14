import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Search, X, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

function Avatar({ name }) {
  const initials = (name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-[12px] font-semibold shrink-0" aria-hidden="true">
      {initials}
    </div>
  );
}

const ROLE_BADGE = { ADMIN: "danger", INSTRUCTOR: "brand", STUDENT: "default" };

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then(r => r.json())
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head><title>Users — Admin · EngMed</title></Head>
      <div className="flex flex-col gap-6 pb-12">

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="heading-lg text-ink-900">Users</h1>
            <p className="body-sm text-ink-500 mt-0.5">
              {loading ? "…" : `${users.length} registered users`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" size="md">{users.filter(u => u.role === "STUDENT").length} students</Badge>
            <Badge variant="brand"   size="md">{users.filter(u => u.role === "INSTRUCTOR").length} instructors</Badge>
            <Badge variant="danger"  size="md">{users.filter(u => u.role === "ADMIN").length} admins</Badge>
          </div>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" aria-hidden="true" />
          <input
            type="search" placeholder="Search by name or email…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-surface border border-ink-300 rounded-sm text-[15px] placeholder:text-ink-300 focus:outline-none focus:border-brand-600 focus:shadow-focus transition-all"
          />
        </div>

        {error && <p className="body-sm text-danger" role="alert">{error}</p>}

        {loading ? (
          <div className="flex flex-col gap-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-md" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="Try a different search term." />
        ) : (
          <div className="bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left" aria-label="Users">
                <thead>
                  <tr className="border-b border-ink-100 bg-surface2">
                    {["User", "Role", "Profession", "Specialty", "Verified", "Joined"].map(h => (
                      <th key={h} className="px-5 py-3 eyebrow text-ink-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelected(u)}
                      className={`${i < filtered.length - 1 ? "border-b border-ink-100" : ""} hover:bg-surface2 transition-colors cursor-pointer`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-ink-900 truncate">{u.name}</p>
                            <p className="body-sm text-ink-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={ROLE_BADGE[u.role] || "default"} size="sm">
                          {u.role.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 body-sm text-ink-700">{u.profession || "—"}</td>
                      <td className="px-5 py-3 body-sm text-ink-700">{u.specialty || "—"}</td>
                      <td className="px-5 py-3">
                        <Badge variant={u.isVerified ? "success" : "warning"} size="sm">
                          {u.isVerified ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 mono-sm text-ink-500">
                        {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog" aria-labelledby="user-detail-title">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setSelected(null)} aria-hidden="true" />
          <div className="relative bg-surface rounded-t-lg sm:rounded-lg w-full max-w-md shadow-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
              <h2 id="user-detail-title" className="heading-sm text-ink-900">User details</h2>
              <button onClick={() => setSelected(null)} aria-label="Close" className="p-1.5 rounded-sm text-ink-400 hover:text-ink-900 hover:bg-surface2 transition-colors">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Avatar name={selected.name} />
                <div>
                  <p className="heading-sm text-ink-900">{selected.name}</p>
                  <p className="body-sm text-ink-500">{selected.email}</p>
                </div>
                <Badge variant={ROLE_BADGE[selected.role] || "default"} className="ml-auto">{selected.role.toLowerCase()}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Phone",    value: selected.phoneNumber || "—" },
                  { label: "Profession", value: selected.profession || "—" },
                  { label: "Specialty",  value: selected.specialty || "—" },
                  { label: "Balance",    value: `€${selected.balance.toFixed(2)}` },
                  { label: "Verified",   value: selected.isVerified ? "Yes" : "No" },
                  { label: "Joined",     value: new Date(selected.createdAt).toLocaleDateString("en-GB") },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-surface2 rounded-sm p-3">
                    <p className="eyebrow text-ink-500 mb-0.5">{label}</p>
                    <p className="body-sm text-ink-900 font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-surface2 rounded-sm p-3">
                <p className="eyebrow text-ink-500 mb-0.5">User ID</p>
                <p className="mono-sm text-ink-500 break-all">{selected.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
