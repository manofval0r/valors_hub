import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import SideNav from "@/components/navigation/SideNav";
import MobileNav from "@/components/navigation/MobileNav";
import LoadingScreen from "@/components/animations/LoadingScreen";

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: "David Idowu - Full-Stack | Web Developer",
  description: "Portfolio showcasing web development projects, skills, and experience in building full-stack web applications.",
  keywords: ['web developer', 'full-stack', 'React', 'Next.js', 'portfolio', 'David Idowu'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.variable} suppressHydrationWarning>
      <body className="antialiased font-rubik" suppressHydrationWarning>
        <LoadingScreen />
        <SideNav />
        <MobileNav />
        {children}
      </body>
    </html>
  );
}
