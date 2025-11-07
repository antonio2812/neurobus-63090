import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MarketplaceSelection from "./pricing/MarketplaceSelection";
import PricingChatInterface from "./pricing/PricingChatInterface";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils"; // Importando cn

interface PricingModalProps {
  children: React.ReactNode;
}

const PricingModal = ({ children }: PricingModalProps) => {
  const [step, setStep] = useState(1); // 1: Selection, 2: Chat
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectMarketplace = (marketplace: string) => {
    setSelectedMarketplace(marketplace);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedMarketplace(null);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Resetar estado ao fechar
      setStep(1);
      setSelectedMarketplace(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "sm:max-w-[95vw] md:max-w-4xl p-0 bg-card border-border shadow-elevated max-h-[95vh] overflow-hidden",
          // Estilo do botão de fechar (X) ATUALIZADO:
          // 1. Borda transparente por padrão
          // 2. Borda amarela (accent) no hover
          // 3. Fundo transparente/card/50 no hover
          // 4. Ícone foreground (branco/cinza) no hover
          "[&>button]:border-transparent [&>button:hover]:border-accent [&>button:hover]:bg-card/50 [&>button:hover]:text-foreground"
        )}
      >
        
        {step === 1 && (
          <div className="p-6"> {/* Adicionando padding interno */}
            <DialogHeader className="text-center">
              {/* Título principal removido */}
            </DialogHeader>
            <MarketplaceSelection onSelect={handleSelectMarketplace} />
          </div>
        )}
        
        {step === 2 && selectedMarketplace && (
          <PricingChatInterface 
            marketplace={selectedMarketplace} 
            onBack={handleBack} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;