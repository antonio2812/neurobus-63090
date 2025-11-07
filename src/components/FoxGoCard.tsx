import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const FoxGoCard = () => {
  const instagramLink = "https://instagram.com/lucraa.ai";

  return (
    <Card className="p-6 md:p-10 bg-gradient-card border-accent/30 shadow-glow-accent/50 transition-all duration-500 hover-lift">
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* Title - Removed Zap icon and changed 'Fox GO' color to text-foreground (white/light gray) */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-space-mono text-center">
          Funcionalidade Muito em Breve – <span className="text-foreground">Fox GO</span>
        </h2>
        
        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Prepare-se para uma nova forma de acelerar o crescimento do seu negócio e ainda ganhar recompensas! 
          Em breve, você vai vivenciar uma experiência totalmente gamificada, com recompensas exclusivas, 
          conquistas e desafios semanais criados para impulsionar seus resultados e transformar o desempenho 
          do seu negócio de maneira envolvente e estratégica.
        </p>

        {/* Images (Responsive Grid) - Alterado para grid-cols-1 por padrão e lg:grid-cols-2 para telas maiores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl pt-4">
          <div className="overflow-hidden rounded-xl border border-border/50 shadow-lg cursor-pointer">
            <img 
              src="/lovable-uploads/fox-go-capa.png" 
              alt="Fox GO Capa" 
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-xl border border-border/50 shadow-lg cursor-pointer">
            <img 
              src="/lovable-uploads/fox-go-game.png" 
              alt="Fox GO Game Preview" 
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Button - Texto alterado, ícone aumentado (h-7 w-7) e texto diminuído (text-base) */}
        <a 
          href={instagramLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="pt-6 w-full sm:w-auto"
        >
          <Button
            variant="default"
            size="lg"
            className={cn(
              "w-full sm:w-auto font-bold px-8 py-6 text-base shadow-glow-accent transition-all duration-300", // text-base (diminuído)
              "bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02]"
            )}
          >
            <Instagram className="h-7 w-7 mr-3" /> {/* Ícone aumentado */}
            Ver mais novidades
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default FoxGoCard;