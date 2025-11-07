import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn for conditional styling

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Definindo os recursos conforme solicitado
const premiumFeatures = [
  "Tudo do Plano PRO",
  "IA de Precificação de Produtos (Produtos ilimitados)",
  "Gerador de Títulos e Descrições com IA",
  "Espião de Tendências de Produtos",
  "Espião de Concorrência com Automação",
  "Gerador Inteligente de Kits (NOVO)",
  "Gerador de Imagens de Alta Qualidade e Conversão ilimitadas (NOVO)",
  "Buscador dos Melhores Fornecedores Nacionais e Importadoras (NOVO)",
  "Detector de Palavras Proibidas e Reprovação de Anúncios", // POSIÇÃO 9
  "Alertas de Datas Especiais + Produtos Minerados", // POSIÇÃO 10 (MOVIDO PARA BAIXO)
];

const proFeatures = [
  "IA de Precificação de Produtos (Até 1000 produtos)",
  "Gerador de Títulos e Descrições com IA",
  "Espião de Tendências de Produtos",
  "Espião de Concorrência com Automação",
  "Detector de Palavras Proibidas e Reprovação de Anúncios", // POSIÇÃO 5
  "Alertas de Datas Especiais + Produtos Minerados", // POSIÇÃO 6 (MOVIDO PARA BAIXO)
];


const rawPlans = [
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
    savings: undefined,
  },
  {
    name: "Premium",
    prices: { 
      mensal: 29.90, 
      anual: 289.88, 
      trimestral: 149.90, 
      semestral: 289.88 
    },
    savings: "Economize 33%",
    highlighted: true,
    badge: "Mais Vendido",
    available: true,
    order: 2,
    features: premiumFeatures, // Usando a lista atualizada
  },
  {
    name: "Pro",
    prices: { 
      mensal: 19.90, 
      anual: 173.88, 
      trimestral: 99.90, 
      semestral: 173.88 
    },
    savings: "Economize 20%",
    highlighted: false,
    available: true,
    order: 3,
    features: proFeatures, // Usando a lista atualizada
  },
];

// Sort plans once outside the component render cycle if possible, or ensure it's done robustly inside.
const sortedPlans = rawPlans.sort((a, b) => a.order - b.order);

// Mapeamento de período para texto de exibição
const periodDisplay: Record<keyof typeof rawPlans[0]['prices'], string> = {
  mensal: "mês",
  anual: "ano",
  trimestral: "trimestre",
  semestral: "semestre",
};


const Pricing = () => {
  const [period, setPeriod] = useState<"mensal" | "anual" | "trimestral" | "semestral">("mensal");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handlePeriodClick = (newPeriod: typeof period) => {
    const isComingSoon = newPeriod === "trimestral" || newPeriod === "semestral";
    setShowComingSoon(isComingSoon);
    setPeriod(newPeriod);
  };

  // Custom class for dark yellow hover effect
  const darkYellowHoverClass = "hover:bg-[hsl(48_100%_40%)]";

  const isAnnualOrComingSoon = period === "anual" || period === "trimestral" || period === "semestral";

  return (
    <section id="planos" className="py-12 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            Escolha seu <span style={{ color: '#ffc800' }}>Plano</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Planos que cabem no seu bolso. Resultados que mudam o seu negócio.
          </p>
        </div>

        {/* Period Selector - Refatorado para uma linha no desktop (md:flex-nowrap) e duas linhas no mobile (flex-wrap) */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap md:flex-nowrap max-w-md md:max-w-none mx-auto">
          
          {/* Mensal */}
          <Button
            variant={period === "mensal" ? "default" : "outline"}
            onClick={() => handlePeriodClick("mensal")}
            className={cn(
              period === "mensal" ? "bg-accent text-accent-foreground" : "", 
              "hover:border-accent transition-all duration-300", 
              "w-[calc(50%-8px)] md:w-auto", // 50% width on mobile
              darkYellowHoverClass
            )}
          >
            Mensal
          </Button>
          
          {/* Anual */}
          <Button
            variant={period === "anual" ? "default" : "outline"}
            onClick={() => handlePeriodClick("anual")}
            className={cn(
              period === "anual" ? "bg-accent text-accent-foreground" : "", 
              "hover:border-accent transition-all duration-300", 
              "w-[calc(50%-8px)] md:w-auto", // 50% width on mobile
              darkYellowHoverClass
            )}
          >
            Anual
          </Button>
          
          {/* Trimestral */}
          <Button
            variant={period === "trimestral" ? "default" : "outline"}
            onClick={() => handlePeriodClick("trimestral")}
            className={cn(
              period === "trimestral" ? "bg-accent text-accent-foreground" : "", 
              "hover:border-accent transition-all duration-300", 
              "w-[calc(50%-8px)] mt-4 md:mt-0 md:w-auto", // 50% width and mt-4 on mobile, reset on desktop
              darkYellowHoverClass
            )}
          >
            Trimestral
          </Button>
          
          {/* Semestral */}
          <Button
            variant={period === "semestral" ? "default" : "outline"}
            onClick={() => handlePeriodClick("semestral")}
            className={cn(
              period === "semestral" ? "bg-accent text-accent-foreground" : "", 
              "hover:border-accent transition-all duration-300", 
              "w-[calc(50%-8px)] mt-4 md:mt-0 md:w-auto", // 50% width and mt-4 on mobile, reset on desktop
              darkYellowHoverClass
            )}
          >
            Semestral
          </Button>
        </div>

        {/* Plans Grid Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Plans Grid - Aumentando o gap para gap-12 no mobile */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 transition-all duration-500 relative z-10",
            showComingSoon ? 'opacity-30 blur-lg pointer-events-none' : ''
          )}>
            {Array.isArray(sortedPlans) && sortedPlans.map((plan, index) => (
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
                      {/* Adicionando a estrela preta */}
                      <Star className="h-4 w-4 fill-black text-black" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">
                      R$ {plan.prices[period].toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-muted-foreground">
                      /{periodDisplay[period]}
                    </span>
                  </div>
                  
                  {isAnnualOrComingSoon && plan.savings && (
                    <p className="text-sm font-semibold mt-1" style={{ color: '#ffc800' }}>
                      {plan.savings}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {Array.isArray(plan.features) && plan.features.map((feature, i) => (
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
          
          {/* Coming Soon Alert Box - Z-index ajustado para z-40 */}
          {showComingSoon && (
            <div className="absolute inset-0 z-40 flex items-center justify-center">
              <div className="inline-block px-10 py-6 bg-card/90 border-2 border-accent rounded-xl shadow-2xl text-center backdrop-blur-sm">
                <p className="text-accent font-bold text-2xl">MUITO EM BREVE</p>
                <p className="text-foreground text-xl mt-2">Novos planos chegando!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Texto informativo adicionado aqui */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todos os planos incluem suporte ao cliente. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;