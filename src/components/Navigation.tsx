import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const navigationItems = [
    { href: "#ferramentas", label: "Ferramentas" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#planos", label: "Planos" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "https://wa.link/adnlkj", label: "Suporte", external: true },
    { href: "#faq", label: "FAQ" },
  ];

  const handleReloadPage = () => {
    window.location.reload();
  };

  const handleSignupClick = () => {
    window.location.href = '/auth#signup';
  };
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <button 
          onClick={handleReloadPage} 
          className="flex items-center space-x-3 z-50 group"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <img 
            src="/lovable-uploads/logo-lucraai-fox-new.png" 
            alt="LucraAI Logo" 
            className="h-14 w-auto transition-all duration-300 rounded-lg p-1"
            style={{ 
              backgroundColor: isLogoHovered ? '#3A320A' : 'transparent', 
              transition: 'background-color 0.3s' 
            }}
          />
          <span className="text-xl font-bold text-foreground transition-all duration-300 group-hover:opacity-30">
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
            onClick={handleSignupClick}
          >
            Usar Grátis
          </Button>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <Button
          variant="ghost"
          size="sm"
          // Hover ajustado para 90% de opacidade
          className="lg:hidden text-foreground p-2 z-[60] transition-opacity duration-300 hover:opacity-90" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu Drawer and Overlay */}
        
        {/* 1. Overlay (Fundo Desfocado e Escurecido) */}
        {isOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 transition-opacity duration-500"
            onClick={() => setIsOpen(false)}
            style={{
              // Fundo preto semi-transparente e desfoque aplicado a TUDO atrás do overlay
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              backdropFilter: 'blur(12px)', 
              WebkitBackdropFilter: 'blur(12px)', // Adicionando prefixo para compatibilidade
            }}
          />
        )}

        {/* 2. Side Panel (Painel Lateral) */}
        <div 
          className={`lg:hidden fixed top-0 right-0 w-[70%] max-w-xs h-full border-l border-border shadow-2xl z-50 transform transition-transform duration-500 ease-in-out bg-black ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          // Removendo style inline e usando bg-black (Tailwind) para garantir o preto puro
        >
          <div className="p-6 pt-24 flex flex-col h-full">
            
            {/* Links do Cabeçalho */}
            <div className="flex flex-col space-y-6 border-b border-border pb-6 mb-6">
              {navigationItems.map((item) => (
                item.external ? (
                  <a 
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground text-lg hover:text-accent transition-all duration-300 font-medium"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className="text-foreground text-lg hover:text-accent transition-all duration-300 font-medium"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </div>
            
            {/* Botões */}
            <div className="flex flex-col space-y-4 pt-6">
              <Button
                variant="ghost" 
                size="lg"
                className="text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                asChild
                onClick={handleLinkClick}
              >
                <Link to="/auth">Entrar</Link>
              </Button>
              
              <Button 
                variant="default" 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
                onClick={() => {
                  handleLinkClick();
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