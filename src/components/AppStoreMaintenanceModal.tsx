import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Wrench removido
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface AppStoreMaintenanceModalProps {
  children: React.ReactNode;
}

const AppStoreMaintenanceModal = ({ children }: AppStoreMaintenanceModalProps) => {
  const accentColor = "#ffc800";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] p-6 md:p-8 bg-card border-accent/50 shadow-glow-accent/50 max-h-[90vh] overflow-y-auto text-center">
        
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {/* Ícone Wrench removido */}
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground font-space-mono text-center">
            🚧 App em Manutenção - App Store 🚧
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 mt-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Estamos realizando melhorias para entregar a melhor experiência possível aos usuários de iPhone.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nossa equipe está trabalhando a todo vapor para resolver pequenos ajustes e em breve a LucraAI estará disponível novamente na App Store.
          </p>
          <p className="text-lg font-semibold" style={{ color: accentColor }}>
            Voltaremos ainda melhores!
          </p>
        </div>
        
        <div className="pt-4 flex justify-center">
          <DialogPrimitive.Close asChild>
            <Button 
              variant="default" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
            >
              Entendi
            </Button>
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppStoreMaintenanceModal;