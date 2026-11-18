import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { IntroVeil } from "@/components/intro-veil";
import { SceneLoader } from "@/components/three/scene-loader";

export default function Home() {
  return (
    <main className="relative">
      {/* Staged reveal: veil lifts once the 3D scene is live */}
      <IntroVeil />

      {/* Fixed 3D layer — always mounted, sits behind everything */}
      <SceneLoader />

      <Navbar />

      <div className="relative z-10">
        <Hero />
        {/* Sections are transparent so the 3D core shows through everywhere;
            text sits on frosted glass panels for legibility */}
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
