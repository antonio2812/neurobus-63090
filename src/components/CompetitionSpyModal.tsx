import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CompetitionSpyChat from "./competition-spy/CompetitionSpyChat";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CompetitionSpyModalProps {
  children: React.ReactNode;
}

const CompetitionSpyModal = ({ children }: CompetitionSpyModalProps) => {
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
          // 2. Borda amarela (accent) no hover
          // 3. Fundo transparente/card/50 no hover
          // 4. Ícone foreground (branco/cinza) no hover
          "[&>button]:border-transparent [&>button:hover]:border-accent [&>button:hover]:bg-card/50 [&>button:hover]:text-foreground"
        )}
      >
        <CompetitionSpyChat onBack={handleBack} />
      </DialogContent>
    </Dialog>
  );
};

export default CompetitionSpyModal;