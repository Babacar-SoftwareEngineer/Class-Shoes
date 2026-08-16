import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Class Shoes - Maison de mode',
  description:
    'Découvrez les collections Class Shoes, une sélection de chaussures, sacs, parfums et accessoires.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-screen bg-(--shell-bg) text-(--ink) font-sans">
        <div className="flex min-h-screen w-full flex-col bg-(--shell-bg)">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
