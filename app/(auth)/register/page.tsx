"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockStore, Role } from "@/lib/mock-store";
import {
  User,
  Shield,
  CheckCircle,
  Mail,
  KeyRound,
  ArrowRight,
  Info,
  GraduationCap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce username checking
  useEffect(() => {
    if (!username) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    const timer = setTimeout(() => {
      const sanitized = username.trim().toLowerCase();
      const regex = /^[a-zA-Z0-9_]{3,20}$/;

      if (!regex.test(sanitized)) {
        setUsernameAvailable(false);
        setUsernameChecking(false);
        return;
      }

      // Check against mock database
      const userExists = mockStore.getUserByUsername(sanitized);
      setUsernameAvailable(!userExists);
      setUsernameChecking(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (usernameAvailable === false) {
      setError("Please choose an available, valid username.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        const newUser = mockStore.createUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim().toLowerCase(),
          role,
        });

        // Set as current logged-in user
        mockStore.setCurrentUser(newUser.id);
        router.push("/");

        // Force refresh to update navigation and layouts
        setTimeout(() => window.location.reload(), 100);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during registration.";
        setError(message);
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Intro Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-indigo-400 items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/20 mb-3">
            A
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Join the digital network of college students, alumni, and faculty
            members
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/50">
                {error}
              </div>
            )}

            {/* Display Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bhuvan Prasanna"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Custom Unique Username */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Choose a Unique Username
                </label>
                {username && (
                  <span className="text-[10px] font-semibold">
                    {usernameChecking ? (
                      <span className="text-[var(--text-muted)]">
                        Checking...
                      </span>
                    ) : usernameAvailable ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Available
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">
                        Invalid or Taken
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-[var(--text-muted)]">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/\s+/g, ""))
                  }
                  placeholder="bhuvan_student"
                  className={`w-full pl-7 pr-4 py-2.5 rounded-xl border bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none transition-colors ${
                    usernameAvailable === true
                      ? "border-emerald-300 focus:border-emerald-500"
                      : usernameAvailable === false
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-[var(--border-color)] focus:border-[var(--accent-primary)]"
                  }`}
                />
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                3-20 characters, alphanumeric and underscores only. Determines
                your profile URL.
              </p>
            </div>

            {/* Role Choice */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["STUDENT", "ALUMNI", "FACULTY"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all flex flex-col items-center gap-1.5 ${
                      role === r
                        ? "bg-[var(--accent-light)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold"
                        : "border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    {r === "STUDENT" && <GraduationCap className="w-4 h-4" />}
                    {r === "ALUMNI" && <CheckCircle className="w-4 h-4" />}
                    {r === "FACULTY" && <Shield className="w-4 h-4" />}
                    {r.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Alumni Pipeline warning */}
            {role === "ALUMNI" && (
              <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                  <strong>Verification Required:</strong> Your Alumni
                  registration will trigger a pending verification request in
                  the Faculty board. You can browse, but will need faculty
                  approval to post jobs.
                </p>
              </div>
            )}

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || usernameChecking}
              className="btn-interactive w-full py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Registering..." : "Complete Sign Up"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Login redirect */}
          <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--accent-primary)] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
