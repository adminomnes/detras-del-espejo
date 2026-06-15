import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlobalPlayer } from "@/components/player/GlobalPlayer";
import ParticleBackground from "@/components/effects/ParticleBackground";
import { WeeklyFlyer } from "@/components/flyer/WeeklyFlyer";
import { BackgroundMusic } from "@/components/effects/BackgroundMusic";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
      <GlobalPlayer />
      <WeeklyFlyer />
      <BackgroundMusic />
    </>
  );
}
