import { useCallback } from 'react';

/**
 * Hook customizado para reproduzir efeitos sonoros.
 * @param volume Volume do áudio (0.0 a 1.0). Padrão: 0.6.
 */
const useSound = (volume: number = 0.6) => {
  const playSound = useCallback((filePath: string) => {
    if (!filePath) {
      console.error("playSound: File path is required.");
      return;
    }
    
    try {
      const audio = new Audio(filePath);
      audio.volume = volume;
      
      audio.play().catch(error => {
        // Captura erros de reprodução (ex: autoplay bloqueado ou arquivo não encontrado)
        console.warn(`[Audio Warning] Could not play audio from ${filePath}. Error:`, error);
        if (error.name === 'NotSupportedError' || error.name === 'MediaError') {
          console.error(`[Audio Error] Check if the file exists at ${filePath} and is a valid MP3/audio format.`);
        }
      });
    } catch (error) {
      console.error("Erro ao criar objeto Audio:", error);
    }
  }, [volume]);

  return { playSound };
};

export default useSound;