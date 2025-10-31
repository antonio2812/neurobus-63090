import { Zap, Shield, TrendingUp, CheckCircle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

const WhyChoose = () => {
  const reasons = [
    {
      icon: Zap,
      title: "Inovação Tech",
      description: "Primeiro App Brasileiro a usar IA especializada em Precificação.",
    },
    {
      icon: Shield,
      title: "Confiança Comprovada",
      description: "Regulamentado pela CVM, parceiro de grandes corretoras brasileiras.",
    },
    {
      icon: DollarSign, // Changed icon to DollarSign
      title: "Resultados a Longo Prazo",
      description: "Usuários ativos há menos de 3 meses tiveram rentabilidade média de 280% superior ao ano passado.",
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space-mono">
            Por que escolher a LucraAI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enquanto muitos oferecem apenas planilhas e gráficos complicados, 
            nós entregamos uma plataforma completa, intuitiva e com linguagem simples. 
            Aqui, você não precisa ser um expert para precificar melhor os seus produtos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reasons.map((reason, index) => (
            <Card 
              key={index}
              className="p-8 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                  <reason.icon className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-card border-accent/30 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-accent/10">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Garantia de Satisfação
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                7 dias para testar sem riscos. Se não ficar satisfeito, devolvemos 100% do investimento.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WhyChoose;