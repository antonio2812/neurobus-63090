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
    { label: "Termos de Uso", href: "/terms" },
    { label: "Política de Privacidade", href: "/privacy" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-black border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <button onClick={scrollToTop} className="text-left">
              <img 
                src="/lovable-uploads/lucraia-logo-new.png" 
                alt="LucraAI Logo" 
                className="h-12 w-auto rounded-lg"
              />
            </button>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              O primeiro App brasileiro que combina IA avançada com Automação inteligente 
              para transformar a precificação do seu negócio em minutos.
            </p>
            
            <div className="flex gap-4">
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

          <div>
          <h3 className="text-foreground font-semibold mb-6">Soluções</h3>
          <ul className="space-y-3">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <a 
                  href={link.href}
                  className="text-muted-foreground hover:text-accent transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a 
                href="https://wa.link/adnlkj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Suporte
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-foreground font-semibold mb-6">Legal</h3>
          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  to={link.href}
                  className="text-muted-foreground hover:text-accent transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a 
                href="https://wa.link/adnlkj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Suporte
              </a>
            </li>
          </ul>
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
