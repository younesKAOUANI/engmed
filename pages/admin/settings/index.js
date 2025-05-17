import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2, User, Lock } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile form states
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profession, setProfession] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading" || !userId) return;
      setLoading(true);
      try {
        const response = await axios.get("/api/users/me", {
          params: { userId },
        });
        setUserData(response.data);
        // Populate form fields with fetched data
        setName(response.data.name);
        setPhoneNumber(response.data.phoneNumber || "");
        setProfession(response.data.profession || "");
        setYearOfStudy(response.data.yearOfStudy || "");
        setSpecialty(response.data.specialty || "");
        setProfilePicture(response.data.profilePicture || "");
      } catch (err) {
        setError("Failed to fetch profile information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, status]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileSubmitting(true);

    try {
      const response = await axios.put("/api/users/profile", {
        userId,
        name,
        phoneNumber,
        profession,
        yearOfStudy: profession === "Student" ? parseInt(yearOfStudy) || undefined : undefined,
        specialty,
        profilePicture,
      });
      setProfileSuccess("Profile updated successfully!");
      setUserData({ ...userData, name, phoneNumber, profession, yearOfStudy, specialty, profilePicture });
    } catch (err) {
      setProfileError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordSubmitting(true);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      setPasswordSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      setPasswordSubmitting(false);
      return;
    }

    try {
      const response = await axios.put("/api/users/password", {
        userId,
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to update password");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Please log in to view your settings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-500" />
            Update Profile Information
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Email (Cannot be changed)</label>
              <p className="text-gray-800">{userData.email}</p>
            </div>
            <div>
              <label className="block text-gray-600">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Profession</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Profession (optional)</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {profession === "Student" && (
              <div>
                <label className="block text-gray-600">Year of Study</label>
                <input
                  type="number"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-600">Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Profile Picture URL</label>
              <input
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {profilePicture && (
                <div className="mt-2">
                  <img
                    src={profilePicture}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => (e.target.src = "/default-profile.png")} // Fallback if URL fails
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-600">Role</label>
              <p className="text-gray-800">{userData.role}</p>
            </div>
            <div>
              <label className="block text-gray-600">Account Created</label>
              <p className="text-gray-800">{new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
            {profileError && <p className="text-red-500">{profileError}</p>}
            {profileSuccess && <p className="text-green-500">{profileSuccess}</p>}
            <button
              type="submit"
              disabled={profileSubmitting}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
            >
              {profileSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Lock className="w-6 h-6 mr-2 text-blue-500" />
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-gray-600">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-gray-600">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-600">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-500">{passwordSuccess}</p>}
            <button
              type="submit"
              disabled={passwordSubmitting}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
            >
              {passwordSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}