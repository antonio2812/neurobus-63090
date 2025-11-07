import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import FloatingParticles from "./hero/FloatingParticles";
import HeroCarousel from "./hero/HeroCarousel";
import { Link } from "react-router-dom"; // Importando Link

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
          
          {/* Bloco de Conteúdo Principal - Usando flex e order para controlar a ordem no mobile */}
          <div className="flex flex-col space-y-8 pt-8 sm:pt-0"> 
            
            {/* Botão de Destaque (AGORA É O PRIMEIRO ELEMENTO) */}
            <div className="order-1">
              <button className="inline-block px-6 py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 mt-8 hover:border-accent/30 transition-all duration-300 cursor-default">
                <span className="text-white text-sm font-medium tracking-wide">
                  Plataforma Completa de Precificação
                </span>
              </button>
            </div>

            {/* Título e Descrição (Ordem 2) */}
            <div className="space-y-8 order-2">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-foreground font-space-mono">
                IA que Multiplica seu 
                <span style={{ color: '#ffc800' }}> Lucro</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                O primeiro App brasileiro que combina IA avançada com Automação inteligente 
                para transformar a precificação do seu negócio em minutos.
              </p>
            </div>
            
            {/* Botões de Ação (Ordem 3) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 pt-0 sm:pt-8 order-3">
              <Button 
                variant="default" 
                size="xl" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-12 py-6 text-lg shadow-glow-accent hover:scale-105 transition-all duration-300"
                onClick={() => scrollToSection('planos')}
              >
                Comece agora Grátis
              </Button>
              
              {/* Link "Baixe o App" */}
              <a 
                href="https://wa.link/adnlkj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg font-medium flex items-center group relative transition-colors duration-300"
              >
                Baixe o App
                <ArrowRight className="ml-2 h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                {/* Efeito de sublinhado branco no hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-scan z-25" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-scan z-25" style={{animationDelay: '4s'}} />
    </section>
  );
};

export default Hero;