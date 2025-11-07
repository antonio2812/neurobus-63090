import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "A LucraAI é realmente gratuita?",
      answer: "Sim! Temos um plano Free completo para você começar. Você pode testar a plataforma sem custo e fazer upgrade quando precisar de mais recursos.",
    },
    {
      question: "Como funciona a precificação com IA?",
      answer: "Nossa IA analisa seus custos, taxas dos marketplaces, concorrência e demanda do mercado para sugerir o preço ideal que maximiza seu lucro mantendo competitividade.",
    },
    {
      question: "Quais marketplaces são suportados?",
      answer: "Integramos com Mercado Livre, Shopee, Amazon, Magalu, Shein e principais plataformas do Brasil. Novas integrações são adicionadas regularmente.",
    },
    {
      question: "Dá pra usar no celular e no computador ao mesmo tempo?", // NOVO
      answer: "Sim. Você pode acessar sua conta de qualquer dispositivo e seus dados ficam sincronizados automaticamente.", // NOVA RESPOSTA
    },
    {
      question: "Funciona em iPhone?",
      answer: "Sim! A LucraAI é 100% compatível com iPhone e todos os dispositivos iOS. Nossa plataforma web responsiva funciona perfeitamente no Safari e em todos os navegadores móveis, oferecendo a mesma experiência premium em qualquer dispositivo.",
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Absolutamente! Utilizamos criptografia SSL de ponta e seguimos os mais altos padrões de segurança. Seus dados nunca são compartilhados com terceiros.",
    },
    {
      question: "Posso testar antes de pagar?",
      answer: "Sim! Além do plano Free, oferecemos 7 dias de garantia em todos os planos pagos. Se não gostar, devolvemos 100% do seu dinheiro.",
    },
    {
      question: "Como cancelo minha assinatura?",
      answer: "Você pode cancelar a qualquer momento direto na plataforma. Só fazer login, clicar em \"Meu Perfil\" e depois em \"Cancelar assinatura\". Sem burocracias, sem multas e sem taxas.", // RESPOSTA ATUALIZADA
    },
    {
      question: "E se eu não gostar do app?", // NOVO
      answer: "Sem problema. Você pode cancelar a qualquer momento e, se estiver no plano Free, não paga nada pra experimentar.", // NOVA RESPOSTA
    },
    {
      question: "Tem suporte?",
      answer: "Sim! Todo nosso suporte é 100% em português. Planos Premium e Pro têm suporte prioritário.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-space-mono">
            FAQ
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perguntas frequentes sobre nossa plataforma completa de precificação.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 hover:border-accent/50 transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;