'use client';

import React, { useState, useRef } from 'react';
import { mockStore } from '@/lib/mock-store';
import { Image as ImageIcon, Send, Sparkles, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostCreatorProps {
  onPostCreated: () => void;
}

const CATEGORIES = [
  'General 💬',
  'Achievement 🎉',
  'Project Update 🚀',
  'Work Opportunity 💼',
  'College Event 🏫'
];

export default function PostCreator({ onPostCreated }: PostCreatorProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = mockStore.getCurrentUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageUrl(previewUrl);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    try {
      mockStore.createPost(currentUser.id, content, category, imageUrl);
      
      // If it is an achievement, trigger a beautiful confetti burst!
      if (category.includes('Achievement')) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Reset Form
      setContent('');
      setCategory(CATEGORIES[0]);
      clearImage();
      setError('');
      
      // Callback to refresh feed
      onPostCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create post.');
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm hover:shadow-md transition-shadow">
      <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
        
        {/* Input area */}
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-extrabold shadow-inner flex-shrink-0 uppercase">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-grow">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an achievement, project update, or ask a question..."
              rows={3}
              className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none py-1.5"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Local Image Preview */}
        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] max-h-60 bg-[var(--bg-tertiary)] flex items-center justify-center">
            <img 
              src={imagePreview} 
              alt="Attachment preview" 
              className="object-contain max-h-60 w-full"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <hr className="border-[var(--border-color)]" />

        {/* Footer controls: Attachment, category select, post button */}
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            {/* Attachment input */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Add Image</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Category dropdown */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-[var(--text-primary)]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-interactive flex items-center gap-1.5 px-4  py-2 rounded-xl text-xs font-bold bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white shadow-md shadow-indigo-500/10"
          >
            <span>Post</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
