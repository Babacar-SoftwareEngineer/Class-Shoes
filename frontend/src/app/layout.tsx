import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Class Shoes - Luxury Fashion Edit',
  description:
    'Discover a luxury fashion storefront with editorial collections, curated products, and a refined shopping experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-screen bg-[var(--shell-bg)] text-[var(--ink)] font-sans">
        <div className="flex min-h-screen w-full flex-col bg-[var(--shell-bg)]">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
