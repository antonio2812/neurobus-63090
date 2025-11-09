import { Card } from "@/components/ui/card";
import { useInViewAnimation } from "@/hooks/use-in-view-animation";
import { cn } from "@/lib/utils";

const LatestReleases = () => {
  const rawReleases = [
    {
      title: "Gerador Inteligente de Kits",
      description: "Crie combinações automáticas de produtos que aumentam o ticket médio.",
      image: "/lovable-uploads/Funcionalidade - Gerador Inteligente de Kits.png", // CAMINHO ATUALIZADO
      order: 1,
    },
    {
      title: "Gerador de Imagens com IA", // NOVO CARD
      description: "Crie fotos de alta qualidade e conversão para os seus produtos em segundos.",
      image: "/lovable-uploads/Funcionalidade - Gerador de Imagens com IA.png", // CAMINHO ATUALIZADO
      order: 2,
    },
    {
      title: "Buscador dos Melhores Fornecedores Nacionais e Importadoras",
      description: "Encontre Parceiros Comerciais com facilidade, confiáveis e com os melhores preços.",
      image: "/lovable-uploads/Funcionalidade - Buscador de Fornecedores Nacionais e Importadoras.png", // CAMINHO ATUALIZADO
      order: 3,
    },
  ];

  // Ordem solicitada: Kits (0), Imagens (1), Fornecedores (2)
  const releases = [
    rawReleases[0], // Gerador Inteligente de Kits
    rawReleases[1], // Gerador de Imagens com IA
    rawReleases[2], // Buscador de Fornecedores
  ];

  const { ref: sectionRef, isInView } = useInViewAnimation(0.1);

  return (
    <section id="lancamentos" ref={sectionRef} className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            Últimos <span className="text-accent">Lançamentos</span>
          </h2>
        </div>

        {/* Layout 1 coluna (empilhado) - Aumentando max-w para 5xl */}
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          {releases.map((release, index) => (
            <Card 
              key={index}
              className={cn(
                "p-6 bg-card border-border hover:border-accent/50 transition-all duration-700 hover-lift group cursor-pointer flex flex-col",
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: isInView ? `${0.1 + index * 0.15}s` : '0s' }}
            >
              <div className="space-y-6">
                {/* Título e Descrição */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {release.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
                    {release.description}
                  </p>
                </div>
                
                {/* Imagem Grande e Responsiva - Altura ajustada para ser mais responsiva e menos alta */}
                <div className="w-full h-auto rounded-lg overflow-hidden border border-border/50 shadow-lg">
                  <img 
                    src={release.image} 
                    alt={release.title} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestReleases;