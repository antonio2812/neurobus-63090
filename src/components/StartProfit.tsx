import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const StartProfit = () => {
  return (
    <section className="py-24 bg-gradient-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground font-space-mono">
            Seu Lucro <span className="text-accent">Começa Aqui</span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            <span className="text-accent font-bold">+4.000 brasileiros</span> já usaram e multiplicaram 
            o faturamento com a LucraAI. Não perca mais tempo com planilhas e palpites. 
            Sua inteligência artificial de precificação te espera.
          </p>

          <Button 
            variant="default"
            size="xl"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-12 py-6 text-lg shadow-glow-accent hover:scale-105 transition-all duration-300 mt-8"
            onClick={() => scrollToSection('planos')}
          >
            <span className="flex items-center">
              Começar minha Jornada
              <ArrowRight className="ml-3 h-6 w-6" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StartProfit;
