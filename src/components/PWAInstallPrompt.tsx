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

  // Mostra o modal se for instalável e ainda não estiver instalado, após 10 segundos
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      // Atraso de 10 segundos (10000 ms)
      const timer = setTimeout(() => setIsOpen(true), 10000);
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
      <DialogContent 
        className={cn(
          "sm:max-w-[400px] p-6 md:p-8 bg-card border-accent/50 shadow-glow-accent/50 max-h-[90vh] overflow-y-auto",
          "animate-scale-in" // Adiciona o efeito de aparecer (scale-in)
        )}
      >
        
        <DialogHeader className="text-center">
          {/* Ícone da LucraAI (Maior e Centralizado) */}
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/icone-lucraai-transparente.png" 
              alt="LucraAI Icon" 
              className="h-20 w-20 object-contain mx-auto" // Aumentado para h-20 w-20
            />
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
        
        <div className="pt-4 flex flex-col items-center">
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
          
          {/* Texto Adicional */}
          <p className="text-sm text-muted-foreground mt-3">
            Ou Toque no Ícone de Instalar na Barra de pesquisas do seu Navegador.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallPrompt;