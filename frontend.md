# Frontend Design & Interface Documentation

This document outlines the user interface (UI), client-side architecture, styling standards, and page structures for the **Alumni-Student Connect Platform**. 

The design is built on Next.js 14+ (App Router) and leverages **modern CSS custom properties (variables)** to create a clean, premium, and minimal interface that supports fluid light/dark mode transitions and micro-animations.

---

## 🎨 Theme & Color System

The platform uses a neutral slate/gray aesthetic with deep indigo accents to deliver a professional, minimal, and premium layout reminiscent of a high-end SaaS product.

### CSS Theme Variables

Put these variables in your global CSS file (e.g., `styles/globals.css`). The application switches themes by applying a `data-theme="dark"` attribute on the `<html>` element.

```css
/* ==========================================================================
   Modern CSS Theme Variable definitions (globals.css)
   ========================================================================== */

:root {
  /* Light Mode Palette */
  --bg-primary: #f8fafc;       /* Slate 50 */
  --bg-secondary: #ffffff;     /* Pure White */
  --bg-tertiary: #f1f5f9;      /* Slate 100 */
  
  --text-primary: #0f172a;     /* Slate 900 */
  --text-secondary: #475569;   /* Slate 600 */
  --text-muted: #94a3b8;       /* Slate 400 */
  
  --accent-primary: #4f46e5;   /* Indigo 600 */
  --accent-hover: #4338ca;     /* Indigo 700 */
  --accent-light: #e0e7ff;     /* Indigo 100 */
  
  --border-color: #e2e8f0;     /* Slate 200 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  --transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme='dark'] {
  /* Dark Mode Palette */
  --bg-primary: #090d16;       /* Deep Slate Black */
  --bg-secondary: #111827;     /* Dark Slate 900 */
  --bg-tertiary: #1f2937;      /* Slate 800 */
  
  --text-primary: #f9fafb;     /* Slate 50 */
  --text-secondary: #d1d5db;   /* Slate 300 */
  --text-muted: #6b7280;       /* Slate 500 */
  
  --accent-primary: #6366f1;   /* Indigo 500 */
  --accent-hover: #4f46e5;     /* Indigo 600 */
  --accent-light: #1e1b4b;     /* Indigo 950 */
  
  --border-color: #374151;     /* Slate 700 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
}
```

### Micro-Animations & Interactivity

To make the platform feel alive and responsive, use clean transitions on hoverable elements:

```css
.card-hover {
  transition: var(--transition-smooth);
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-primary);
}

.btn-interactive {
  transition: var(--transition-smooth);
}
.btn-interactive:active {
  transform: scale(0.97);
}
```

---

## 🚦 Navigation & Page Routes

The routing is structured using Next.js **App Router**. Dynamic user profiles are mapped to their unique usernames.

| Route | View Type | Description |
| :--- | :--- | :--- |
| `/login` | Public | Authentication page for login |
| `/register` | Public | Role-based sign-up screen |
| `/` | Protected | Feed showing posts, updates, achievements, and jobs |
| `/profile/[username]` | Protected | Dynamic user profile page using their **unique username** |
| `/jobs` | Protected | Job Board (listing/search & creation panel for alumni/faculty) |
| `/directory` | Protected | Faculty/Alumni/Student directory with query filters |
| `/faculty` | Protected (Admin) | Dashboard for approving new Alumni, verifying accounts, and moderation |

---

## 🧩 Component Specifications

### 1. Global Navigation (`Navbar` & `Sidebar`)
*   **Theme Toggle**: Toggle switch changing standard DOM settings (`document.documentElement.setAttribute('data-theme', 'dark/light')`).
*   **Role Badges**: Distinct visual labels identifying logged-in users:
    *   `Student`: Emerald green badge.
    *   `Alumnus`: Indigo blue badge with a verified checkmark (if validated).
    *   `Faculty`: Crimson red badge with an institutional shield icon.
*   **Responsive Menu**: Desktop top navigation, condensing into a bottom-anchored navbar on mobile.

### 2. Main Post Feed (`PostCreator` & `PostCard`)
*   **PostCreator**:
    *   Rich text field supporting basic Markdown or inline links.
    *   A categorization dropdown (e.g., `Achievement 🎉`, `Project Update 🚀`, `Work Opportunity 💼`, `College Event 🏫`).
    *   Image/file attachment capability.
*   **PostCard**:
    *   Displays user information (avatar, name, unique `@username`, and role badge).
    *   Chronological timestamp formatted strictly to **Indian Standard Time (IST)**.
    *   Content area with collapsible text for longer writeups.
    *   Interactive items: Like button, comment thread, share link.

### 3. Job Board (`JobBoard` & `JobCard`)
*   **JobFilter**: Sidebar selectors to filter by Job Type (`Full-time`, `Internship`), Mode (`On-site`, `Remote`, `Hybrid`), and Location.
*   **JobCard**:
    *   Displays job title, company logo placeholder, and salary range.
    *   Visual representation showing who posted the job (Alumni/Faculty profile link).
    *   "Apply" modal or external redirect.

### 4. Dynamic Profiles (`ProfileHeader` & `ProfileTabs`)
*   **ProfileHeader**:
    *   Large cover image and profile avatar.
    *   User display name and `@username` tagline.
    *   Verification status indicator:
        *   *Pending Verification* (visible to owner/faculty): Warning banner.
        *   *Verified Alumnus*: Verification shield badge.
*   **ProfileTabs**:
    *   *About*: Career description, skills, and industry sector.
    *   *Achievements*: Filtered timeline showing the student/alumnus's specific posts.
    *   *Activity*: Standard history of all actions, posts, and comments.

---

## 🇮🇳 Time Handling & IST Formatting on Frontend

All timestamps must be formatted using Indian Standard Time (IST, GMT+5:30). Use the native browser `Intl` API to enforce the timezone configuration on client machines.

### Formatting Utility (`lib/time.ts`)

Create a helper function to output all timestamps uniformly:

```typescript
/**
 * Utility to format Date objects or ISO strings into readable IST strings.
 */
export function formatToIST(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  
  // Format options matching standard Indian conventions
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

/**
 * Returns a relative time display (e.g., "3 hours ago") mapped correctly to IST timezone.
 */
export function getRelativeTimeIST(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'Yesterday';
  
  return formatToIST(date);
}
```

### Component Integration Example
Use the relative time helper in the UI components like this:

```tsx
import { getRelativeTimeIST } from '@/lib/time';

interface PostHeaderProps {
  name: string;
  username: string;
  createdAt: string; // ISO String from Backend
}

export function PostHeader({ name, username, createdAt }: PostHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">{name}</h4>
        <p className="text-xs text-[var(--text-muted)]">@{username}</p>
      </div>
      <span className="text-xs text-[var(--text-muted)]">
        {getRelativeTimeIST(createdAt)}
      </span>
    </div>
  );
}
```
