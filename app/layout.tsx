import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';

import '@/index.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: 'Hayah-ai Videoke 🎤',
  description: 'Local karaoke app for personal use',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <body>{children}</body>
    </html>
  );
}
