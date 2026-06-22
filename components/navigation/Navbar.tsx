'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../ui/ThemeProvider';
import { mockStore, User } from '@/lib/mock-store';
import { 
  Sun, 
  Moon, 
  Home, 
  Briefcase, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Shield, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load current user and list of available users for switcher
    setCurrentUser(mockStore.getCurrentUser());
    setUsers(mockStore.getUsers());

    // Listen for storage events (user changes)
    const handleStorageChange = () => {
      setCurrentUser(mockStore.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    mockStore.setCurrentUser(selectedId);
    window.location.reload();
  };

  if (!currentUser) return null;

  // Render role badge based on specification
  const renderRoleBadge = (user: User, showIcon = true) => {
    if (user.role === 'STUDENT') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
          Student
        </span>
      );
    }
    if (user.role === 'ALUMNI') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
          {showIcon && user.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
          Alumnus
        </span>
      );
    }
    if (user.role === 'FACULTY') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
          {showIcon && <Shield className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
          Faculty
        </span>
      );
    }
    return null;
  };

  const navLinks = [
    { href: '/', label: 'Feed', icon: Home },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/directory', label: 'Directory', icon: Users },
  ];

  // Faculty Only dashboard link
  if (currentUser.role === 'FACULTY') {
    navLinks.push({ href: '/faculty', label: 'Faculty Board', icon: ShieldAlert });
  }

  return (
    <>
      {/* Top Navbar for Desktop */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                A
              </div>
              <span className="hidden sm:inline-block font-extrabold text-xl tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                AlumniConnect
              </span>
            </Link>
            
            {/* Demo User Switcher (floating indicator) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
              <UserCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="hidden md:inline">Acting as:</span>
              <select 
                value={currentUser.id} 
                onChange={handleUserChange}
                className="bg-transparent font-semibold text-[var(--text-primary)] outline-none border-none cursor-pointer focus:ring-0"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {u.name} ({u.role.toLowerCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[var(--accent-light)] text-[var(--accent-primary)] font-semibold' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Menu: Theme toggle, user badge, profile link */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-interactive p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Info & Badging (Desktop) */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[var(--border-color)]">
              <div className="text-right">
                <Link href={`/profile/${currentUser.username}`} className="hover:underline">
                  <div className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">{currentUser.name}</div>
                </Link>
                <div className="flex justify-end mt-0.5">{renderRoleBadge(currentUser)}</div>
              </div>
              <Link href={`/profile/${currentUser.username}`} className="btn-interactive block">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
                  {currentUser.name.charAt(0)}
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (visible on medium screens and down) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-[var(--bg-primary)] pt-20 px-4 animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive 
                      ? 'bg-[var(--accent-light)] text-[var(--accent-primary)] font-bold' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            
            {/* Profile redirect */}
            <Link
              href={`/profile/${currentUser.username}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                {currentUser.name.charAt(0)}
              </div>
              Profile Details ({currentUser.username})
            </Link>
          </nav>
        </div>
      )}

      {/* Bottom Navigation for Mobile (Sticky footer specified in frontend.md) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--bg-secondary)]/90 backdrop-blur-md border-t border-[var(--border-color)] px-6 py-2 transition-colors duration-300">
        <div className="flex justify-around items-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
                  isActive 
                    ? 'text-[var(--accent-primary)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
          <Link
            href={`/profile/${currentUser.username}`}
            className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
              pathname.includes('/profile/') 
                ? 'text-[var(--accent-primary)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[var(--text-muted)] flex items-center justify-center text-white text-[9px] font-bold uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
}
