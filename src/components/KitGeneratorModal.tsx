import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import KitGeneratorChat from "./kit-generator/KitGeneratorChat";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface KitGeneratorModalProps {
  children: React.ReactNode;
}

const KitGeneratorModal = ({ children }: KitGeneratorModalProps) => {
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
          // Estilo do botão de fechar (X)
          "[&>button]:border-transparent [&>button:hover]:border-accent [&>button:hover]:bg-transparent [&>button:hover]:text-foreground"
        )}
      >
        <KitGeneratorChat onBack={handleBack} />
      </DialogContent>
    </Dialog>
  );
};

export default KitGeneratorModal;