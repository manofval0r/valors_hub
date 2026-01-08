import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/navigation/SideNav";
import MobileNav from "@/components/navigation/MobileNav";
import LoadingScreen from "@/components/animations/LoadingScreen";

export const metadata: Metadata = {
  title: "David Idowu - Web Developer/Web Designer",
  description: "Portfolio showcasing web development projects, skills, and experience in building modern web applications.",
  keywords: ['web developer', 'full-stack', 'React', 'Next.js', 'portfolio', 'David Idowu'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <LoadingScreen />
        <SideNav />
        <MobileNav />
        {children}
      </body>
    </html>
  );
}
