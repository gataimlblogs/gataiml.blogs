'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockStore, Post, Comment, Role } from '@/lib/mock-store';
import { getRelativeTimeIST } from '@/lib/time';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  Shield, 
  Send,
  ExternalLink
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onPostUpdated: () => void;
}

export default function PostCard({ post, onPostUpdated }: PostCardProps) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUser = mockStore.getCurrentUser();
  const isLiked = post.likes.includes(currentUser.id);

  const handleLike = () => {
    mockStore.toggleLikePost(post.id, currentUser.id);
    onPostUpdated();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    mockStore.addCommentToPost(post.id, currentUser.id, commentText);
    setCommentText('');
    onPostUpdated();
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/profile/${post.userUsername}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderRoleBadge = (role: Role, isVerified: boolean) => {
    if (role === 'STUDENT') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          Student
        </span>
      );
    }
    if (role === 'ALUMNI') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
          {isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
          Alumni
        </span>
      );
    }
    if (role === 'FACULTY') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
          <Shield className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Faculty
        </span>
      );
    }
    return null;
  };

  // Helper to parse content links & formatting
  const renderFormattedContent = (text: string) => {
    // Escape standard HTML tags
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Parse URL links: [Text](URL) or plain http/https URLs
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    escaped = escaped.replace(markdownLinkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--accent-primary)] font-semibold hover:underline flex-inline items-center gap-0.5">$1</a>');

    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    // Only wrap as link if it wasn't already wrapped by the markdown syntax
    escaped = escaped.replace(urlRegex, (url) => {
      if (url.includes('class="text-[var(--accent-primary)]')) return url;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[var(--accent-primary)] hover:underline">${url}</a>`;
    });

    // Replace linebreaks with <br/>
    const lines = escaped.split('\n').join('<br />');

    return <div dangerouslySetInnerHTML={{ __html: lines }} />;
  };

  const isLongPost = post.content.length > 280;
  const displayContent = isLongPost && !isExpanded 
    ? post.content.substring(0, 260) + '...' 
    : post.content;

  // Set color for post tags
  const getTagStyle = (tag: string) => {
    if (tag.includes('Achievement')) {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
    }
    if (tag.includes('Project')) {
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950/25 dark:text-purple-400 border-purple-200 dark:border-purple-900/40';
    }
    if (tag.includes('Opportunity')) {
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/25 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40';
    }
    if (tag.includes('Event')) {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
    }
    return 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200 dark:border-slate-700/50';
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      
      {/* Header section: User Info */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.userUsername}`} className="btn-interactive block">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold uppercase text-sm shadow-inner">
              {post.userName.charAt(0)}
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${post.userUsername}`} className="hover:underline">
                <h4 className="font-bold text-sm text-[var(--text-primary)] leading-tight">{post.userName}</h4>
              </Link>
              {renderRoleBadge(post.userRole, post.isVerifiedUser)}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">@{post.userUsername}</p>
          </div>
        </div>

        {/* IST Timestamp display */}
        <span className="text-xs text-[var(--text-muted)] font-medium">
          {getRelativeTimeIST(post.createdAt)}
        </span>
      </div>

      {/* Category Tag */}
      <div className="mt-3.5 flex">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTagStyle(post.tag)}`}>
          {post.tag}
        </span>
      </div>

      {/* Main content body */}
      <div className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
        {renderFormattedContent(displayContent)}
        {isLongPost && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] mt-2 hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Image attachment */}
      {post.imageUrl && (
        <div className="mt-4 rounded-xl overflow-hidden border border-[var(--border-color)] max-h-96 bg-[var(--bg-tertiary)] flex items-center justify-center">
          <img 
            src={post.imageUrl} 
            alt="Post attachment" 
            className="object-cover max-h-96 w-full"
          />
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold border-b border-[var(--border-color)] pb-2.5">
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        <button onClick={() => setShowComments(!showComments)} className="hover:underline">
          {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      {/* Post Actions Row */}
      <div className="mt-2.5 flex items-center justify-between text-[var(--text-secondary)]">
        
        {/* Like action */}
        <button
          onClick={handleLike}
          className={`btn-interactive flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isLiked 
              ? 'text-[var(--accent-primary)] bg-[var(--accent-light)]' 
              : 'hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          Like
        </button>

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`btn-interactive flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all ${
            showComments ? 'text-[var(--text-primary)] bg-[var(--bg-tertiary)]' : ''
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Comment
        </button>

        {/* Share action */}
        <button
          onClick={handleShare}
          className="btn-interactive flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all relative"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Expanded Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-col gap-4 animate-fade-in">
          
          {/* New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] font-bold text-xs uppercase flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-grow relative flex items-center">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full pl-3 pr-10 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* List of comments */}
          {post.comments.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
              {post.comments.map((comm) => (
                <div key={comm.id} className="flex gap-2.5 items-start bg-[var(--bg-tertiary)]/50 p-2.5 rounded-xl border border-[var(--border-color)]/30">
                  <Link href={`/profile/${comm.userUsername}`} className="flex-shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] font-extrabold text-[10px] uppercase">
                      {comm.userName.charAt(0)}
                    </div>
                  </Link>
                  <div className="flex-grow">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link href={`/profile/${comm.userUsername}`} className="hover:underline">
                        <span className="text-xs font-bold text-[var(--text-primary)]">{comm.userName}</span>
                      </Link>
                      <span className="text-[9px] text-[var(--text-muted)] font-medium">@{comm.userUsername}</span>
                      {renderRoleBadge(comm.userRole, false)}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-normal">{comm.text}</p>
                    <span className="text-[9px] text-[var(--text-muted)] block mt-1">
                      {getRelativeTimeIST(comm.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)] italic text-center py-2">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
