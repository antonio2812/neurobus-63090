import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TrendSpyChat from "./trend-spy/TrendSpyChat";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TrendSpyModalProps {
  children: React.ReactNode;
}

const TrendSpyModal = ({ children }: TrendSpyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBack = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "sm:max-w-[90vw] md:max-w-[800px] p-0 bg-card border-border shadow-elevated max-h-[95vh] overflow-hidden",
          // Estilo do botão de fechar (X) ATUALIZADO:
          // 1. Borda transparente por padrão
          // 2. Borda transparente no hover (removendo hover:border-accent)
          // 3. Fundo transparente/card/50 no hover
          // 4. Ícone foreground (branco/cinza) no hover
          "[&>button]:border-transparent [&>button:hover]:border-transparent [&>button:hover]:bg-card/50 [&>button:hover]:text-foreground"
        )}
      >
        <TrendSpyChat onBack={handleBack} />
      </DialogContent>
    </Dialog>
  );
};

export default TrendSpyModal;