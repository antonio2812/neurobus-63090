import { useCallback } from 'react';

/**
 * Hook customizado para reproduzir efeitos sonoros.
 * @param volume Volume do áudio (0.0 a 1.0). Padrão: 0.6.
 */
export const useSound = (volume: number = 0.6) => {
  const playSound = useCallback((filePath: string) => {
    try {
      const audio = new Audio(filePath);
      audio.volume = volume;
      audio.play().catch(error => {
        // Captura erros de reprodução (ex: autoplay bloqueado em alguns navegadores)
        console.warn("Erro ao tentar reproduzir áudio:", error);
      });
    } catch (error) {
      console.error("Erro ao criar objeto Audio:", error);
    }
  }, [volume]);

  return { playSound };
};