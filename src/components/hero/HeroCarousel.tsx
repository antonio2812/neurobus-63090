import { useEffect, useState } from "react";

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
            // Alterado bg-cover para bg-contain para evitar corte
            className="absolute inset-0 bg-contain bg-center bg-no-repeat brightness-[0.3] blur-sm"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default HeroCarousel;