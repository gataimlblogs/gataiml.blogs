'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockStore, User, AlumniVerificationRequest, VerificationStatus } from '@/lib/mock-store';
import { getRelativeTimeIST, formatToIST } from '@/lib/time';
import Link from 'next/link';
import {
  Shield, CheckCircle2, XCircle, Clock, AlertTriangle, Users,
  ThumbsUp, ThumbsDown, RefreshCw, FileText, ChevronDown, Check
} from 'lucide-react';

export default function FacultyPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<AlumniVerificationRequest[]>([]);
  const [filter, setFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [reviewSuccess, setReviewSuccess] = useState<Record<string, VerificationStatus>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const loadData = () => {
    const user = mockStore.getCurrentUser();
    setCurrentUser(user);
    if (user.role !== 'FACULTY') return;
    setRequests(mockStore.getVerificationRequests());
  };

  useEffect(() => { loadData(); }, []);

  // Guard: non-faculty redirected away
  if (currentUser && currentUser.role !== 'FACULTY') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Access Restricted</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm mx-auto leading-relaxed">
          The Faculty Moderation Board is only accessible to verified faculty members.
        </p>
        <button onClick={() => router.push('/')}
          className="btn-interactive mt-6 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-bold">
          Return to Feed
        </button>
      </div>
    );
  }

  const handleReview = (requestId: string, status: VerificationStatus) => {
    if (!currentUser) return;
    setLoading(prev => ({ ...prev, [requestId]: true }));
    setTimeout(() => {
      mockStore.reviewVerificationRequest(requestId, currentUser.id, status, reviewNotes[requestId]);
      setReviewSuccess(prev => ({ ...prev, [requestId]: status }));
      setLoading(prev => ({ ...prev, [requestId]: false }));
      loadData();
      // Close expanded after action
      setTimeout(() => setExpandedId(null), 1200);
    }, 600);
  };

  const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter(r => r.status === 'PENDING').length,
    APPROVED: requests.filter(r => r.status === 'APPROVED').length,
    REJECTED: requests.filter(r => r.status === 'REJECTED').length,
  };

  const statusPill = (status: VerificationStatus) => {
    if (status === 'PENDING') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
    if (status === 'APPROVED') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
        <CheckCircle2 className="w-3 h-3" /> Approved
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center border border-rose-200 dark:border-rose-900/30">
            <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Faculty Moderation Board</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Logged in as {currentUser?.name} — Alumni verification requests
            </p>
          </div>
        </div>
        <button onClick={loadData}
          className="btn-interactive flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'ALL', label: 'Total', color: 'slate', icon: Users },
          { key: 'PENDING', label: 'Pending', color: 'amber', icon: Clock },
          { key: 'APPROVED', label: 'Approved', color: 'emerald', icon: CheckCircle2 },
          { key: 'REJECTED', label: 'Rejected', color: 'rose', icon: XCircle },
        ].map(({ key, label, color, icon: Icon }) => (
          <button key={key} onClick={() => setFilter(key as any)}
            className={`btn-interactive rounded-2xl border p-4 text-left transition-all shadow-sm ${
              filter === key
                ? `border-${color}-300 dark:border-${color}-800 bg-${color}-50 dark:bg-${color}-950/20`
                : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
            }`}
          >
            <Icon className={`w-4 h-4 mb-1.5 ${
              color === 'slate' ? 'text-slate-500' : color === 'amber'
                ? 'text-amber-600 dark:text-amber-400' : color === 'emerald'
                ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`} />
            <div className={`text-2xl font-extrabold ${
              color === 'slate' ? 'text-[var(--text-primary)]' : color === 'amber'
                ? 'text-amber-700 dark:text-amber-300' : color === 'emerald'
                ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}>
              {counts[key as keyof typeof counts]}
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-secondary)] mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">All caught up!</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">No {filter !== 'ALL' ? filter.toLowerCase() : ''} verification requests at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredRequests.map(req => {
            const isExpanded = expandedId === req.id;
            const successStatus = reviewSuccess[req.id];
            const isLoading = loading[req.id];

            return (
              <div key={req.id}
                className={`rounded-2xl border bg-[var(--bg-secondary)] shadow-sm overflow-hidden transition-all ${
                  req.status === 'PENDING' ? 'border-amber-200 dark:border-amber-900/40' : 'border-[var(--border-color)]'
                }`}
              >
                {/* Card header — click to expand */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-base uppercase flex-shrink-0">
                      {req.alumniName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/profile/${req.alumniUsername}`}
                          onClick={e => e.stopPropagation()}
                          className="font-extrabold text-sm text-[var(--text-primary)] hover:underline hover:text-[var(--accent-primary)]">
                          {req.alumniName}
                        </Link>
                        {statusPill(req.status)}
                        {successStatus && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            successStatus === 'APPROVED'
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20'
                          }`}>
                            ✓ Decision saved
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-[var(--text-muted)]">
                        <span>@{req.alumniUsername}</span>
                        <span>·</span>
                        <span>{req.alumniEmail}</span>
                        <span>·</span>
                        <span>Requested {getRelativeTimeIST(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded Details & Actions */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-color)] px-5 py-5 animate-fade-in">

                    {/* Detailed info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-xs text-[var(--text-secondary)]">
                      <div className="rounded-xl bg-[var(--bg-tertiary)] p-3.5 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Request Date</span>
                        <span className="font-semibold text-[var(--text-primary)]">{formatToIST(req.createdAt)}</span>
                      </div>
                      <div className="rounded-xl bg-[var(--bg-tertiary)] p-3.5 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Last Updated</span>
                        <span className="font-semibold text-[var(--text-primary)]">{formatToIST(req.updatedAt)}</span>
                      </div>
                      {req.facultyName && (
                        <div className="rounded-xl bg-[var(--bg-tertiary)] p-3.5 flex flex-col gap-1 col-span-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Reviewed By</span>
                          <span className="font-semibold text-[var(--text-primary)]">{req.facultyName}</span>
                        </div>
                      )}
                      {req.notes && (
                        <div className="rounded-xl bg-[var(--bg-tertiary)] p-3.5 flex flex-col gap-1 col-span-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Review Notes</span>
                          <span className="text-[var(--text-secondary)]">{req.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Review Form — only if still PENDING */}
                    {req.status === 'PENDING' && (
                      <div className="flex flex-col gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Review Notes (optional)
                          </label>
                          <textarea
                            value={reviewNotes[req.id] || ''}
                            onChange={e => setReviewNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                            rows={2}
                            placeholder="Add feedback or reason for your decision..."
                            className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            disabled={isLoading}
                            onClick={() => handleReview(req.id, 'APPROVED')}
                            className="btn-interactive flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/10"
                          >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                            Approve Verification
                          </button>
                          <button
                            disabled={isLoading}
                            onClick={() => handleReview(req.id, 'REJECTED')}
                            className="btn-interactive flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/30 text-xs font-bold"
                          >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
                            Reject Request
                          </button>
                        </div>
                      </div>
                    )}

                    {/* View profile link */}
                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                      <Link href={`/profile/${req.alumniUsername}`}
                        className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        View Full Profile of @{req.alumniUsername}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
