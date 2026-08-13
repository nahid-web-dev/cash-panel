"use client";

import { useState } from "react";
import { Lock, User, Eye, EyeOff, DollarSign, ArrowRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        username: formData.username.includes("@")
          ? formData.username.split("@")[0]
          : formData.username,
        password: formData.password,
      });

      if (!res.data?.success) {
        toast.error(res.data?.message || "Something wrong!");
        return;
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err?.message || "something wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00d632] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-emerald-950">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Header */}
        <div className="bg-[#00a025] border border-emerald-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8 text-center">
            {/* Cash Tag Icon */}
            <div className="w-16 h-16 bg-[#00d632] rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 transition-transform hover:scale-105">
              <DollarSign className="w-10 h-10 text-emerald-950 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Enter your account details to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                Username / Email
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-5 h-5 text-emerald-400/60" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-emerald-950/60 border border-emerald-800 text-white placeholder-white/80 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-5 h-5 text-emerald-400/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-emerald-950/60 border border-emerald-800 text-white placeholder-white/80 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all text-sm"
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-emerald-400/60 hover:text-emerald-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#13e744] hover:bg-[#0cce39] text-emerald-950 font-semibold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
