import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn for conditional styling

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Pricing = () => {
  const [period, setPeriod] = useState<"mensal" | "anual" | "trimestral" | "semestral">("mensal");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const premiumFeatures = [
    "Tudo do Plano PRO",
    "IA de Precificação de Produtos (Produtos ilimitados)",
    "Gerador de Títulos e Descrições com IA",
    "Espião de Tendências de Produtos",
    "Espião de Concorrência com Automação",
    "Gerador Inteligente de Kits",
    "Detector de Palavras Proibidas e Reprovação de Anúncios",
    "Alertas de Datas Especiais + Produtos Minerados",
    "Relatórios Mensais de Lucro e Crescimento de Faturamento",
  ];

  const plans = [
    {
      name: "Free",
      prices: { mensal: 0, anual: 0, trimestral: 0, semestral: 0 },
      features: [
        "IA de Precificação de Produtos (até 100 produtos)",
        "Alertas de Datas Especiais + Produtos Minerados",
      ],
      highlighted: false,
      available: true,
      order: 1,
    },
    {
      name: "Premium",
      prices: { mensal: 24.90, anual: 24.90, trimestral: 24.90, semestral: 24.90 },
      features: premiumFeatures, // Updated features
      highlighted: true,
      badge: "Mais Vendido",
      available: true,
      order: 2,
    },
    {
      name: "Pro",
      prices: { mensal: 14.90, anual: 14.90, trimestral: 14.90, semestral: 14.90 },
      features: [
        "IA de Precificação (até 1000 produtos)",
        "Gerador de Títulos e Descrições com IA",
        "Espião de Tendências de Produtos",
        "Alertas de Datas Especiais + Produtos Minerados",
        "Relatórios Mensais de Lucro e Crescimento de Faturamento",
      ],
      highlighted: false,
      available: true,
      order: 3,
    },
  ];
  
  // Sort plans by the new 'order' property: Free (1), Premium (2), Pro (3)
  const sortedPlans = plans.sort((a, b) => a.order - b.order);


  const handlePeriodClick = (newPeriod: typeof period) => {
    const isComingSoon = newPeriod === "trimestral" || newPeriod === "semestral";
    setShowComingSoon(isComingSoon);
    setPeriod(newPeriod);
  };

  // Custom class for dark yellow hover effect
  const darkYellowHoverClass = "hover:bg-[hsl(48_100%_40%)]";

  return (
    <section id="planos" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            Escolha seu <span className="text-accent">Plano</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Planos que cabem no seu bolso. Resultados que mudam o seu negócio.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <Button
            variant={period === "mensal" ? "default" : "outline"}
            onClick={() => handlePeriodClick("mensal")}
            className={cn(period === "mensal" ? "bg-accent text-accent-foreground" : "", "hover:border-accent transition-all duration-300", darkYellowHoverClass)}
          >
            Mensal
          </Button>
          <Button
            variant={period === "anual" ? "default" : "outline"}
            onClick={() => handlePeriodClick("anual")}
            className={cn(period === "anual" ? "bg-accent text-accent-foreground" : "", "hover:border-accent transition-all duration-300", darkYellowHoverClass)}
          >
            Anual
          </Button>
          <Button
            variant={period === "trimestral" ? "default" : "outline"}
            onClick={() => handlePeriodClick("trimestral")}
            className={cn(period === "trimestral" ? "bg-accent text-accent-foreground" : "", "hover:border-accent transition-all duration-300", darkYellowHoverClass)}
          >
            Trimestral
          </Button>
          <Button
            variant={period === "semestral" ? "default" : "outline"}
            onClick={() => handlePeriodClick("semestral")}
            className={cn(period === "semestral" ? "bg-accent text-accent-foreground" : "", "hover:border-accent transition-all duration-300", darkYellowHoverClass)}
          >
            Semestral
          </Button>
        </div>

        {/* Plans Grid Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Coming Soon Alert Box */}
          {showComingSoon && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="inline-block px-10 py-6 bg-card/90 border-2 border-accent rounded-xl shadow-2xl text-center">
                <p className="text-accent font-bold text-2xl">MUITO EM BREVE</p>
                <p className="text-foreground text-xl mt-2">Novos planos chegando!</p>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500",
            showComingSoon && 'opacity-30 blur-sm pointer-events-none'
          )}>
            {sortedPlans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative flex flex-col ${
                  plan.highlighted
                    ? "border-accent shadow-glow-accent scale-105"
                    : "border-border"
                } transition-all duration-300 hover-lift cursor-pointer`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-accent">
                      R$ {plan.prices[period].toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-muted-foreground">
                      /mês
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className={`w-full mt-auto ${
                    plan.highlighted ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""
                  }`}
                  size="lg"
                  onClick={() => {
                    if (showComingSoon) return;
                    window.location.href = '/auth';
                  }}
                  disabled={showComingSoon}
                >
                  {showComingSoon ? "Em Breve" : "Começar Agora"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;