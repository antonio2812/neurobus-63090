import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Footer = () => {
  const legalLinks = [
    { label: "Termos de Uso", href: "/terms#aceitacao-termos" },
    { label: "Política de Privacidade", href: "/privacy#informacoes-coletadas" },
    { label: "Suporte", href: "https://wa.link/adnlkj", external: true },
  ];

  const handleReloadPage = () => {
    window.location.reload();
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/lucraa.ai", label: "Instagram" },
    { icon: Facebook, href: "https://wa.link/adnlkj", label: "Facebook" }, // Link alterado para WhatsApp
    { icon: Youtube, href: "https://www.youtube.com/@lucra.ai", label: "YouTube" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/lucra.ai", label: "LinkedIn" },
  ];

  const solutionsLinks = [
    { label: "Ferramentas", href: "#ferramentas" },
    { label: "Lançamentos", href: "#lancamentos" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Planos", href: "#planos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Suporte", href: "https://wa.link/adnlkj", external: true },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="bg-black border-t border-border py-16">
      <div className="container mx-auto px-6">
        
        {/* Layout principal: Empilhado e Centralizado no mobile/tablet, Grid de 5 colunas no desktop (xl) */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 xl:gap-8 mb-12">
          
          {/* Coluna 1: Logo, Descrição e Redes Sociais (Ordem 1) - Mantém centralizado no desktop */}
          <div className="xl:col-span-2 space-y-6 flex flex-col items-center text-center xl:items-center xl:text-center order-1">
            
            {/* Logo */}
            <button 
              onClick={handleReloadPage} 
              className="transition-transform duration-300 hover:scale-105"
            >
              <img 
                src="/lovable-uploads/logo-lucraai-fox-new.png" 
                alt="LucraAI Logo" 
                className="h-14 w-auto rounded-lg"
              />
            </button>
            
            {/* Descrição */}
            <p className="text-muted-foreground leading-relaxed max-w-sm text-center xl:mx-0">
              O primeiro App brasileiro que combina IA avançada com Automação inteligente 
              para transformar a precificação do seu negócio em minutos.
            </p>
            
            {/* Texto Social */}
            <p className="text-sm text-muted-foreground pt-2 text-center">
              Acompanhe a LucraAI nas <span style={{ color: '#ffc800' }} className="font-semibold">Redes sociais</span>
            </p>

            {/* Links Sociais */}
            <div className="flex gap-4 justify-center w-full">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2: Soluções (Ordem 2) - AUMENTANDO O PADDING PARA xl:pl-32 */}
          <div className="text-center xl:text-left xl:col-span-1 order-2 xl:pl-32">
            <div className="flex flex-col items-center xl:items-start">
              <h3 className="text-foreground font-semibold mb-6">Soluções</h3>
              <ul className="space-y-3">
                {solutionsLinks.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-accent transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Coluna 3: Baixe o App (Ordem 3) - Centralizado no desktop */}
          <div className="text-center xl:text-center xl:col-span-1 order-3">
            <div className="flex flex-col items-center xl:items-center space-y-4"> {/* Adicionado space-y-4 */}
              <h3 className="text-foreground font-semibold mb-2">Baixe o App</h3> {/* Reduzido mb-6 para mb-2 */}
              
              {/* Google Play */}
              <a 
                href="https://wa.link/adnlkj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform duration-300 hover:scale-105"
              >
                <img 
                  src="/lovable-uploads/Google Play - Rodapé.png"
                  alt="Disponível no Google Play"
                  className="w-32 h-auto rounded-lg" 
                />
              </a>
              
              {/* App Store (NOVO) */}
              <a 
                href="https://wa.link/adnlkj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform duration-300 hover:scale-105"
              >
                <img 
                  src="/lovable-uploads/Apple Store - Rodapé.png"
                  alt="Baixar na App Store"
                  className="w-32 h-auto rounded-lg" 
                />
              </a>
            </div>
          </div>

          {/* Coluna 4: Legal (Ordem 4) - Mantém alinhado à esquerda no desktop */}
          <div className="text-center xl:text-left xl:col-span-1 order-4">
            <div className="flex flex-col items-center xl:items-start">
              <h3 className="text-foreground font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        className="text-muted-foreground hover:text-accent transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LucraAI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;