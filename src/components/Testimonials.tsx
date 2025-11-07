import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useInViewAnimation } from "@/hooks/use-in-view-animation";
import { cn } from "@/lib/utils";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana Paula",
      role: "Vendedora no Mercado Livre",
      image: "/lovable-uploads/testimonial-ana-new.jpg", // Updated path
      imagePosition: "object-center", // Adjusted to object-center to show full face
      rating: 5,
      text: "Aumentei meu lucro em 40% no primeiro mês! A LucraAI me mostrou que eu estava vendendo abaixo do preço ideal. Recomendo muito!",
    },
    {
      name: "Carlos Mendes",
      role: "Loja Online Shopee",
      image: "/lovable-uploads/testimonial-carlos.jpeg",
      rating: 4.5,
      text: "Interface super simples e intuitiva. Não preciso mais passar horas fazendo cálculos em planilhas. A IA faz tudo automaticamente.",
    },
    {
      name: "Juliana Costa",
      role: "Vendedora Mercado Livre",
      image: "/lovable-uploads/testimonial-juliana.jpg",
      rating: 4,
      text: "A integração com os marketplaces é perfeita. Consigo gerenciar todos os meus produtos em um só lugar e ainda tenho alertas de preços.",
    },
    {
      name: "Roberto Santos",
      role: "E-commerce Amazon",
      image: "/lovable-uploads/testimonial-roberto.jpeg",
      rating: 4.5, // Changed from 5 to 4.5
      text: "ROI incrível! Paguei o plano Premium e recuperei o investimento em menos de uma semana com o aumento das margens de lucro.",
    },
    {
      name: "Mariana Oliveira",
      role: "Revendedora Digital",
      image: "/lovable-uploads/testimonial-mariana.jpg",
      imagePosition: "object-[center_15%]",
      rating: 4.5,
      text: "O suporte é excelente e sempre me ajudam com dúvidas. A plataforma realmente entrega o que promete. Vale cada centavo!",
    },
    {
      name: "Felipe Santos",
      role: "Vendedor Shopee", // Changed role
      image: "/lovable-uploads/testimonial-felipe.jpeg",
      rating: 4,
      text: "A IA de precificação realmente funciona! Em 3 semanas consegui identificar produtos que estava vendendo muito abaixo do mercado. Minha margem de lucro aumentou 35% desde que comecei a usar.",
    },
  ];

  const { ref: sectionRef, isInView } = useInViewAnimation(0.1);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-accent text-accent" />);
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-5 w-5 text-accent" />
          <Star className="h-5 w-5 fill-accent text-accent absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }
    return stars;
  };

  return (
    <section ref={sectionRef} id="depoimentos" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            Quem usa, confia e lucra
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja como as pessoas estão transformando seus negócios com a LucraAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={cn(
                "p-6 bg-card border-border hover:border-accent/50 transition-all duration-700 hover-lift cursor-pointer",
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: isInView ? `${0.1 + index * 0.15}s` : '0s' }}
            >
              <div className="flex items-start gap-4 mb-4">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className={`w-14 h-14 rounded-full object-cover ${testimonial.imagePosition || 'object-top'}`}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                "{testimonial.text}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;