import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import Navbar from '@/components/navigation/Navbar';

export const metadata: Metadata = {
  title: 'AlumniConnect - College Networking & Mentorship',
  description: 'A modern LinkedIn-style professional networking platform connecting college students, alumni, and faculty.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen">
        <ThemeProvider>
          <Navbar />
          <div className="w-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
