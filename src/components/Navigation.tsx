import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Importando cn

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Navigation = ({ isOpen, setIsOpen }: NavigationProps) => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const navigationItems = [
    { href: "#ferramentas", label: "Ferramentas" },
    { href: "#lancamentos", label: "Lançamentos" }, // NOVO LINK
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

  // Efeito para desabilitar o scroll do corpo quando o menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
          className={cn(
            "lg:hidden text-accent p-2 z-[60] transition-all duration-500", // Aumentei a duração da transição
            isOpen ? "rotate-180" : "rotate-0" // Adicionando rotação para efeito suave
          )} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Usando um único ícone que muda de classe para transição suave */}
          {isOpen ? (
            <X className="h-6 w-6 transition-opacity duration-300" />
          ) : (
            <Menu className="h-6 w-6 transition-opacity duration-300" />
          )}
        </Button>

        {/* Mobile Menu Drawer and Overlay */}
        
        {/* 1. Overlay (Clique-catcher) */}
        {isOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 transition-opacity duration-500"
            onClick={() => setIsOpen(false)}
            style={{
              // Fundo semi-transparente para escurecer o conteúdo atrás do menu
              backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            }}
          />
        )}

        {/* 2. Side Panel (Painel Lateral) */}
        <div 
          className={`lg:hidden fixed top-0 right-0 w-[70%] max-w-xs h-full border-l border-border shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          // Cor de fundo preta pura (#000000)
          style={{ backgroundColor: '#000000' }}
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