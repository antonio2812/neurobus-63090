import { useState, useEffect } from "react";

const BackgroundEffects = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const backgroundImages = [
    "/lovable-uploads/4aa271d3-a6a3-4aab-9924e55da6a2.png", // Satellite in orbit
    "/lovable-uploads/60313361-6a48-42c0-9120-d272f5a0ceb8.png", // Drone with packages
    "/lovable-uploads/c25f1b5a-4d9a-4822-abdc-67ac48caf73c.png", // Autonomous vehicles highway
    "/lovable-uploads/68956595-e42e-48f3-abc1-04ad7cd530e9.png", // Military autonomous drone
    "/lovable-uploads/3a8f8c45-f236-48f4-8a98-465bac955163.png"  // Robot and human collaboration
  ];

  useEffect(() => {
    // Usando 1630px como o limite superior para o ajuste fino, mas mantendo 640px para o mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      setScrollOffset(window.pageYOffset);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Change background image every 7 seconds with very smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextImageIndex((currentImageIndex + 1) % backgroundImages.length);
      
      // After longer transition, update current image
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % backgroundImages.length
        );
        setIsTransitioning(false);
      }, 2500); // Extended transition duration
    }, 7000);

    return () => clearInterval(interval);
  }, [currentImageIndex, backgroundImages.length]);

  // Determine dynamic styles based on mobile state
  const baseBackgroundStyle = (index: number) => {
    // Aplicando o scale e parallax apenas em telas maiores que 1630px (ou um valor grande)
    // Para telas menores, mantemos o scale em 1 para evitar overflow.
    const isLargeScreen = window.innerWidth > 1630;
    
    const parallaxTransform = isMobile || !isLargeScreen
      ? 'translateY(0px) scale(1)' 
      : `translateY(${scrollOffset * 0.5}px) scale(1.05)`;
    
    const mousePositionStyle = isMobile 
      ? 'center' // Fixo no centro para mobile
      : `${50 + mousePosition.x * 0.02}% ${50 + mousePosition.y * 0.02}%`;

    return {
      backgroundImage: `url(${backgroundImages[index]})`,
      backgroundSize: 'cover', // Sempre cover
      backgroundPosition: mousePositionStyle,
      backgroundRepeat: 'no-repeat',
      transform: parallaxTransform,
      opacity: index === currentImageIndex 
        ? (isTransitioning ? 0 : 1) 
        : (index === nextImageIndex ? (isTransitioning ? 1 : 0) : 0),
    };
  };

  return (
    <>
      {/* Current background image */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-[5000ms] ease-in-out"
        style={baseBackgroundStyle(currentImageIndex)}
      />
      
      {/* Next background image for very smooth transition */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-[5000ms] ease-in-out"
        style={baseBackgroundStyle(nextImageIndex)}
      />
      
      {/* Lighter animated gradient overlay for better visibility */}
      <div 
        className="absolute inset-0 z-5"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%, 
              transparent 0%, 
              rgba(0,0,0,0.1) 50%, 
              rgba(0,0,0,0.4) 100%
            )
          `,
          transition: 'background 0.5s ease-out',
        }}
      />
      
      {/* Subtle grid overlay for tech aesthetic */}
      <div 
        className="absolute inset-0 z-8 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: isMobile ? 'none' : `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
    </>
  );
};

export default BackgroundEffects;