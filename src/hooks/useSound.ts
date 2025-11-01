const playSound = (filePath: string, volume: number = 0.6) => {
  try {
    const audio = new Audio(filePath);
    audio.volume = volume;
    
    // Tenta reproduzir o áudio. O catch é importante para evitar erros 
    // de promessa não tratada em navegadores que bloqueiam autoplay.
    audio.play().catch(error => {
      console.warn("Falha na reprodução de áudio (pode ser bloqueio do navegador):", error);
    });
  } catch (error) {
    console.error("Erro ao criar objeto de áudio:", error);
  }
};

export default playSound;