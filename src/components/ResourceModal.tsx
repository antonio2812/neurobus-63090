import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog"; // Importando o primitivo para usar o Close
import { cn } from "@/lib/utils";

interface ResourceModalProps {
  title: string;
  description: string;
  images: string[]; // Agora esperamos apenas 1 imagem para exibição principal
  children: React.ReactNode;
}

const ResourceModal = ({ title, description, images, children }: ResourceModalProps) => {
  // Pega a primeira imagem para exibição principal
  const mainImageSrc = images.length > 0 ? images[0] : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {/* Aumentando a largura máxima para 800px, mantendo a altura e removendo overflow-y-auto. */}
      <DialogContent 
        className="sm:max-w-[800px] p-6 md:p-8 bg-card border-border shadow-elevated max-h-[85vh] overflow-hidden [&>button]:hidden"
      >
        <DialogHeader>
          {/* Título principal com a cor #ffc800 */}
          <DialogTitle className="text-2xl font-bold" style={{ color: '#ffc800' }}>
            {title}
          </DialogTitle>
          {/* Descrição removida conforme solicitado */}
        </DialogHeader>
        
        {/* Exibição da Imagem Grande e Responsiva */}
        {mainImageSrc && (
          <div className="mt-4">
            <img 
              src={mainImageSrc} 
              alt={`Visualização da funcionalidade ${title}`} 
              className={cn(
                "w-full h-auto object-contain",
                "rounded-xl border border-border/50" // Borda arredondada e borda sutil
              )}
            />
          </div>
        )}
        
        {/* Reintroduzindo o botão 'Fechar' na parte inferior */}
        <div className="pt-4 flex justify-end">
          <DialogPrimitive.Close asChild>
            <Button variant="outline">
              Fechar
            </Button>
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;