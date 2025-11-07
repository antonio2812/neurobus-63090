import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DashboardHeaderProps {
  userName: string;
}

// Componente auxiliar para renderizar os ícones de imagem com o estilo de hover
const DashboardIconLink = ({ 
  to, 
  label, 
  iconSrc, 
  defaultInvert = false // Novo prop: se true, o ícone é branco por padrão
}: { 
  to: string, 
  label: string, 
  iconSrc: string,
  defaultInvert?: boolean
}) => {
  // Classes de hover: Fundo amarelo (accent)
  const hoverClasses = "hover:bg-accent group-hover:bg-accent transition-all duration-300";
  
  // Lógica de filtro:
  // 1. Se defaultInvert for TRUE (Planos/Perfil):
  //    - Normal: filter invert (branco)
  //    - Hover: group-hover:filter-none (preto)
  // 2. Se defaultInvert for FALSE (Home):
  //    - Normal: filter-none (preto)
  //    - Hover: group-hover:invert (branco)
  
  const filterClasses = cn(
    "h-6 w-6 object-contain transition-all duration-300",
    // Estado Normal
    defaultInvert ? "filter invert" : "filter-none",
    // Estado Hover (inverte o estado normal)
    defaultInvert ? "group-hover:filter-none" : "group-hover:invert"
  );

  return (
    <Button 
      variant="ghost" 
      size="icon"
      className={cn(
        "w-10 h-10 p-2 rounded-full", // Aumentando o tamanho do botão
        hoverClasses
      )}
      asChild
    >
      <Link to={to} aria-label={label} className="group">
        <img 
          src={iconSrc} 
          alt={label} 
          className={filterClasses}
        />
      </Link>
    </Button>
  );
};

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const handleLogoClick = () => {
    // Recarrega a página
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo e Título */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 group z-50 cursor-pointer"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          aria-label="Recarregar Página Inicial do Dashboard"
        >
          <div className={cn(
            "h-12 w-12 flex items-center justify-center rounded-lg p-1 transition-all duration-300 ease-in-out",
            // Aplicando fundo #2B2600 no hover
            isLogoHovered ? 'bg-[#2B2600] opacity-100' : 'bg-transparent opacity-100'
          )}>
            <img 
              src="/lovable-uploads/logo-lucraai-fox-new.png" 
              alt="LucraAI Icon" 
              className={cn(
                "h-full w-full object-contain transition-opacity duration-300 ease-in-out",
                // Ícone sempre opaco (cor original)
                'opacity-100'
              )}
            />
          </div>
          
          <span className={cn(
            "text-xl font-bold text-foreground transition-opacity duration-300 ease-in-out",
            // Texto com transparência no hover
            isLogoHovered ? 'opacity-30' : 'opacity-100'
          )}>
            Lucra<span style={{ color: '#ffc800' }}>AI</span>
          </span>
        </button>

        {/* Botões de Ação com Ícones de Imagem */}
        <div className="flex items-center gap-2">
          
          {/* Botão Home: Preto no normal, Branco no hover (defaultInvert=false) */}
          <DashboardIconLink 
            to="/dashboard" 
            label="Home" 
            iconSrc="/lovable-uploads/Home-icon-new.png" 
            defaultInvert={false}
          />

          {/* Botão Escolha seu Plano: Branco no normal, Preto no hover (defaultInvert=true) */}
          <DashboardIconLink 
            to="/dashboard/plans" 
            label="Escolha seu Plano" 
            iconSrc="/lovable-uploads/etiqueta-de-preco.png" 
            defaultInvert={true}
          />
          
          {/* Botão Meu Perfil: Branco no normal, Preto no hover (defaultInvert=true) */}
          <DashboardIconLink 
            to="/dashboard/profile" 
            label="Meu Perfil" 
            iconSrc="/lovable-uploads/perfil.png" 
            defaultInvert={true}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;