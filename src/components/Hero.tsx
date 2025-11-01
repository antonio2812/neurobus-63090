import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import FloatingParticles from "./hero/FloatingParticles";
import HeroCarousel from "./hero/HeroCarousel";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <HeroCarousel />
      <FloatingParticles />
      
      <div className={`container mx-auto px-8 z-20 text-center max-w-7xl transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-8 pt-16 sm:pt-0"> {/* Adicionado pt-16 para empurrar o conteúdo para baixo no mobile */}
            {/* Repositioned slightly lower (mt-8 added) and cursor changed */}
            <button className="inline-block px-6 py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 mt-8 hover:border-accent/30 transition-all duration-300 cursor-default">
              <span className="text-white text-sm font-medium tracking-wide">
                Plataforma Completa de Precificação
              </span>
            </button>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-foreground font-space-mono">
              Chega de Planilhas
              <br />
              <span className="text-white">Complicadas</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              O primeiro App brasileiro que combina IA avançada com Automação inteligente 
              para transformar a precificação do seu negócio em minutos.
            </p>
          </div>
          
          {/* Ajuste aqui: pt-4 no mobile, pt-8 no sm: e acima */}
          <div className="flex justify-center items-center gap-8 pt-4 sm:pt-8">
            <Button 
              variant="default" 
              size="xl" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-12 py-6 text-lg shadow-glow-accent hover:scale-105 transition-all duration-300"
              onClick={() => scrollToSection('planos')}
            >
              <span className="flex items-center">
                Comece agora Grátis
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>

        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-scan z-25" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-scan z-25" style={{animationDelay: '4s'}} />
    </section>
  );
};

export default Hero;