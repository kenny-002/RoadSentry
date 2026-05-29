import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StateProvider } from '../context/StateContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import FloatingChatbot from '../components/FloatingChatbot';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RoadWatch | AI Road Quality Transparency Portal',
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
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-300" suppressHydrationWarning>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('roadwatch_theme')||'light';if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})()`
          }}
        />
        <StateProvider>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            <AuthGuard>{children}</AuthGuard>
          </main>
          <Footer />
          <FloatingChatbot />
        </StateProvider>
      </body>
    </html>
  );
}
