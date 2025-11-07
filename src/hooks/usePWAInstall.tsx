import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar o prompt de instalação do PWA.
 * Captura o evento 'beforeinstallprompt' e fornece a função para disparar a instalação.
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Previne que o prompt padrão do navegador apareça
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('beforeinstallprompt fired and saved.');
    };

    // 1. Verifica se já está rodando como PWA (standalone)
    const checkInstalledStatus = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    
    checkInstalledStatus();

    // 2. Listener para o evento de instalação
    window.addEventListener('beforeinstallprompt', handler);
    
    // 3. Listener para quando a instalação for concluída
    const installedHandler = () => {
        setIsInstallable(false);
        setIsInstalled(true);
        setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);


    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      
      // Mostra o prompt de instalação
      promptEvent.prompt();
      
      // Espera pela escolha do usuário
      const { outcome } = await promptEvent.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt.');
      } else {
        console.log('User dismissed the install prompt.');
      }
      
      // Limpa o prompt, pois ele só pode ser usado uma vez
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return { isInstallable, handleInstall, isInstalled };
}