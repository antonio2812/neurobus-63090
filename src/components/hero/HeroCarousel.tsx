import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Importando cn

const HeroCarousel = () => {
  const images = [
    "/lovable-uploads/hero-01.webp",
    "/lovable-uploads/hero-02.webp",
    "/lovable-uploads/hero-03.jpg",
    "/lovable-uploads/hero-04.jpeg",
    "/lovable-uploads/hero-05.webp",
    "/lovable-uploads/hero-06.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
            // Aplicando as propriedades CSS solicitadas: 
            // bg-cover (padrão) para telas grandes (2xl)
            // 2xl:bg-cover (acima de 1400px)
            // bg-contain (abaixo de 1400px) para garantir que a imagem caiba inteira
            className={cn(
              "absolute inset-0 bg-no-repeat bg-center brightness-[0.3] blur-sm",
              // Padrão (Mobile/Tablet/Desktop): Contain (para caber)
              "bg-contain",
              // 2XL (Acima de 1400px): Cover (para preencher)
              "2xl:bg-cover"
            )}
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default HeroCarousel;