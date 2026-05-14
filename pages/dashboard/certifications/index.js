import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Head from "next/head";
import { Award, Download } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

function CertCard({ cert }) {
  return (
    <div className="group relative bg-surface border border-ink-100 rounded-md shadow-1 overflow-hidden transition-all duration-220 hover:-translate-y-0.5 hover:shadow-3">
      {/* Paper texture header */}
      <div className="bg-surface2 border-b border-ink-100 px-6 pt-6 pb-4 text-center">
        <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
          <Award className="w-6 h-6 text-accent-600" aria-hidden="true" />
        </div>
        <p className="eyebrow text-accent-600">Certificate of Completion</p>
      </div>
      {/* Details */}
      <div className="px-6 py-5 flex flex-col gap-3 text-center">
        <h2 className="heading-sm text-ink-900 line-clamp-2">{cert.course.title}</h2>
        <p className="body-sm text-ink-500">
          Issued {new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="mono-sm text-ink-300">ID: {cert.id.slice(-12).toUpperCase()}</p>
      </div>
      {/* Actions — appear on hover */}
      <div className="px-6 pb-5">
        <Button variant="secondary" size="sm" className="w-full gap-2">
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading" || !userId) return;
    axios.get("/api/certificates/user", { params: { userId } })
      .then((r) => setCertificates(r.data))
      .finally(() => setLoading(false));
  }, [userId, status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head><title>Certificates — EngMed</title></Head>
      <div className="pb-12">
        <div className="mb-8">
          <h1 className="heading-lg text-ink-900">My Certificates</h1>
          <p className="body-sm text-ink-500 mt-1">
            {certificates.length === 0
              ? "Complete a course exam to earn your first certificate."
              : `${certificates.length} certificate${certificates.length > 1 ? "s" : ""} earned`}
          </p>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certificates yet"
            description="Pass a course's final exam to earn a verifiable certificate of completion."
            action={{ label: "Browse courses", href: "/dashboard/courses" }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert) => <CertCard key={cert.id} cert={cert} />)}
          </div>
        )}
      </div>
    </>
  );
}
