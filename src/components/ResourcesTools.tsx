import { Brain, Sparkles, Bell, BarChart, Search, UserSearch, Eye, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import ResourceModal from "./ResourceModal";

const ResourcesTools = () => {
  // Imagens de exemplo para o modal (usando logos de marketplace como exemplo de integração)
  const marketplaceImages = [
    "/lovable-uploads/Logo Mercado Livre.png",
    "/lovable-uploads/Logo Shopee.jpeg",
    "/lovable-uploads/Logo Amazon.jpg",
    "/lovable-uploads/Logo Magalu.jpg",
    "/lovable-uploads/Logo Shein.jpg",
  ];

  // 6 Cards de funcionalidades, reorganizados e com novos ícones/descrições
  const features = [
    {
      icon: Brain,
      title: "Precificação de Produtos", // Alterado
      description: "Descubra o preço ideal automaticamente e maximize seus ganhos com base em custos, taxas e margem desejada.",
      modalImages: marketplaceImages,
      modalDescription: "A LucraAI se integra com os principais marketplaces para otimizar seus preços em tempo real.",
    },
    {
      icon: Sparkles,
      title: "Gerador de Títulos e Descrições", // Alterado
      description: "Conquiste mais cliques com textos prontos, persuasivos e otimizados para marketplaces.",
      modalImages: [],
      modalDescription: "Funcionalidade de visualização de exemplos em desenvolvimento.",
    },
    {
      icon: Eye, // ÍCONE ATUALIZADO: Eye
      title: "Espião de Tendências de Produtos",
      description: "Descubra o que vai bombar antes dos seus concorrentes.",
      modalImages: [],
      modalDescription: "Funcionalidade de visualização de exemplos em desenvolvimento.",
    },
    {
      icon: UserSearch, // ÍCONE ATUALIZADO: UserSearch
      title: "Espião de Concorrência", // Alterado
      description: "Monitore produtos, preços e estratégias dos concorrentes em tempo real.",
      modalImages: [],
      modalDescription: "Funcionalidade de visualização de exemplos em desenvolvimento.",
    },
    // NOVO CARD: Detector de Palavras Proibidas
    {
      icon: AlertTriangle, // Ícone de Alerta Profissional
      title: "Detector de Palavras Proibidas", 
      description: "Evite bloqueios e reprovações antes que prejudiquem suas vendas.",
      modalImages: [],
      modalDescription: "Funcionalidade de visualização de exemplos em desenvolvimento.",
    },
    {
      icon: Bell, // Ícone de sino de alerta
      title: "Datas Especiais + Produtos Minerados", // Alterado
      description: "Receba alertas inteligentes sobre oportunidades de produtos em datas lucrativas para vender mais.",
      modalImages: [],
      modalDescription: "Funcionalidade de visualização de exemplos em desenvolvimento.",
    },
    // O card "Relatórios Mensais de Lucro" foi removido.
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

        {/* Layout 3 colunas no desktop (lg:grid-cols-3) - Aumentando a largura máxima para 7xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <ResourceModal 
              key={index}
              title={feature.title} // Passando o título do card
              description={feature.modalDescription} 
              images={feature.modalImages}
            >
              <Card 
                className="p-8 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift group cursor-pointer text-center flex flex-col" 
              >
                <div className="space-y-4 flex-grow">
                  <div 
                    className="p-4 rounded-lg bg-accent/10 w-fit group-hover:bg-accent/20 transition-all duration-300 mx-auto"
                  >
                    <feature.icon className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Link "Toque aqui para ver" com sublinhado no hover */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <button
                    className="text-sm font-semibold transition-all duration-300 hover:text-accent relative group"
                    style={{ color: '#ffc800' }}
                  >
                    Toque aqui para ver
                    {/* Efeito de sublinhado branco no hover */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                  </button>
                </div>
              </Card>
            </ResourceModal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesTools;