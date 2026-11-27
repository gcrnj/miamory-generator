import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Miamory Conversation Generator | Realistic Chat Studio',
  description:
    'Compose fictional group conversations and export realistic high-resolution chat images for Miamory Facebook content.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
