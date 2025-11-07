import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Marketplaces disponíveis
const marketplaces = [
  { name: "Mercado Livre", logo: "/lovable-uploads/Logo Mercado Livre.png" },
  { name: "Shopee", logo: "/lovable-uploads/Logo Shopee.jpeg" },
  { name: "Amazon", logo: "/lovable-uploads/Logo Amazon.jpg" },
  { name: "Magalu", logo: "/lovable-uploads/Logo Magalu.jpg" },
  { name: "Shein", logo: "/lovable-uploads/Logo Shein.jpg" },
  { name: "Facebook", logo: "/lovable-uploads/Logo Facebook.jpeg" }, // Usando a nova logo
];

interface MarketplaceSelectionProps {
  onSelect: (marketplace: string) => void;
}

const MarketplaceSelection = ({ onSelect }: MarketplaceSelectionProps) => {
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Título e Subtítulo movidos para cima */}
      <div className="text-center space-y-2 -mt-4">
        <h3 className="text-2xl font-bold text-foreground font-space-mono">
          Etapa 1: Selecione o Marketplace
        </h3>
        <p className="text-muted-foreground text-center max-w-md mx-auto">
          Escolha qual o marketplace você deseja precificar seu produto para que a LucraAI calcule e faça a precificação correta.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {marketplaces.map((mp) => (
          <Card
            key={mp.name}
            className={cn(
              "p-4 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all duration-300",
              "border-border", // Garante que a borda inicial seja a cor padrão (border)
              "hover:border-accent/50 hover:shadow-glow-accent/30 hover:scale-[1.03] group",
            )}
            onClick={() => onSelect(mp.name)}
          >
            <div className="h-16 w-16 flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={mp.logo}
                alt={mp.name}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-sm font-semibold text-foreground text-center">
              {mp.name}
            </span>
          </Card>
        ))}
      </div>
      
      {/* Mensagem de Vantagem do Facebook REMOVIDA daqui */}
    </div>
  );
};

export default MarketplaceSelection;