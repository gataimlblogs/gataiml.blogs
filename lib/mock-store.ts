export type Role = 'STUDENT' | 'ALUMNI' | 'FACULTY';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  graduationYear?: number;
  department?: string;
  company?: string;
  jobTitle?: string;
  skills: string[];
  achievements: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userRole: Role;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userRole: Role;
  isVerifiedUser: boolean;
  content: string;
  tag: string; // "Achievement 🎉" | "Project Update 🚀" | "Work Opportunity 💼" | "College Event 🏫" | "General 💬"
  imageUrl?: string;
  likes: string[]; // array of userIds
  comments: Comment[];
  createdAt: string;
}

export interface Job {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorRole: Role;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange?: string;
  jobType: 'Full-time' | 'Internship';
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  createdAt: string;
  applicants: string[]; // array of studentIds
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
}

export interface AlumniVerificationRequest {
  id: string;
  alumniId: string;
  alumniName: string;
  alumniUsername: string;
  alumniEmail: string;
  facultyId?: string;
  facultyName?: string;
  status: VerificationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================================================
// Seeding Mock Data
// ==========================================================================

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    email: 'bhuvan@college.edu',
    username: 'bhuvan_student',
    name: 'Bhuvan Prasanna',
    role: 'STUDENT',
    isVerified: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u2',
    email: 'riya.sen@google.com',
    username: 'riya_alumni',
    name: 'Riya Sen',
    role: 'ALUMNI',
    isVerified: true,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u3',
    email: 'dr.sharma@college.edu',
    username: 'dr_sharma_faculty',
    name: 'Dr. Ramesh Sharma',
    role: 'FACULTY',
    isVerified: true,
    createdAt: new Date(Date.now() - 1000 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u4',
    email: 'amit.kumar@microsoft.com',
    username: 'amit_alumni',
    name: 'Amit Kumar',
    role: 'ALUMNI',
    isVerified: false, // Pending verification
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p1',
    userId: 'u1',
    bio: 'Pre-final year B.Tech Computer Science student. Building open source projects and looking for Summer 2027 Software Engineering internships. 💻',
    graduationYear: 2027,
    department: 'Computer Science & Engineering (CSE)',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'PostgreSQL'],
    achievements: ['Won 1st prize at College Smart India Hackathon internal round', 'LeetCode 500+ problems solved'],
  },
  {
    id: 'p2',
    userId: 'u2',
    bio: 'Software Engineer II at Google Cloud. Working on scalable microservices. Passionate about mentoring college juniors and helping them kickstart their tech careers. ☁️🚀',
    graduationYear: 2024,
    department: 'Computer Science & Engineering (CSE)',
    company: 'Google',
    jobTitle: 'Software Engineer II',
    skills: ['Golang', 'Kubernetes', 'Docker', 'System Design', 'GCP', 'Java'],
    achievements: ['Google Cloud Certified Architect', 'Best Outgoing Student Award 2024'],
  },
  {
    id: 'p3',
    userId: 'u3',
    bio: 'Professor & Head of Department of CSE. Researching in Machine Learning and Natural Language Processing. Coordinating placement and alumni activities. 🎓📚',
    skills: ['Machine Learning', 'NLP', 'Academic Research', 'Technical Writing'],
    achievements: ['Published 30+ IEEE Research Papers', 'AI Research Grant recipient from DST India'],
  },
  {
    id: 'p4',
    userId: 'u4',
    bio: 'Recent graduate working at Microsoft. Interested in Cloud Native architectures. Looking to verify my alumni profile. 🏢',
    graduationYear: 2025,
    department: 'Electronics & Communication Engineering (ECE)',
    company: 'Microsoft',
    jobTitle: 'Software Engineer I',
    skills: ['C++', 'Azure', 'Python', 'Docker'],
    achievements: ['Microsoft Certified: Azure Developer Associate'],
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post1',
    userId: 'u2',
    userName: 'Riya Sen',
    userUsername: 'riya_alumni',
    userRole: 'ALUMNI',
    isVerifiedUser: true,
    content: `Thrilled to share that I have been promoted to Software Engineer II at Google Cloud! 🎉 

It's been an incredible journey since graduating in 2024. A huge shoutout to Dr. Ramesh Sharma and all my college professors who guided me during my major projects. 

If any student is preparing for interviews or needs guidance on cloud engineering, feel free to drop a message! 🚀`,
    tag: 'Achievement 🎉',
    likes: ['u1', 'u3'],
    comments: [
      {
        id: 'c1',
        userId: 'u3',
        userName: 'Dr. Ramesh Sharma',
        userUsername: 'dr_sharma_faculty',
        userRole: 'FACULTY',
        text: 'Congratulations Riya! We are extremely proud of your achievements and glad to see you giving back to the community. Keep it up!',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c2',
        userId: 'u1',
        userName: 'Bhuvan Prasanna',
        userUsername: 'bhuvan_student',
        userRole: 'STUDENT',
        text: 'Congratulations maam! Would love to connect and learn about your preparation strategy.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post2',
    userId: 'u1',
    userName: 'Bhuvan Prasanna',
    userUsername: 'bhuvan_student',
    userRole: 'STUDENT',
    isVerifiedUser: false,
    content: `Just deployed my first Next.js 14 Web App in the browser! 💻✨

It features standard light/dark mode transitions, CSS variables, and uses localStorage to persist data. Building this was an awesome learning experience on Next.js App Router and clean UI/UX conventions. 

Check out the screen preview below and let me know your thoughts!`,
    tag: 'Project Update 🚀',
    likes: ['u2'],
    comments: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post3',
    userId: 'u3',
    userName: 'Dr. Ramesh Sharma',
    userUsername: 'dr_sharma_faculty',
    userRole: 'FACULTY',
    isVerifiedUser: true,
    content: `Reminder: The College Placement Cell is hosting an interactive session on 'Cracking FAANG Internships' with our alumni next Saturday at 10 AM IST. 

Location: Seminar Hall 2. 

Speakers include software engineers from Google, Amazon, and Microsoft. Attendance is mandatory for pre-final year students. See you all there! 🏫🎓`,
    tag: 'College Event 🏫',
    likes: ['u1', 'u2', 'u4'],
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    creatorId: 'u2',
    creatorName: 'Riya Sen',
    creatorUsername: 'riya_alumni',
    creatorRole: 'ALUMNI',
    title: 'Software Engineering Intern (Summer 2027)',
    company: 'Google',
    description: `We are looking for motivated Software Engineering Interns to join our Cloud teams in Bangalore. You will work on real-world projects, write production code, and collaborate with experienced engineers.

Qualifications:
- Currently pursuing a B.Tech/M.Tech in Computer Science or related fields.
- Graduation year: 2027 (Pre-final year).
- Strong understanding of Data Structures, Algorithms, and Software Engineering principles.`,
    requirements: 'Golang, Java or C++, Basic SQL, Algorithms and Data Structures',
    location: 'Bangalore, India (Hybrid)',
    salaryRange: '₹1,00,000 / month',
    jobType: 'Internship',
    workMode: 'Hybrid',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: ['u1']
  },
  {
    id: 'j2',
    creatorId: 'u3',
    creatorName: 'Dr. Ramesh Sharma',
    creatorUsername: 'dr_sharma_faculty',
    creatorRole: 'FACULTY',
    title: 'Full Stack Web Developer (Alumni Portal Project)',
    company: 'College R&D Center',
    description: `We are building a robust communication system for college departments and need a Student Developer to lead the front-end and back-end integration. 

This is a paid research project under the college R&D Center.

Qualifications:
- Proficient in Next.js, React, Node.js, and Prisma/PostgreSQL.
- Available for 6 months (Part-time).`,
    requirements: 'Next.js 14, React 18, TailwindCSS, REST APIs, Prisma ORM',
    location: 'College Campus (On-site)',
    salaryRange: '₹20,000 / month',
    jobType: 'Internship',
    workMode: 'On-site',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: []
  }
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'a1',
    jobId: 'j1',
    studentId: 'u1',
    studentName: 'Bhuvan Prasanna',
    studentUsername: 'bhuvan_student',
    coverLetter: 'Hello Riya, I am a CSE student with strong React/Next.js skills. I would love to intern at Google and contribute to the Cloud teams. Thank you!',
    resumeUrl: 'bhuvan_resume.pdf',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_VERIFICATIONS: AlumniVerificationRequest[] = [
  {
    id: 'v1',
    alumniId: 'u4',
    alumniName: 'Amit Kumar',
    alumniUsername: 'amit_alumni',
    alumniEmail: 'amit.kumar@microsoft.com',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ==========================================================================
// LocalStorage Store Logic (Client-only safe)
// ==========================================================================

const isBrowser = typeof window !== 'undefined';

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage`, error);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key ${key} to localStorage`, error);
  }
}

// Initialize store if empty
export function initializeStore() {
  if (!isBrowser) return;
  if (!localStorage.getItem('alumni_users')) {
    setStorageItem('alumni_users', INITIAL_USERS);
  }
  if (!localStorage.getItem('alumni_profiles')) {
    setStorageItem('alumni_profiles', INITIAL_PROFILES);
  }
  if (!localStorage.getItem('alumni_posts')) {
    setStorageItem('alumni_posts', INITIAL_POSTS);
  }
  if (!localStorage.getItem('alumni_jobs')) {
    setStorageItem('alumni_jobs', INITIAL_JOBS);
  }
  if (!localStorage.getItem('alumni_applications')) {
    setStorageItem('alumni_applications', INITIAL_APPLICATIONS);
  }
  if (!localStorage.getItem('alumni_verifications')) {
    setStorageItem('alumni_verifications', INITIAL_VERIFICATIONS);
  }
  if (!localStorage.getItem('alumni_current_user_id')) {
    localStorage.setItem('alumni_current_user_id', 'u1'); // Default to Student (Bhuvan)
  }
}

// Call it immediately if on browser and local presets enabled.
// This ensures seed/mock data is NOT automatically used when deployed to GitHub/Vercel.
if (isBrowser && process.env.NEXT_PUBLIC_LOCAL_PRESETS === "true") {
  initializeStore();
}


// ==========================================================================
// Store Operations
// ==========================================================================

export const mockStore = {
  // Users
  getUsers: (): User[] => getStorageItem('alumni_users', INITIAL_USERS),

  getUserById: (id: string): User | undefined => {
    const users = mockStore.getUsers();
    return users.find(u => u.id === id);
  },

  getUserByUsername: (username: string): User | undefined => {
    const users = mockStore.getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  getCurrentUser: (): User => {
    const userId = isBrowser ? localStorage.getItem('alumni_current_user_id') || 'u1' : 'u1';
    const users = mockStore.getUsers();
    return users.find(u => u.id === userId) || users[0];
  },

  setCurrentUser: (userId: string) => {
    if (isBrowser) {
      localStorage.setItem('alumni_current_user_id', userId);
      // Dispatch event to notify layout/navbar
      window.dispatchEvent(new Event('storage'));
    }
  },

  createUser: (userData: Omit<User, 'id' | 'isVerified' | 'createdAt'>): User => {
    const users = mockStore.getUsers();
    const newUser: User = {
      ...userData,
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      isVerified: userData.role === 'FACULTY', // Faculty is auto-verified, Alumni needs review
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setStorageItem('alumni_users', users);

    // Create corresponding empty profile
    const profiles = mockStore.getProfiles();
    const newProfile: Profile = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      userId: newUser.id,
      skills: [],
      achievements: []
    };
    profiles.push(newProfile);
    setStorageItem('alumni_profiles', profiles);

    // If Alumnus, auto-submit a verification request
    if (newUser.role === 'ALUMNI') {
      mockStore.submitVerificationRequest(newUser.id);
    }

    return newUser;
  },

  // Profiles
  getProfiles: (): Profile[] => getStorageItem('alumni_profiles', INITIAL_PROFILES),

  getProfileByUserId: (userId: string): Profile => {
    const profiles = mockStore.getProfiles();
    let profile = profiles.find(p => p.userId === userId);
    if (!profile) {
      // Lazy init if missing
      profile = {
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        userId,
        skills: [],
        achievements: []
      };
      profiles.push(profile);
      setStorageItem('alumni_profiles', profiles);
    }
    return profile;
  },

  updateProfile: (userId: string, profileData: Partial<Profile>): Profile => {
    const profiles = mockStore.getProfiles();
    const idx = profiles.findIndex(p => p.userId === userId);

    let updatedProfile: Profile;
    if (idx !== -1) {
      updatedProfile = { ...profiles[idx], ...profileData };
      profiles[idx] = updatedProfile;
    } else {
      updatedProfile = {
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        userId,
        skills: [],
        achievements: [],
        ...profileData
      };
      profiles.push(updatedProfile);
    }
    setStorageItem('alumni_profiles', profiles);
    return updatedProfile;
  },

  // Posts
  getPosts: (): Post[] => {
    // Sort posts chronologically (latest first)
    const posts = getStorageItem('alumni_posts', INITIAL_POSTS);
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createPost: (userId: string, content: string, tag: string, imageUrl?: string): Post => {
    const user = mockStore.getUserById(userId);
    if (!user) throw new Error('User not found');

    const posts = getStorageItem('alumni_posts', INITIAL_POSTS);
    const newPost: Post = {
      id: 'post_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      userRole: user.role,
      isVerifiedUser: user.isVerified,
      content,
      tag,
      imageUrl,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    setStorageItem('alumni_posts', posts);
    return newPost;
  },

  toggleLikePost: (postId: string, userId: string): Post => {
    const posts = mockStore.getPosts();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error('Post not found');

    const post = posts[idx];
    const userIdx = post.likes.indexOf(userId);

    if (userIdx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(userIdx, 1);
    }

    setStorageItem('alumni_posts', posts);
    return post;
  },

  addCommentToPost: (postId: string, userId: string, text: string): Comment => {
    const user = mockStore.getUserById(userId);
    if (!user) throw new Error('User not found');

    const posts = mockStore.getPosts();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error('Post not found');

    const newComment: Comment = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      userRole: user.role,
      text,
      createdAt: new Date().toISOString()
    };

    posts[idx].comments.push(newComment);
    setStorageItem('alumni_posts', posts);
    return newComment;
  },

  // Jobs
  getJobs: (): Job[] => {
    const jobs = getStorageItem('alumni_jobs', INITIAL_JOBS);
    return [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createJob: (creatorId: string, jobData: Omit<Job, 'id' | 'creatorId' | 'creatorName' | 'creatorUsername' | 'creatorRole' | 'createdAt' | 'applicants'>): Job => {
    const user = mockStore.getUserById(creatorId);
    if (!user) throw new Error('User not found');
    if (user.role !== 'ALUMNI' && user.role !== 'FACULTY') {
      throw new Error('Only Alumni and Faculty can post jobs.');
    }
    if (user.role === 'ALUMNI' && !user.isVerified) {
      throw new Error('Alumni account must be verified by faculty to post jobs.');
    }

    const jobs = getStorageItem('alumni_jobs', INITIAL_JOBS);
    const newJob: Job = {
      ...jobData,
      id: 'job_' + Math.random().toString(36).substr(2, 9),
      creatorId: user.id,
      creatorName: user.name,
      creatorUsername: user.username,
      creatorRole: user.role,
      createdAt: new Date().toISOString(),
      applicants: []
    };

    jobs.push(newJob);
    setStorageItem('alumni_jobs', jobs);
    return newJob;
  },

  applyToJob: (jobId: string, studentId: string, coverLetter?: string): JobApplication => {
    const student = mockStore.getUserById(studentId);
    if (!student) throw new Error('Student not found');
    if (student.role !== 'STUDENT') throw new Error('Only students can apply to jobs');

    const jobs = mockStore.getJobs();
    const jobIdx = jobs.findIndex(j => j.id === jobId);
    if (jobIdx === -1) throw new Error('Job not found');

    // Add to job applicants list
    if (!jobs[jobIdx].applicants.includes(studentId)) {
      jobs[jobIdx].applicants.push(studentId);
      setStorageItem('alumni_jobs', jobs);
    }

    // Create job application document
    const applications = getStorageItem('alumni_applications', INITIAL_APPLICATIONS);
    const newApp: JobApplication = {
      id: 'app_' + Math.random().toString(36).substr(2, 9),
      jobId,
      studentId,
      studentName: student.name,
      studentUsername: student.username,
      coverLetter,
      resumeUrl: student.username + '_resume.pdf',
      createdAt: new Date().toISOString()
    };
    applications.push(newApp);
    setStorageItem('alumni_applications', applications);

    return newApp;
  },

  getApplicationsByJobId: (jobId: string): JobApplication[] => {
    const applications = getStorageItem('alumni_applications', INITIAL_APPLICATIONS);
    return applications.filter(a => a.jobId === jobId);
  },

  // Verifications
  getVerificationRequests: (): AlumniVerificationRequest[] => {
    return getStorageItem('alumni_verifications', INITIAL_VERIFICATIONS);
  },

  submitVerificationRequest: (alumniId: string): AlumniVerificationRequest => {
    const alumni = mockStore.getUserById(alumniId);
    if (!alumni) throw new Error('Alumni not found');

    const verifications = mockStore.getVerificationRequests();
    const existing = verifications.find(v => v.alumniId === alumniId && v.status === 'PENDING');
    if (existing) return existing;

    const newRequest: AlumniVerificationRequest = {
      id: 'ver_' + Math.random().toString(36).substr(2, 9),
      alumniId,
      alumniName: alumni.name,
      alumniUsername: alumni.username,
      alumniEmail: alumni.email,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    verifications.push(newRequest);
    setStorageItem('alumni_verifications', verifications);
    return newRequest;
  },

  reviewVerificationRequest: (requestId: string, facultyId: string, status: VerificationStatus, notes?: string): AlumniVerificationRequest => {
    const faculty = mockStore.getUserById(facultyId);
    if (!faculty || faculty.role !== 'FACULTY') throw new Error('Only faculty can review requests');

    const verifications = mockStore.getVerificationRequests();
    const idx = verifications.findIndex(v => v.id === requestId);
    if (idx === -1) throw new Error('Verification request not found');

    const request = verifications[idx];
    request.status = status;
    request.facultyId = facultyId;
    request.facultyName = faculty.name;
    request.notes = notes;
    request.updatedAt = new Date().toISOString();

    setStorageItem('alumni_verifications', verifications);

    // Update verified status in User object
    const users = mockStore.getUsers();
    const userIdx = users.findIndex(u => u.id === request.alumniId);
    if (userIdx !== -1) {
      users[userIdx].isVerified = (status === 'APPROVED');
      setStorageItem('alumni_users', users);

      // Update all posts made by this user to reflect verified status
      const posts = getStorageItem('alumni_posts', INITIAL_POSTS);
      posts.forEach(p => {
        if (p.userId === request.alumniId) {
          p.isVerifiedUser = (status === 'APPROVED');
        }
      });
      setStorageItem('alumni_posts', posts);
    }

    return request;
  }
};
