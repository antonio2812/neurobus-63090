import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog"; // Importando o primitivo para usar o Close

interface ResourceModalProps {
  title: string;
  description: string;
  images: string[];
  children: React.ReactNode;
}

const ResourceModal = ({ title, description, images, children }: ResourceModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {/* Adicionando a classe para ocultar o botão 'X' padrão e reintroduzindo o botão 'Fechar' */}
      <DialogContent 
        className="sm:max-w-[800px] p-6 md:p-8 bg-card border-border shadow-elevated max-h-[90vh] overflow-y-auto [&>button]:hidden"
      >
        <DialogHeader>
          {/* Título principal com a cor #ffc800 */}
          <DialogTitle className="text-2xl font-bold" style={{ color: '#ffc800' }}>
            {title}
          </DialogTitle>
          {/* Descrição removida conforme solicitado */}
        </DialogHeader>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {images.map((src, index) => (
            <div key={index} className="bg-muted/20 p-4 rounded-lg flex items-center justify-center h-32">
              <img 
                src={src} 
                alt={`Funcionalidade ${index + 1}`} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
        
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