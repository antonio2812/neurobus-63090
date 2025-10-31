import { Brain, Sparkles, TrendingUp, Eye, Box, AlertTriangle, Bell, BarChart, Radar } from "lucide-react";
import { Card } from "@/components/ui/card";

const ResourcesTools = () => {
  const features = [
    {
      icon: Brain,
      title: "IA de Precificação de Produtos",
      description: "Descubra o preço ideal automaticamente e maximize seus ganhos com base em custos, taxas e margem desejada.",
    },
    {
      icon: Sparkles,
      title: "Gerador de Títulos e Descrições com IA",
      description: "Conquiste mais cliques com textos prontos, persuasivos e otimizados para marketplaces.",
    },
    {
      icon: Radar, // Changed icon to Radar
      title: "Espião de Tendências de Produtos",
      description: "Descubra o que vai bombar antes dos seus concorrentes.",
    },
    {
      icon: Eye,
      title: "Espião de Concorrência com Automação",
      description: "Monitore produtos, preços e estratégias dos concorrentes em tempo real.",
    },
    {
      icon: Box,
      title: "Gerador Inteligente de Kits",
      description: "Crie combinações automáticas de produtos que aumentam o ticket médio.",
    },
    {
      icon: AlertTriangle,
      title: "Detector de Palavras Proibidas e Reprovação de Anúncios",
      description: "Evite bloqueios e reprovações antes que prejudiquem suas vendas.",
    },
    {
      icon: Bell,
      title: "Alertas de Datas Especiais + Produtos Minerados",
      description: "Receba alertas inteligentes sobre oportunidades sazonais e produtos lucrativos.",
    },
    {
      icon: BarChart,
      title: "Relatórios Mensais de Lucro e Crescimento de Faturamento",
      description: "Visualize seus resultados e veja seus lucros crescerem mês a mês.",
    },
  ];

  return (
    <section id="ferramentas" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            Recursos e <span className="text-accent">Ferramentas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para precificar com inteligência e lucrar mais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 w-fit group-hover:bg-accent/20 transition-all duration-300">
                  <feature.icon className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesTools;