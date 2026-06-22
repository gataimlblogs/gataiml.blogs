# Backend & Database Architecture Documentation

This document describes the server-side architecture, database schemas, authorization model, and time zone policies for the **Alumni-Student Connect Platform**.

The backend logic is implemented using **Next.js Server Actions** and **API Routes (Route Handlers)**, deploying on **Vercel** and persisting to **Vercel Postgres** database using the Prisma ORM.

---

## 🔐 Authentication & Session Management (Vercel Auth)

Authentication is handled natively by **Vercel Auth** (powered by Auth.js / NextAuth.js v5). It uses password-based login for simplicity and stores JWT credentials.

### JWT & Session Extension
To support custom dynamic routing and Role-Based Access Control (RBAC), the unique `@username` and user `role` are embedded in the Auth session payload.

#### Configuration (`auth.ts`)
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
});
```

---

## 🗄️ Database Schema (Prisma ORM)

The database schema is managed via Prisma and run on a managed **Vercel Postgres** instance. The `User` model enforces a unique and indexed `username` constraint.

```prisma
// ==========================================================================
// Prisma Schema Definition (prisma/schema.prisma)
// ==========================================================================

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL") // uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  ALUMNI
  FACULTY
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  username     String    @unique // Unique username index for routing
  passwordHash String
  name         String
  role         Role      @default(STUDENT)
  isVerified   Boolean   @default(false) // Used to track Alumni verification status
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  profile      Profile?
  posts        Post[]
  jobs         Job[]     @relation("JobCreator")
  applications JobApplication[]
  verificationsSubmitted AlumniVerificationRequest[] @relation("AlumniUser")
  verificationsReviewed  AlumniVerificationRequest[] @relation("FacultyReviewer")
}

model Profile {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  bio            String?
  graduationYear Int?
  department     String?  // CSE, ECE, ME, etc.
  company        String?  // Current organization (Alumni specific)
  jobTitle       String?  // Current title (Alumni specific)
  skills         String[]
  achievements   String[] // List of achievements / certifications
}

model Post {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String
  tag       String?  // "Achievement", "JobOpportunity", "General"
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Job {
  id           String           @id @default(uuid())
  creatorId    String
  creator      User             @relation("JobCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  title        String
  company      String
  description  String
  requirements String
  location     String
  salaryRange  String?
  jobType      String           // "Full-time", "Internship"
  workMode     String           // "Remote", "On-site", "Hybrid"
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  applications JobApplication[]
}

model JobApplication {
  id        String   @id @default(uuid())
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  studentId String
  student   User     @relation(fields: [studentId], references: [id], onDelete: Cascade)
  resumeUrl String?
  coverLetter String?
  createdAt DateTime @default(now())
}

model AlumniVerificationRequest {
  id         String             @id @default(uuid())
  alumniId   String
  alumni     User               @relation("AlumniUser", fields: [alumniId], references: [id], onDelete: Cascade)
  facultyId  String?            // Nullable until a faculty claims the request
  faculty    User?              @relation("FacultyReviewer", fields: [facultyId], references: [id])
  status     VerificationStatus @default(PENDING)
  notes      String?
  createdAt  DateTime           @default(now())
  updatedAt  DateTime           @updatedAt
}
```

---

## 🇮🇳 Time Zone Standard (IST - Asia/Kolkata)

To maintain synchronization across students, alumni, and faculty, the application strictly adheres to **Indian Standard Time (IST)**.

### Timezone Guidelines:
1.  **Storage**: Vercel Postgres stores all timestamps in **UTC** (as is standard SQL best practice).
2.  **Server Engine**: The Vercel Serverless environment operates in UTC. To avoid timezone discrepancies when writing queries involving day-boundaries (e.g., "retrieve all job openings posted today in IST"), query times must be generated in the server action and normalized by offsetting to **Asia/Kolkata**.
3.  **Client Rendering**: The clients format UTC ISO strings locally to `Asia/Kolkata` using formatting methods outlined in `frontend.md`.

### Server Timezone Correction Utility (`lib/time-server.ts`)

```typescript
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns the current date/time adjusted to IST timezone.
 */
export function getCurrentISTDate(): Date {
  const utcNow = new Date();
  return utcToZonedTime(utcNow, IST_TIMEZONE);
}

/**
 * Generates starting and ending UTC Date bounds for a specific calendar date in IST.
 * Useful for querying database items created on a specific Indian date.
 */
export function getISTDayRangeBounds(istDateString: string): { startUtc: Date; endUtc: Date } {
  // istDateString format: "YYYY-MM-DD"
  const startOfDayIST = `${istDateString}T00:00:00`;
  const endOfDayIST = `${istDateString}T23:59:59.999`;

  const startUtc = zonedTimeToUtc(startOfDayIST, IST_TIMEZONE);
  const endUtc = zonedTimeToUtc(endOfDayIST, IST_TIMEZONE);

  return { startUtc, endUtc };
}
```

---

## ⚡ Server Actions & API Design

Next.js Server Actions are preferred for data mutations to keep API routes minimal.

### 1. Username Validation Action (`/actions/auth.ts`)
Ensures that no two users register with the same username. Usernames are automatically lowercased prior to insertion.

```typescript
"use server";

import { db } from "@/lib/db";

/**
 * Validates if a custom username is unique and conforms to formatting rules.
 */
export async function isUsernameAvailable(usernameInput: string): Promise<boolean> {
  const sanitizedUsername = usernameInput.trim().toLowerCase();
  
  // Format check: alphanumeric, underscores, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(sanitizedUsername)) {
    return false;
  }

  const existingUser = await db.user.findUnique({
    where: { username: sanitizedUsername }
  });

  return existingUser === null;
}
```

### 2. Job Creation Action (`/actions/jobs.ts`)
Restricts job creation to validated `ALUMNI` or `FACULTY` accounts.

```typescript
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createJobAction(formData: {
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange?: string;
  jobType: string;
  workMode: string;
}) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const role = session.user.role;
  if (role !== "ALUMNI" && role !== "FACULTY") {
    throw new Error("Only Alumni and Faculty can post jobs.");
  }

  // If Alumnus is posting, verify they have been approved by Faculty
  if (role === "ALUMNI") {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.isVerified) {
      throw new Error("Your Alumni status must be approved by faculty to post jobs.");
    }
  }

  const newJob = await db.job.create({
    data: {
      creatorId: session.user.id,
      title: formData.title,
      company: formData.company,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      salaryRange: formData.salaryRange,
      jobType: formData.jobType,
      workMode: formData.workMode,
    }
  });

  revalidatePath("/jobs");
  return newJob;
}
```
