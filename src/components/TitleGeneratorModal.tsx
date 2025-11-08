import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TitleGeneratorChat from "./title-generator/TitleGeneratorChat";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Importando cn

interface TitleGeneratorModalProps {
  children: React.ReactNode;
}

const TitleGeneratorModal = ({ children }: TitleGeneratorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBack = () => {
    // Se houver lógica de múltiplos passos no futuro, pode ser implementada aqui.
    // Por enquanto, apenas fecha o modal.
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
          // Estilo do botão de fechar (X):
          // 1. Borda transparente por padrão
          // 2. Borda transparente no hover (removendo hover:border-accent)
          "[&>button]:border-transparent [&>button:hover]:border-transparent [&>button:hover]:bg-card/50 [&>button:hover]:text-foreground"
        )}
      >
        <TitleGeneratorChat onBack={handleBack} />
      </DialogContent>
    </Dialog>
  );
};

export default TitleGeneratorModal;