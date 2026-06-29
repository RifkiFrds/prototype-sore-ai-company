import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'AI Company Assistant — Dashboard',
  description: 'Administrative and monitoring dashboard for the AI Company Assistant ecosystem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.className}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
