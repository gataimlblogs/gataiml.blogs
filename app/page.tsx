"use client";

import React, { useEffect, useState } from "react";
import { mockStore, Post } from "@/lib/mock-store";
import Sidebar from "@/components/navigation/Sidebar";
import PostCreator from "@/components/feed/PostCreator";
import PostCard from "@/components/feed/PostCard";
import { GraduationCap, Flame, ArrowRight } from "lucide-react";

import Link from "next/link";

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = () => {
    setPosts(mockStore.getPosts());
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const featuredAlumni = mockStore
    .getUsers()
    .filter((u) => u.role === "ALUMNI" && u.isVerified)
    .slice(0, 2);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Column: Profile Card Teaser */}
        <div className="lg:col-span-3">
          <Sidebar />
        </div>

        {/* Center Column: Feed Editor & Feed List */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Post Editor */}
          <PostCreator onPostCreated={fetchPosts} />

          {/* Feed Header */}
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-base text-[var(--text-primary)]">
              Activity Feed
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Sorted by: Newest
            </span>
          </div>

          {/* List of Posts */}
          {posts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdated={fetchPosts}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-12 text-center">
              <p className="text-sm text-[var(--text-secondary)] italic">
                No activity yet. Be the first to share an update!
              </p>
            </div>
          )}
        </div>

        {/* Right Side Column: Trends & Suggestions */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Trending Panel */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm">
            <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-3.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              Trending College Buzz
            </h4>
            <div className="flex flex-col gap-3.5">
              <div className="group cursor-pointer">
                <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider block">
                  Placement Update
                </span>
                <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] line-clamp-2 mt-0.5 leading-snug transition-colors">
                  Highest package touches record ₹48 LPA at CSE placements this
                  season
                </p>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1">
                  126 students applied • 2d ago
                </span>
              </div>

              <div className="group cursor-pointer">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Hackathon
                </span>
                <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] line-clamp-2 mt-0.5 leading-snug transition-colors">
                  Registration open for Annual Innowave 48-Hour Hackathon 2026
                </p>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1">
                  45 teams registered • 4d ago
                </span>
              </div>

              <div className="group cursor-pointer">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  Campus Event
                </span>
                <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] line-clamp-2 mt-0.5 leading-snug transition-colors">
                  Distinguished Speaker Lecture on Quantum Computing by ISRO
                  Scientists
                </p>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1">
                  Seminar Hall 1 • 6d ago
                </span>
              </div>
            </div>
          </div>

          {/* Featured Alumni Recommendations */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm">
            <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-3.5">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              Spotlight Alumni
            </h4>
            <div className="flex flex-col gap-3">
              {featuredAlumni.map((alumnus) => (
                <div key={alumnus.id} className="flex gap-2.5 items-start">
                  <Link
                    href={`/profile/${alumnus.username}`}
                    className="btn-interactive flex-shrink-0 block"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 font-extrabold flex items-center justify-center text-xs uppercase">
                      {alumnus.name.charAt(0)}
                    </div>
                  </Link>
                  <div className="flex-grow">
                    <Link
                      href={`/profile/${alumnus.username}`}
                      className="hover:underline"
                    >
                      <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                        {alumnus.name}
                      </div>
                    </Link>
                    <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">
                      @{alumnus.username}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium block mt-1 line-clamp-1">
                      Works at Google
                    </span>
                  </div>
                </div>
              ))}
              <hr className="border-[var(--border-color)] my-1" />
              <Link
                href="/directory"
                className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center justify-center gap-1 mt-1.5"
              >
                Find more alumni
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
