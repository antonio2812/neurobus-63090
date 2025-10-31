import { Award, Shield, Trophy, Lock, ShieldCheck, CircleCheck } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Lock,
      title: "Certificado SSL Seguro",
      description: "Sua segurança é inegociável. Nosso site conta com Certificado SSL, protegendo todos os seus dados com criptografia de ponta. Transações 100% seguras.",
    },
    {
      icon: Award,
      title: "Parceiro Oficial",
      description: "Reconhecimento internacional que gera confiança. Como Parceiro Oficial da Google e OpenAI, temos acesso a ferramentas exclusivas, validação global de nossas práticas e respaldo das instituições mais respeitadas do mundo.",
    },
    {
      icon: ShieldCheck,
      title: "Garantia de Satisfação",
      description: "Compromisso total com sua satisfação. Teste sem riscos: se o resultado não superar suas expectativas, garantimos a devolução do seu dinheiro. Simples assim.",
    },
    {
      icon: CircleCheck,
      title: "Verificado por Terceiros",
      description: "A LucraAI é validada com base nos padrões mais altos do mercado. Reconhecimento de líderes como Google e OpenAI. Processos auditados de forma independente, garantindo transparência e segurança.",
    },
    {
      icon: Trophy,
      title: "Prêmio de Excelência",
      description: "Reconhecidos pelo alto padrão. Em setembro de 2025, fomos premiados por nossa performance, inovação e impacto no setor financeiro.",
    },
  ];

  // Duplicate badges for infinite scroll effect
  const allBadges = [...badges, ...badges];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      
      <div className="relative z-10 overflow-hidden">
        <div className="flex animate-scroll hover:pause">
          {allBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-4 mx-8 flex-shrink-0 group cursor-pointer min-w-[300px]"
            >
              <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                <badge.icon className="h-6 w-6 text-accent" />
              </div>
              <div className="text-center">
                <span className="text-foreground font-semibold text-lg whitespace-nowrap block mb-2">
                  {badge.title}
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;