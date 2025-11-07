import Navigation from "@/components/Navigation";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import BackToTop from "@/components/BackToTop";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import ResourcesTools from "@/components/ResourcesTools";
import Differentials from "@/components/Differentials";
import WhyChoose from "@/components/WhyChoose";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import StartProfit from "@/components/StartProfit";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LatestReleases from "@/components/LatestReleases";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PWAInstallPrompt from "@/components/PWAInstallPrompt"; // NOVO IMPORT

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* PWA Install Prompt (Renderizado no topo) */}
      <PWAInstallPrompt />
      
      {/* Navigation é fixo e não deve ser desfocado */}
      <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      
      {/* ScrollProgressBar e BackToTop também são fixos e não devem ser desfocados */}
      <ScrollProgressBar />
      <BackToTop />

      {/* Conteúdo principal da página - Aplicamos o desfoque condicionalmente */}
      <div 
        className={cn(
          "transition-all duration-500",
          isMenuOpen && "blur-md pointer-events-none select-none lg:blur-none lg:pointer-events-auto lg:select-auto"
        )}
      >
        <Hero />
        <TrustBadges />
        <ResourcesTools />
        <LatestReleases />
        <Differentials />
        <WhyChoose />
        <Pricing />
        <Testimonials />
        <StartProfit />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;