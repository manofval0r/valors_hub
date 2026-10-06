import Hero from "@/components/sections/Hero";
import Bio from "@/components/sections/Bio";
import WhyWeb from "@/components/sections/WhyWeb";
import Skills from "@/components/sections/Skills";
import FeaturedProjects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import WhatImUpTo from "@/components/sections/WhatImUpTo";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen pt-16 lg:pt-0" style={{ background: 'var(--ground)' }}>
      <Hero />
      <Bio />
      <WhyWeb />
      <Skills />
      <FeaturedProjects />
      <Experience />
      <WhatImUpTo />
      <Contact />
      <Footer />
    </main>
  );
}
