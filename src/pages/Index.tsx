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

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navigation />
      <ScrollProgressBar />
      <Hero />
      <TrustBadges />
      <ResourcesTools />
      <Differentials />
      <WhyChoose />
      <Pricing />
      <Testimonials />
      <StartProfit />
      <FAQ />
      <CTA />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
