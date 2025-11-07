import { useEffect, useRef, useState } from 'react';

/**
 * Hook para aplicar classes de animação quando um elemento entra na viewport.
 * A animação é ativada apenas uma vez.
 * 
 * @param threshold A porcentagem de visibilidade necessária para disparar (0.1 = 10%).
 * @returns Um objeto contendo a referência do elemento (ref) e um booleano (isInView).
 */
export function useInViewAnimation(threshold: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Se já estiver em vista, não precisa observar
    if (isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Parar de observar após a primeira interseção
          observer.unobserve(element);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, isInView]);

  return { ref, isInView };
}