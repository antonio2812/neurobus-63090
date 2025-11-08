import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Importando cn

const desktopImages = [
  "/lovable-uploads/01 - Desktop.webp",
  "/lovable-uploads/02 - Desktop.webp",
  "/lovable-uploads/03 - Desktop.jpg",
  "/lovable-uploads/04 - Desktop.jpeg",
  "/lovable-uploads/05 - Desktop.webp",
  "/lovable-uploads/06 - Desktop.webp",
];

const mobileImages = [
  "/lovable-uploads/01 - Mobile.webp",
  "/lovable-uploads/02 - Mobile.webp",
  "/lovable-uploads/03 - Mobile.webp",
  "/lovable-uploads/04 - Mobile.webp",
  "/lovable-uploads/05 - Mobile.webp",
  "/lovable-uploads/06 - Mobile.webp",
];

const HeroCarousel = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Seleciona o array de imagens baseado no tamanho da tela
  // isSmallScreen é true se <= 1630px
  const images = isSmallScreen ? mobileImages : desktopImages;

  useEffect(() => {
    const checkScreenSize = () => {
      // 1630px ou menor usa as imagens otimizadas para mobile
      setIsSmallScreen(window.innerWidth <= 1630);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [images.length]); // Dependência em images.length garante que o intervalo reinicie se o conjunto de imagens mudar

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div 
            // Usando bg-cover e bg-center para garantir que a imagem preencha a altura e mantenha a proporção,
            // centralizando o foco visual.
            className={cn(
              "absolute inset-0 bg-no-repeat bg-center brightness-[0.3] blur-sm",
              "bg-cover" // Garante que a imagem preencha o contêiner sem vazar
            )}
            // CORREÇÃO: Usando encodeURI para lidar com espaços nos nomes dos arquivos
            style={{ backgroundImage: `url(${encodeURI(image)})` }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default HeroCarousel;