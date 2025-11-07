import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface FeatureComingSoonModalProps {
  featureTitle: string;
  children: React.ReactNode;
}

const FeatureComingSoonModal = ({ featureTitle, children }: FeatureComingSoonModalProps) => {
  const accentColor = "#ffc800";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-6 md:p-8 bg-card border-accent/50 shadow-glow-accent/50 max-h-[90vh] overflow-y-auto">
        
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-10 w-10" style={{ color: accentColor }} />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground font-space-mono text-center">
            {featureTitle} - Em Breve
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 mt-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Estamos trabalhando duro para lançar esta funcionalidade incrível! 
            Fique ligado nas nossas atualizações.
          </p>
          <div className="flex items-center justify-center text-accent font-semibold">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Desenvolvimento em Andamento...
          </div>
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

export default FeatureComingSoonModal;