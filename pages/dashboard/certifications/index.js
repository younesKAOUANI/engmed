import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2, Award } from "lucide-react";

export default function CertificatesPage() {
  const { data: session, status } = useSession(); // Get user session
  const userId = session?.user?.id;

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (status === "loading" || !userId) return; // Wait for session to load
      setLoading(true);
      try {
        const response = await axios.get("/api/certificates/user", {
          params: { userId },
        });
        setCertificates(response.data);
      } catch (err) {
        setError("Failed to fetch certificates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [userId, status]);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Please log in to view your certificates.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-8xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Your Certificates</h1>
        {certificates.length === 0 ? (
          <p className="text-center text-gray-600">You haven’t earned any certificates yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4"
              >
                <Award className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold">{certificate.course.title}</h2>
                  <p className="text-gray-600">
                    Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                  {/* Optional: Add a download link or certificate preview */}
                  <p className="text-sm text-gray-500 mt-2">Certificate ID: {certificate.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}