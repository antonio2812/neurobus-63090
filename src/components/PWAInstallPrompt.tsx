import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { cn } from "@/lib/utils";

const PWAInstallPrompt = () => {
  const { isInstallable, handleInstall, isInstalled } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const accentColor = "#ffc800";

  // Mostra o modal se for instalável e ainda não estiver instalado
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      // Usa um timeout para garantir que o modal apareça após o carregamento inicial
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [isInstallable, isInstalled]);

  const handleInstallClick = () => {
    handleInstall();
    setIsOpen(false); // Fecha o modal após disparar o prompt
  };

  // Se já estiver instalado ou não for instalável, não renderiza nada
  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] p-6 md:p-8 bg-card border-accent/50 shadow-glow-accent/50 max-h-[90vh] overflow-y-auto">
        
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-10 w-10" style={{ color: accentColor }} />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground font-space-mono text-center">
            Instalar App
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 mt-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tenha acesso rápido e prático a todas as funcionalidades. Use em qualquer dispositivo, com desempenho otimizado e login automático.
          </p>
          <p className="text-sm text-muted-foreground">
            Instale agora para uma experiência completa e sem interrupções.
          </p>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Button 
            variant="default" 
            size="lg"
            className={cn(
              "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold",
              "shadow-glow-accent hover:scale-[1.02] transition-all duration-300"
            )}
            onClick={handleInstallClick}
          >
            <Download className="h-5 w-5 mr-2" />
            Instalar Agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallPrompt;