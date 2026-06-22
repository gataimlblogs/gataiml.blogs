'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockStore, Job, User } from '@/lib/mock-store';
import { getRelativeTimeIST } from '@/lib/time';
import Link from 'next/link';
import {
  Briefcase, MapPin, Clock, Wifi, Building2, Search, Filter,
  Plus, X, CheckCircle2, Shield, AlertTriangle, Check, DollarSign,
  ExternalLink, ChevronDown
} from 'lucide-react';

function JobBoardInner() {
  const searchParams = useSearchParams();
  const openPost = searchParams.get('post') === 'true';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJobId, setApplyJobId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Post job modal state
  const [showPostModal, setShowPostModal] = useState(openPost);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Internship'>('Internship');
  const [newWorkMode, setNewWorkMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  const loadData = () => {
    const user = mockStore.getCurrentUser();
    setCurrentUser(user);
    const allJobs = mockStore.getJobs();
    setJobs(allJobs);
    // Detect which jobs current user already applied to
    const apps = allJobs.filter(j => j.applicants.includes(user.id));
    setAppliedJobs(new Set(apps.map(j => j.id)));
  };

  useEffect(() => { loadData(); }, []);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = !search || j.title.toLowerCase().includes(search.toLowerCase())
      || j.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || j.jobType === filterType;
    const matchesMode = filterMode === 'All' || j.workMode === filterMode;
    const matchesLocation = !filterLocation || j.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesType && matchesMode && matchesLocation;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    mockStore.applyToJob(applyJobId, currentUser.id, coverLetter);
    setAppliedJobs(prev => new Set([...prev, applyJobId]));
    setShowApplyModal(false);
    setCoverLetter('');
    loadData();
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    if (!currentUser) return;
    try {
      mockStore.createJob(currentUser.id, {
        title: newTitle, company: newCompany, description: newDescription,
        requirements: newRequirements, location: newLocation,
        salaryRange: newSalary, jobType: newJobType, workMode: newWorkMode
      });
      setPostSuccess(true);
      setShowPostModal(false);
      setNewTitle(''); setNewCompany(''); setNewDescription('');
      setNewRequirements(''); setNewLocation(''); setNewSalary('');
      loadData();
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err: any) {
      setPostError(err.message || 'Failed to post job.');
    }
  };

  const canPostJob = currentUser?.role === 'FACULTY' ||
    (currentUser?.role === 'ALUMNI' && currentUser.isVerified);

  const workModeIcon = (mode: string) => {
    if (mode === 'Remote') return <Wifi className="w-3.5 h-3.5 text-emerald-500" />;
    if (mode === 'Hybrid') return <Briefcase className="w-3.5 h-3.5 text-indigo-500" />;
    return <Building2 className="w-3.5 h-3.5 text-orange-500" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8">

      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Job Board</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {filteredJobs.length} opportunity{filteredJobs.length !== 1 ? 'ies' : 'y'} available
          </p>
        </div>
        {canPostJob && (
          <button
            onClick={() => setShowPostModal(true)}
            className="btn-interactive flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/10"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </button>
        )}
        {currentUser?.role === 'ALUMNI' && !currentUser.isVerified && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-700 dark:text-amber-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Verify your account to post jobs
          </div>
        )}
      </div>

      {postSuccess && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-900/30">
          <Check className="w-4 h-4" /> Job posted successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Filter Sidebar */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-[var(--accent-primary)]" /> Filters
          </h3>

          <div className="flex flex-col gap-4">
            {/* Search */}
            <div>
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Role or company..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                Job Type
              </label>
              <div className="flex flex-col gap-1.5">
                {['All', 'Full-time', 'Internship'].map(t => (
                  <button key={t} onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      filterType === t
                        ? 'bg-[var(--accent-light)] text-[var(--accent-primary)] font-bold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                Work Mode
              </label>
              <div className="flex flex-col gap-1.5">
                {['All', 'On-site', 'Remote', 'Hybrid'].map(m => (
                  <button key={m} onClick={() => setFilterMode(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      filterMode === m
                        ? 'bg-[var(--accent-light)] text-[var(--accent-primary)] font-bold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                Location
              </label>
              <input
                type="text" value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                placeholder="City or region..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-12 text-center">
              <Briefcase className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-secondary)] font-medium">No jobs match your filters.</p>
            </div>
          ) : (
            filteredJobs.map(job => {
              const hasApplied = appliedJobs.has(job.id);
              return (
                <div key={job.id}
                  className="card-hover rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 shadow-sm cursor-pointer"
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      {/* Company Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-primary)] font-extrabold text-lg flex-shrink-0 uppercase">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-tight">{job.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-semibold mt-0.5">{job.company}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            {workModeIcon(job.workMode)} {job.workMode}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            job.jobType === 'Internship'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
                          }`}>{job.jobType}</span>
                          {job.salaryRange && (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                              <DollarSign className="w-3 h-3" /> {job.salaryRange}
                            </span>
                          )}
                        </div>

                        {/* Poster info */}
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[var(--text-muted)]">
                          <span>Posted by</span>
                          <Link href={`/profile/${job.creatorUsername}`}
                            onClick={e => e.stopPropagation()}
                            className="font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-0.5"
                          >
                            {job.creatorName}
                            {job.creatorRole === 'FACULTY' && <Shield className="w-3 h-3 text-rose-500" />}
                            {job.creatorRole === 'ALUMNI' && <CheckCircle2 className="w-3 h-3 text-indigo-500" />}
                          </Link>
                          <span>•</span>
                          <span>{getRelativeTimeIST(job.createdAt)}</span>
                          <span>•</span>
                          <span>{job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply / Applied button */}
                    <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                      {currentUser?.role === 'STUDENT' && (
                        hasApplied ? (
                          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-900/30">
                            <Check className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => { setApplyJobId(job.id); setShowApplyModal(true); }}
                            className="btn-interactive px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold shadow-md shadow-indigo-500/10"
                          >
                            Apply Now
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Expanded Description */}
                  {selectedJob?.id === job.id && (
                    <div className="mt-5 pt-5 border-t border-[var(--border-color)] animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider mb-2">Description</h5>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{job.description}</p>
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider mb-2">Requirements</h5>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{job.requirements}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xl animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-base text-[var(--text-primary)]">Submit Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplySubmit} className="p-6 flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
                <span className="font-bold text-[var(--text-primary)]">Applying as:</span> {currentUser?.name} (@{currentUser?.username})
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Cover Letter (optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={5}
                  placeholder="Briefly describe why you're a great fit for this role..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                />
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                Your resume ({currentUser?.username}_resume.pdf) will be attached automatically.
              </div>
              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setShowApplyModal(false)}
                  className="btn-interactive flex-1 py-2.5 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                >Cancel</button>
                <button type="submit"
                  className="btn-interactive flex-1 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/10"
                >Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xl animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-base text-[var(--text-primary)]">Post a New Job Opening</h3>
              <button onClick={() => setShowPostModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePostJob} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              {postError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/30">
                  {postError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Job Title *</label>
                  <input required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Software Engineering Intern" className="px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Company *</label>
                  <input required value={newCompany} onChange={e => setNewCompany(e.target.value)}
                    placeholder="e.g. Google" className="px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Salary Range</label>
                  <input value={newSalary} onChange={e => setNewSalary(e.target.value)}
                    placeholder="e.g. ₹80,000 / month" className="px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Job Type *</label>
                  <select required value={newJobType} onChange={e => setNewJobType(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]">
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Work Mode *</label>
                  <select required value={newWorkMode} onChange={e => setNewWorkMode(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]">
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Location *</label>
                  <input required value={newLocation} onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India" className="px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Job Description *</label>
                  <textarea required value={newDescription} onChange={e => setNewDescription(e.target.value)}
                    rows={4} placeholder="Describe the role and responsibilities..."
                    className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Requirements *</label>
                  <textarea required value={newRequirements} onChange={e => setNewRequirements(e.target.value)}
                    rows={2} placeholder="Skills, qualifications, or years of experience..."
                    className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none" />
                </div>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setShowPostModal(false)}
                  className="btn-interactive flex-1 py-2.5 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                >Cancel</button>
                <button type="submit"
                  className="btn-interactive flex-1 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/10"
                >Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-20 text-center text-[var(--text-muted)]">Loading jobs...</div>}>
      <JobBoardInner />
    </Suspense>
  );
}
