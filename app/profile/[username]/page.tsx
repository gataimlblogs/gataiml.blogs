'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockStore, User, Profile, Post } from '@/lib/mock-store';
import PostCard from '@/components/feed/PostCard';
import { 
  CheckCircle2, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Building, 
  Edit3, 
  Award, 
  ChevronRight, 
  X, 
  Check, 
  Plus
} from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'achievements' | 'activity'>('about');
  
  // Edit state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editGraduationYear, setEditGraduationYear] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editSkills, setEditSkills] = useState('');

  const loadProfileData = () => {
    const foundUser = mockStore.getUserByUsername(username);
    if (!foundUser) return;

    setUser(foundUser);
    const foundProfile = mockStore.getProfileByUserId(foundUser.id);
    setProfile(foundProfile);

    // Filter posts by this user
    const allPosts = mockStore.getPosts();
    setPosts(allPosts.filter(p => p.userId === foundUser.id));

    // Populate edit fields
    setEditBio(foundProfile.bio || '');
    setEditGraduationYear(foundProfile.graduationYear?.toString() || '');
    setEditDepartment(foundProfile.department || '');
    setEditCompany(foundProfile.company || '');
    setEditJobTitle(foundProfile.jobTitle || '');
    setEditSkills(foundProfile.skills.join(', '));
  };

  useEffect(() => {
    setCurrentUser(mockStore.getCurrentUser());
    loadProfileData();
  }, [username]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">User Not Found</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          The username &quot;@{username}&quot; does not match any registered accounts.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="btn-interactive mt-6 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === user.id;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateProfile(user.id, {
      bio: editBio,
      graduationYear: editGraduationYear ? parseInt(editGraduationYear) : undefined,
      department: editDepartment,
      company: editCompany,
      jobTitle: editJobTitle,
      skills: editSkills.split(',').map(s => s.trim()).filter(s => s !== '')
    });
    
    setIsEditModalOpen(false);
    loadProfileData();
    
    // Dispatch storage event to update sidebar
    window.dispatchEvent(new Event('storage'));
  };

  const achievementPosts = posts.filter(p => p.tag.includes('Achievement'));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8 transition-colors duration-300">
      
      {/* Profile Header Block */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="h-44 md:h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative" />
        
        {/* Header Content */}
        <div className="px-6 pb-6 relative">
          
          {/* Avatar positioning */}
          <div className="absolute -top-16 md:-top-20 left-6">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 border-[var(--bg-secondary)] bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-4xl md:text-5xl shadow-md uppercase">
              {user.name.charAt(0)}
            </div>
          </div>
          
          {/* Action buttons (Edit Profile) */}
          <div className="flex justify-end pt-4 h-16">
            {isOwner && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn-interactive flex items-center gap-1.5 px-4 py-2 border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-xs font-bold rounded-xl text-[var(--text-primary)] shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-[var(--accent-primary)]" />
                Edit Profile
              </button>
            )}
          </div>

          {/* User Tags & Info */}
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">{user.name}</h2>
              
              {/* Role Indicator */}
              {user.role === 'STUDENT' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                  Student
                </span>
              )}
              {user.role === 'ALUMNI' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                  {user.isVerified && <CheckCircle2 className="w-3.5 h-3.5" />}
                  Alumnus
                </span>
              )}
              {user.role === 'FACULTY' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                  <Shield className="w-3.5 h-3.5" />
                  Faculty
                </span>
              )}
            </div>
            
            <p className="text-sm text-[var(--text-muted)] font-medium mt-1">@{user.username}</p>

            {/* Sub-headline */}
            <p className="mt-3.5 text-sm md:text-base text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
              {user.role === 'STUDENT' && (
                <span className="flex items-center gap-1.5 flex-wrap">
                  <GraduationCap className="w-4.5 h-4.5 text-[var(--text-muted)]" />
                  Pursuing B.Tech {profile?.department ? `in ${profile.department}` : ''} • Class of {profile?.graduationYear || '2027'}
                </span>
              )}
              {user.role === 'ALUMNI' && profile?.jobTitle && (
                <span className="flex items-center gap-1.5 flex-wrap">
                  <Briefcase className="w-4.5 h-4.5 text-[var(--text-muted)]" />
                  {profile.jobTitle} {profile.company ? `at ${profile.company}` : ''} • CSE Class of {profile.graduationYear || '2024'}
                </span>
              )}
              {user.role === 'FACULTY' && (
                <span className="flex items-center gap-1.5 flex-wrap">
                  <Shield className="w-4.5 h-4.5 text-rose-500" />
                  Academic Moderator • Department of CSE
                </span>
              )}
            </p>
          </div>

          {/* Verification Status Warning Banner */}
          {user.role === 'ALUMNI' && !user.isVerified && (isOwner || currentUser?.role === 'FACULTY') && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Pending Verification</h5>
                <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed mt-1">
                  This Alumnus account is waiting for review from college faculty members. Verified badges, student mentorship flags, and job creation will unlock once approved.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Tabs navigation */}
      <div className="mt-6 flex border-b border-[var(--border-color)]">
        {(['about', 'achievements', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors duration-150 ${
              activeTab === tab 
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-extrabold' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        
        {/* 1. About Panel */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Bio Column */}
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                <h4 className="font-bold text-sm text-[var(--text-primary)] mb-3">About Summary</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {profile?.bio || 'No career summary provided yet.'}
                </p>
              </div>

              {/* Skills Card */}
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                <h4 className="font-bold text-sm text-[var(--text-primary)] mb-4">Core Skills</h4>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">No skills listed yet.</p>
                )}
              </div>
            </div>

            {/* Sidebar Stats Column */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                <h4 className="font-bold text-sm text-[var(--text-primary)] mb-4">Education & Career</h4>
                <div className="flex flex-col gap-4 text-xs text-[var(--text-secondary)]">
                  <div className="flex gap-3">
                    <Building className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <span className="font-bold block text-[var(--text-primary)]">Department</span>
                      <span className="mt-0.5 block">{profile?.department || 'CSE Department'}</span>
                    </div>
                  </div>
                  {user.role === 'ALUMNI' && profile?.company && (
                    <div className="flex gap-3">
                      <Briefcase className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold block text-[var(--text-primary)]">Employment</span>
                        <span className="mt-0.5 block font-semibold text-[var(--text-primary)]">
                          {profile.jobTitle} at {profile.company}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <GraduationCap className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <span className="font-bold block text-[var(--text-primary)]">Graduation</span>
                      <span className="mt-0.5 block">
                        {user.role === 'STUDENT' ? 'Expected' : 'Completed'} {profile?.graduationYear || '2027'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. Achievements Panel */}
        {activeTab === 'achievements' && (
          <div className="max-w-2xl flex flex-col gap-4">
            {achievementPosts.length > 0 ? (
              achievementPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onPostUpdated={loadProfileData} 
                />
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-12 text-center">
                <Award className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                <h4 className="font-bold text-sm text-[var(--text-primary)]">No Achievements Shared</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto leading-relaxed">
                  Posts categorized as &apos;Achievement 🎉&apos; will automatically appear as verified milestones here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. Activity Panel */}
        {activeTab === 'activity' && (
          <div className="max-w-2xl flex flex-col gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onPostUpdated={loadProfileData} 
                />
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-12 text-center">
                <p className="text-sm text-[var(--text-secondary)] italic">
                  This user hasn&apos;t posted anything yet.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shadow-xl animate-fade-in">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-base text-[var(--text-primary)]">Edit Profile Details</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              
              {/* Bio Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Career Summary / Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                  placeholder="Tell the community about your work, research, or career aspirations..."
                />
              </div>

              {/* Department */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Academic Department
                </label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="e.g. Computer Science & Engineering (CSE)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Graduation Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={editGraduationYear}
                    onChange={(e) => setEditGraduationYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    placeholder="e.g. 2027"
                  />
                </div>

                {/* Job Title / company (for Alumni only) */}
                {user.role === 'ALUMNI' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Current Job Title
                    </label>
                    <input
                      type="text"
                      value={editJobTitle}
                      onChange={(e) => setEditJobTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                      placeholder="e.g. Software Engineer II"
                    />
                  </div>
                )}
              </div>

              {/* Company (for Alumni only) */}
              {user.role === 'ALUMNI' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Current Company / Employer
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    placeholder="e.g. Google"
                  />
                </div>
              )}

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="React, Next.js, Node.js, C++"
                />
              </div>

              {/* Form Actions Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-[var(--border-color)] pt-5 mt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-interactive px-4 py-2 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-interactive px-5 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
