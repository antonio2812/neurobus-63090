import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog"; // Importando o primitivo para fechar

interface AchievementsModalProps {
  children: React.ReactNode;
}

const AchievementsModal = ({ children }: AchievementsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6 md:p-8 bg-card border-accent/50 shadow-glow-accent/50 max-h-[90vh] overflow-y-auto">
        
        <DialogHeader className="text-center">
          {/* Ícone de Troféu Removido */}
          <DialogTitle className="text-2xl font-bold text-foreground font-poppins text-center">
            Suas Conquistas - Em Desenvolvimento
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 mt-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nós, da equipe LucraAI, estamos desenvolvendo uma área exclusiva para que você possa acompanhar de perto a sua evolução. Em breve, você poderá visualizar suas metas alcançadas, monitorar seus resultados e conquistas dentro da plataforma. Tudo isso pensado para valorizar ainda mais o seu progresso e impulsionar o sucesso dos seus negócios.
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

export default AchievementsModal;