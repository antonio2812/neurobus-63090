import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const CTA = () => {
  return (
    <section id="suporte" className="py-24 bg-gradient-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-space-mono">
            Pronto para <span className="text-accent">Transformar</span> seu Negócio?
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Junte-se a milhares de vendedores que já estão lucrando mais com a LucraAI.
          </p>

          <Button 
            variant="default"
            size="xl"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-12 py-6 text-lg shadow-glow-accent hover:scale-105 transition-all duration-300"
            onClick={() => scrollToSection('planos')}
          >
            <span className="flex items-center">
              Começar Agora Grátis
              <ArrowRight className="ml-3 h-6 w-6" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
