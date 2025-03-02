"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../../../components/ui/Button";
import { X } from "lucide-react";

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  if (status === "loading") return <p>Loading...</p>;

  // Client-side role check for UX (not security)
  if (session?.user?.role !== "ADMIN") {
    return <p className="text-red-500 p-6">Access denied. Admins only.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Registered Users</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users registered yet.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleUserClick(user)}
            >
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* User Details Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedUser.name} - Details</h2>
              <Button
                onClick={closePopup}
                className="p-1 bg-transparent hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-700" />
              </Button>
            </div>
            <div className="space-y-3">
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone Number:</strong> {selectedUser.phoneNumber || "Not provided"}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Specialty:</strong> {selectedUser.specialty || "Not specified"}</p>
              <p><strong>Balance:</strong> ${selectedUser.balance.toFixed(2)}</p>
              <p><strong>Verified:</strong> {selectedUser.isVerified ? "Yes" : "No"}</p>
              <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
              {selectedUser.profilePicture && (
                <div>
                  <strong>Profile Picture:</strong>
                  <img
                    src={selectedUser.profilePicture}
                    alt="Profile"
                    className="mt-2 w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}