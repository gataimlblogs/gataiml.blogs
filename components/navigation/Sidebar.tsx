"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { mockStore, User, Profile } from "@/lib/mock-store";
import {
  CheckCircle2,
  Shield,
  GraduationCap,
  Building,
  Users,
  Briefcase,
  Award,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [postsCount, setPostsCount] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);

  useEffect(() => {
    const user = mockStore.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setProfile(mockStore.getProfileByUserId(user.id));

      // Count posts by this user
      const posts = mockStore.getPosts();
      setPostsCount(posts.filter((p) => p.userId === user.id).length);

      // Count pending verifications for faculty
      if (user.role === "FACULTY") {
        const verifications = mockStore.getVerificationRequests();
        setPendingVerifications(
          verifications.filter((v) => v.status === "PENDING").length,
        );
      }
    }
  }, []);

  if (!currentUser) return null;

  return (
    <aside className="w-full flex flex-col gap-4 animate-fade-in">
      {/* Profile Card Widget */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        {/* Colorful Gradient Header Banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Avatar & Basic Info */}
        <div className="px-4 pb-4 relative">
          <div className="absolute -top-8 left-4">
            <div className="w-16 h-16 rounded-2xl border-4 border-[var(--bg-secondary)] bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md uppercase">
              {currentUser.name.charAt(0)}
            </div>
          </div>

          <div className="pt-10">
            <Link
              href={`/profile/${currentUser.username}`}
              className="block group"
            >
              <h3 className="font-extrabold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] group-hover:underline flex items-center gap-1.5 transition-colors">
                {currentUser.name}
                {currentUser.role === "ALUMNI" && currentUser.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-50" />
                )}
                {currentUser.role === "FACULTY" && (
                  <Shield className="w-4 h-4 text-rose-500 fill-rose-50" />
                )}
              </h3>
            </Link>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              @{currentUser.username}
            </p>

            {/* Tagline / Bio Teaser */}
            {profile?.bio && (
              <p className="mt-3 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          <hr className="my-4 border-[var(--border-color)]" />

          {/* Role-Specific details */}
          <div className="flex flex-col gap-2.5 text-xs text-[var(--text-secondary)]">
            {currentUser.role === "STUDENT" && (
              <>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>Graduating {profile?.graduationYear || "2027"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="line-clamp-1">
                    {profile?.department || "CSE Department"}
                  </span>
                </div>
              </>
            )}

            {currentUser.role === "ALUMNI" && (
              <>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="line-clamp-1 font-semibold text-[var(--text-primary)]">
                    {profile?.jobTitle || "Alumnus"}{" "}
                    {profile?.company ? `at ${profile.company}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>Class of {profile?.graduationYear || "2024"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[var(--text-muted)] text-indigo-500" />
                  <span>
                    Status:{" "}
                    {currentUser.isVerified ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        Verified Alumnus
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        Pending Verification
                      </span>
                    )}
                  </span>
                </div>
              </>
            )}

            {currentUser.role === "FACULTY" && (
              <>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    Institutional Faculty Moderator
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>CSE Academic Coordinator</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Row Footer */}
        <div className="bg-[var(--bg-tertiary)] px-4 py-3 flex items-center justify-between text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)]">
          <div className="flex flex-col">
            <span className="font-bold text-[var(--text-primary)]">
              {postsCount}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              My Posts
            </span>
          </div>
          {currentUser.role === "FACULTY" ? (
            <Link
              href="/faculty"
              className="flex flex-col items-end hover:underline"
            >
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {pendingVerifications}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Pending Approvals
              </span>
            </Link>
          ) : (
            <Link
              href="/directory"
              className="flex flex-col items-end hover:underline"
            >
              <span className="font-bold text-[var(--text-primary)]">64+</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                College Contacts
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Helpful Quick Links Card */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm">
        <h4 className="font-bold text-sm text-[var(--text-primary)] mb-3">
          Quick Actions
        </h4>
        <div className="flex flex-col gap-2">
          <Link
            href={`/profile/${currentUser.username}`}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
            Manage Profile
          </Link>
          {currentUser.role === "STUDENT" && (
            <Link
              href="/jobs"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <Briefcase className="w-4 h-4 text-emerald-500" />
              Explore Job Internships
            </Link>
          )}
          {currentUser.role !== "STUDENT" && (
            <Link
              href="/jobs?post=true"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Post a New Job
            </Link>
          )}
          <Link
            href="/directory"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Users className="w-4 h-4 text-orange-500" />
            Browse Directory
          </Link>
        </div>
      </div>
    </aside>
  );
}
