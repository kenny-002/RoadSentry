import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StateProvider } from '../context/StateContext';
import AuthGuard from '../components/AuthGuard';
import FloatingChatbot from '../components/FloatingChatbot';
import MainLayout from '../components/MainLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Road Sentry | AI Road Quality Transparency Portal',
  description: 'Smart-city transparency portal for citizens. Report potholes and cracks, track repair progress, and check contractor performance scores.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 transition-colors duration-300" suppressHydrationWarning>
        <StateProvider>
          <MainLayout>
            <AuthGuard>{children}</AuthGuard>
          </MainLayout>
          <FloatingChatbot />
        </StateProvider>
      </body>
    </html>
  );
}
