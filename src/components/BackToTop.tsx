import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      size="icon"
      className={`fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-2xl transition-all duration-500 bg-white hover:bg-white/90 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
    >
      <ArrowUp className="h-5 w-5 text-black" />
    </Button>
  );
};

export default BackToTop;