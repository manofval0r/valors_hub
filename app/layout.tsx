import type { Metadata } from "next";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import TopNav from "@/components/navigation/TopNav";
import MobileNav from "@/components/navigation/MobileNav";
import LoadingScreen from "@/components/animations/LoadingScreen";
import DotField from "@/components/animations/DotField";
import WorldToggle from "@/components/ui/WorldToggle";

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const martian = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-mono2',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://davidowu.vercel.app'),
  title: "David Idowu - Full-Stack | Web Developer",
  description: "Portfolio showcasing web development projects, skills, and experience in building full-stack web applications.",
  keywords: ['web developer', 'full-stack', 'React', 'Next.js', 'portfolio', 'David Idowu'],
  openGraph: {
    title: 'David Idowu — Full-Stack Web Developer',
    description: 'I craft web experiences with intention, precision, and a focus on what matters.',
    url: 'https://davidowu.vercel.app',
    siteName: 'David Idowu',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'David Idowu — Web Developer Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Idowu — Full-Stack Web Developer',
    description: 'I craft web experiences with intention, precision, and a focus on what matters.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-world="ink" className={`${bricolage.variable} ${martian.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <DotField density={34} />
        </div>
        <div className="relative z-10">
          <LoadingScreen />
          <Analytics />
          <TopNav />
          <MobileNav />
          <WorldToggle />
          {children}
        </div>
      </body>
    </html>
  );
}
