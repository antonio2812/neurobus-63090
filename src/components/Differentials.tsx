import { Brain, Target, TrendingUp, Zap, Search, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const Differentials = () => {
  const differentials = [
    {
      icon: Brain,
      title: "IA de Precificação",
      subtitle: "A LucraAI define o preço perfeito em segundos, considerando custos, taxas e margem desejada.",
    },
    {
      icon: Target,
      title: "Radar de Oportunidades Lucrativas",
      subtitle: "A LucraAI vasculha o mercado 24h e identifica oportunidades antes de virarem tendência.",
    },
    {
      icon: TrendingUp,
      title: "Previsão de Tendências com Automação",
      subtitle: "Antecipe o futuro das suas vendas com IA que prevê produtos em alta nas próximas semanas.",
    },
    {
      icon: Award, // Alterado para Award
      title: "Vantagem Competitiva Invisível",
      subtitle: "Saiba o que vender, quanto cobrar e quando agir — enquanto os concorrentes ainda testam.",
    },
    {
      icon: Search,
      title: "Caçador Automático de Lucro",
      subtitle: "A IA monitora o mercado e indica os produtos mais rentáveis e nichos pouco explorados.",
    },
  ];

  return (
    <section id="diferenciais" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            Nossos <span className="text-accent">Diferenciais</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O que torna a LucraAI única no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {differentials.map((diff, index) => (
            <Card 
              key={index}
              className="p-6 bg-gradient-card border-accent/30 hover:border-accent/50 transition-all duration-300 hover-lift group text-center cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                  <diff.icon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#ffc800' }}>
                    {diff.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {diff.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;