import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const navigationLinks = [
    { label: "Ferramentas", href: "#ferramentas" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Planos", href: "#planos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "FAQ", href: "#faq" },
  ];

  const legalLinks = [
    { label: "Termos de Uso", href: "/terms#aceitacao-termos" }, // Link atualizado
    { label: "Política de Privacidade", href: "/privacy#informacoes-coletadas" }, // Link atualizado
    { label: "Suporte", href: "https://wa.link/adnlkj", external: true },
  ];

  const handleReloadPage = () => {
    window.location.reload();
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  // Reorganized Solutions links as requested
  const solutionsLinks = [
    { label: "Ferramentas", href: "#ferramentas" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Planos", href: "#planos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Suporte", href: "https://wa.link/adnlkj", external: true },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="bg-black border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Coluna 1: Logo e Social */}
          <div className="space-y-6 flex flex-col items-center text-center"> {/* Centralizado no mobile */}
            <button onClick={handleReloadPage} className="flex justify-center"> {/* Centralizado o botão do logo */}
              <img 
                src="/lovable-uploads/logo-lucraai-fox-new.png"
                alt="LucraAI Logo" 
                className="h-14 w-auto transition-transform duration-300 hover:scale-105 rounded-lg"
              />
            </button>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-center"> {/* Centralizado o texto */}
              O primeiro App brasileiro que combina IA avançada com Automação inteligente 
              para transformar a precificação do seu negócio em minutos.
            </p>
            
            <div className="flex gap-4 justify-center w-full"> {/* Centralizado os ícones sociais */}
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

          {/* Coluna 2: Soluções (Centralizada no desktop) */}
          <div className="md:flex md:justify-center text-center md:text-left"> {/* Centralizado no mobile */}
            <div>
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

          {/* Coluna 3: Legal (Alinhada à direita no desktop) */}
          <div className="md:flex md:justify-end text-center md:text-left"> {/* Centralizado no mobile */}
            <div>
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