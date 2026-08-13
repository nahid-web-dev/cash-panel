"use client";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Trash2,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Users() {
  const [usersList, setUsersList] = useState([]);

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null); // Track deleting state per user

  // Fetch Users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.data?.success) {
        setUsersList(response.data.data);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Handle Form Submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/users/create", {
        username,
        password,
      });

      if (response.data?.success) {
        toast.success("User Created.");
        setUsername("");
        setPassword("");
        fetchAllUsers(); // Refresh list automatically
      } else {
        toast.error(response.data?.message || "Something wrong!");
      }
    } catch (error) {
      toast.error(error?.message || "Something wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userToDelete) => {
    // Optional client-side confirmation
    if (!confirm(`Are you sure you want to delete ${userToDelete}?`)) {
      return;
    }

    setDeletingUser(userToDelete);

    try {
      const response = await axios.post("/api/users/delete", {
        username: userToDelete,
      });

      if (response.data?.success) {
        toast.success(`user ${userToDelete} deleted successfully!`);
        fetchAllUsers(); // Refresh list automatically
      } else {
        toast.error(response.data?.message || "something wrong");
      }
    } catch (error) {
      toast.error(error?.message || "something wrong");
    } finally {
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center p-4">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-950">
            User Management
          </h1>
          <p className="text-sm text-emerald-600">
            You can add or delete users.
          </p>
        </div>

        {/* Add User Form */}
        <form
          onSubmit={handleAddUser}
          className="w-full bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl space-y-4 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Username Field */}
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
              <input
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm text-emerald-950 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm text-emerald-950 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-800 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>

      {/* User Table */}
      <div className="overflow-hidden w-full max-w-xl rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-emerald-900">
            <thead className="border-b border-emerald-100 bg-emerald-50/50 text-xs uppercase text-emerald-700">
              <tr>
                <th className="px-6 py-4 font-semibold min-w-[40%]">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {usersList.map((user, idx) => (
                <tr
                  key={user.id || idx}
                  className="transition-colors hover:bg-emerald-50/40"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-emerald-950">
                      {user.username}
                    </div>
                    <div className="text-xs text-emerald-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-800">
                    {user.role || "user"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={deletingUser === user.username}
                      title="Delete User"
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {deletingUser === user.username ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
