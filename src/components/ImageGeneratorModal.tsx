import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ImageGeneratorChat from "./image-generator/ImageGeneratorChat";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageGeneratorModalProps {
  children: React.ReactNode;
}

const ImageGeneratorModal = ({ children }: ImageGeneratorModalProps) => {
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
          "[&>button]:border-transparent [&>button:hover]:border-accent [&>button:hover]:bg-card/50 [&>button:hover]:text-foreground"
        )}
      >
        <ImageGeneratorChat onBack={handleBack} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageGeneratorModal;