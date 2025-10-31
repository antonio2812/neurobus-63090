import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let animationFrame: number;
    const maxParticles = 30;

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 2 - 0.5,
      life: 0,
      maxLife: Math.random() * 300 + 200,
      size: Math.random() * 2 + 1,
    });

    const updateParticles = () => {
      setParticles(prev => {
        let newParticles = prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life + 1,
            vy: particle.vy * 0.999, // Slight deceleration
          }))
          .filter(particle => particle.life < particle.maxLife && particle.y > -10);

        // Add new particles
        while (newParticles.length < maxParticles) {
          newParticles.push(createParticle(Date.now() + Math.random()));
        }

        return newParticles;
      });

      animationFrame = requestAnimationFrame(updateParticles);
    };

    // Initialize particles
    const initialParticles = Array.from({ length: maxParticles }, (_, i) => 
      createParticle(i)
    );
    setParticles(initialParticles);

    animationFrame = requestAnimationFrame(updateParticles);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {particles.map(particle => {
        const opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.6;
        return (
          <div
            key={particle.id}
            className="absolute rounded-full bg-accent"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: opacity,
              boxShadow: `0 0 ${particle.size * 2}px hsl(var(--accent) / 0.5)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingParticles;