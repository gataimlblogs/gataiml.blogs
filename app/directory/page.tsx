'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockStore, User, Profile, Role } from '@/lib/mock-store';
import { Search, CheckCircle2, Shield, Users, GraduationCap, Briefcase } from 'lucide-react';

export default function DirectoryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [search, setSearch] = useState('');
  const [filterRoles, setFilterRoles] = useState<Set<Role>>(new Set(['STUDENT', 'ALUMNI', 'FACULTY']));

  useEffect(() => {
    const allUsers = mockStore.getUsers();
    setUsers(allUsers);
    const profileMap = new Map<string, Profile>();
    allUsers.forEach(u => {
      profileMap.set(u.id, mockStore.getProfileByUserId(u.id));
    });
    setProfiles(profileMap);
  }, []);

  const toggleRole = (role: Role) => {
    setFilterRoles(prev => {
      const next = new Set(prev);
      if (next.has(role)) { next.delete(role); } else { next.add(role); }
      return next;
    });
  };

  const filtered = users.filter(u => {
    const profile = profiles.get(u.id);
    const q = search.toLowerCase();
    const matchesSearch = !q
      || u.name.toLowerCase().includes(q)
      || u.username.toLowerCase().includes(q)
      || profile?.department?.toLowerCase().includes(q)
      || profile?.company?.toLowerCase().includes(q)
      || profile?.skills.some(s => s.toLowerCase().includes(q));
    return matchesSearch && filterRoles.has(u.role);
  });

  const roleStats = { STUDENT: 0, ALUMNI: 0, FACULTY: 0 };
  users.forEach(u => roleStats[u.role]++);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">College Directory</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Connect with {users.length} members — students, alumni, and faculty
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Students', count: roleStats.STUDENT, role: 'STUDENT' as Role, icon: GraduationCap, color: 'emerald' },
          { label: 'Alumni', count: roleStats.ALUMNI, role: 'ALUMNI' as Role, icon: CheckCircle2, color: 'indigo' },
          { label: 'Faculty', count: roleStats.FACULTY, role: 'FACULTY' as Role, icon: Shield, color: 'rose' },
        ].map(({ label, count, role, icon: Icon, color }) => (
          <button key={role} onClick={() => toggleRole(role)}
            className={`btn-interactive rounded-2xl border p-4 text-left transition-all shadow-sm ${
              filterRoles.has(role)
                ? `border-${color}-300 dark:border-${color}-800 bg-${color}-50 dark:bg-${color}-950/20`
                : 'border-[var(--border-color)] bg-[var(--bg-secondary)] opacity-60'
            }`}
          >
            <Icon className={`w-5 h-5 mb-2 ${
              color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400'
              : color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-rose-600 dark:text-rose-400'
            }`} />
            <div className={`text-2xl font-extrabold ${
              color === 'emerald' ? 'text-emerald-700 dark:text-emerald-300'
              : color === 'indigo' ? 'text-indigo-700 dark:text-indigo-300'
              : 'text-rose-700 dark:text-rose-300'
            }`}>{count}</div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, @username, department, company, or skill..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-sm"
        />
      </div>

      {/* Results count */}
      <div className="mb-4 px-1">
        <span className="text-xs text-[var(--text-muted)] font-medium">
          Showing {filtered.length} of {users.length} members
        </span>
      </div>

      {/* Member Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-12 text-center">
          <Users className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">No members match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(u => {
            const profile = profiles.get(u.id);
            return (
              <Link key={u.id} href={`/profile/${u.username}`}>
                <div className="card-hover rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm h-full flex flex-col">
                  {/* Banner */}
                  <div className={`h-16 ${
                    u.role === 'STUDENT'
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      : u.role === 'ALUMNI'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                        : 'bg-gradient-to-r from-rose-500 to-pink-600'
                  }`} />

                  <div className="px-4 pb-5 flex-grow flex flex-col relative">
                    {/* Avatar */}
                    <div className="absolute -top-6 left-4">
                      <div className="w-12 h-12 rounded-xl border-2 border-[var(--bg-secondary)] bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow uppercase">
                        {u.name.charAt(0)}
                      </div>
                    </div>

                    <div className="pt-8">
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-1.5 leading-tight">
                            {u.name}
                            {u.role === 'ALUMNI' && u.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                            )}
                            {u.role === 'FACULTY' && (
                              <Shield className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            )}
                          </h3>
                          <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">@{u.username}</p>
                        </div>

                        {/* Role badge */}
                        {u.role === 'STUDENT' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
                            Student
                          </span>
                        )}
                        {u.role === 'ALUMNI' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 flex-shrink-0">
                            Alumni
                          </span>
                        )}
                        {u.role === 'FACULTY' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 flex-shrink-0">
                            Faculty
                          </span>
                        )}
                      </div>

                      {/* Sub-info */}
                      <p className="text-xs text-[var(--text-secondary)] mt-2.5 leading-relaxed line-clamp-2">
                        {u.role === 'ALUMNI' && profile?.company
                          ? `${profile.jobTitle || 'Alumni'} at ${profile.company}`
                          : u.role === 'STUDENT' && profile?.department
                            ? profile.department
                            : profile?.bio || 'No bio yet.'}
                      </p>

                      {/* Skills chips */}
                      {profile?.skills && profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {profile.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[9px] font-semibold text-[var(--text-secondary)]">
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[9px] font-semibold text-[var(--text-muted)]">
                              +{profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
