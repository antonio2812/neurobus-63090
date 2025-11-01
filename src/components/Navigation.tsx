import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "#ferramentas", label: "Ferramentas" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#planos", label: "Planos" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "https://wa.link/adnlkj", label: "Suporte", external: true },
    { href: "#faq", label: "FAQ" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignupClick = () => {
    // Redirect to auth page and ensure the signup tab is active
    window.location.href = '/auth#signup';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={scrollToTop} className="flex items-center space-x-3 z-50 group">
          {/* Efeito hover: cor #3A320A atrás do ícone com bordas arredondadas */}
          <img 
            src="/lovable-uploads/logo-lucraai-fox-new.png" 
            alt="LucraAI Logo" 
            className="h-14 w-auto transition-all duration-300 rounded-lg p-1"
            style={{ backgroundColor: 'transparent', transition: 'background-color 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3A320A'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          />
          {/* Texto transparente no hover (opacity-0) */}
          <span className="text-xl font-bold text-foreground transition-all duration-300 group-hover:opacity-0">
            Lucra<span style={{ color: '#ffc800' }}>AI</span>
          </span>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 text-sm">
          {navigationItems.map((item) => (
            item.external ? (
              <a 
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ) : (
              <a 
                key={item.href}
                href={item.href} 
                className="text-foreground hover:text-accent transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            )
          ))}
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
            asChild
          >
            <Link to="/auth">Entrar</Link>
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6"
            onClick={handleSignupClick} // Direciona para /auth#signup
          >
            Usar Grátis
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-foreground hover:bg-accent/10 p-2 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-black/98 backdrop-blur-xl transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {navigationItems.map((item, index) => (
              item.external ? (
                <a 
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-foreground text-2xl hover:text-accent transition-all duration-300 ${
                    isOpen ? 'animate-fade-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`text-foreground text-2xl hover:text-accent transition-all duration-300 ${
                    isOpen ? 'animate-fade-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}
            
            <div className="flex flex-col items-center space-y-4 pt-8">
              <Button
                variant="ghost" 
                size="lg"
                className="text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to="/auth">Entrar</Link>
              </Button>
              
              <Button 
                variant="default" 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => {
                    handleSignupClick();
                  }, 300);
                }}
              >
                Usar Grátis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;