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
      {/* Alterado para w-full em mobile e sm:max-w-[900px] em desktop. */}
      <DialogContent 
        className="w-full sm:max-w-[900px] p-6 md:p-8 bg-card border-border shadow-elevated max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          {/* Título principal removido */}
        </DialogHeader>
        
        {/* Exibição da Imagem Grande e Responsiva */}
        {mainImageSrc && (
          <div className="mt-4 mx-auto"> {/* Removido flex, justify-center, items-center, w-full e h-full */}
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
        
        {/* Removendo o botão 'Fechar' manual */}
        {/* <div className="pt-4 flex justify-end>
          <DialogPrimitive.Close asChild>
            <Button variant="outline">
              Fechar
            </Button>
          </DialogPrimitive.Close>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;