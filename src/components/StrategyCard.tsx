import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const strategies = [
  "Foque em títulos completos e estratégicos, utilizando as palavras-chave mais buscadas pelos clientes. Invista em fotos e vídeos de alta qualidade que mostrem os detalhes do produto e escreva descrições focadas em resolver as necessidades do comprador, usando listas para facilitar a leitura. Um anúncio otimizado é o primeiro passo para o ranqueamento.",
  "Sua reputação é crucial. Responda rapidamente às dúvidas dos clientes e trate reclamações com empatia. Priorize a agilidade no envio, despachando os pedidos em no máximo 24 horas, ou utilize os serviços de fulfillment (logística própria) do marketplace para obter maior visibilidade. O bom atendimento e a entrega rápida garantem avaliações positivas e a recompra.",
  "Mantenha um monitoramento constante dos preços dos concorrentes para garantir competitividade, mas nunca sacrifique a margem de lucro. Calcule rigorosamente todos os custos, incluindo frete e comissões, para definir um preço que seja lucrativo. Considere automatizar a precificação e, nas primeiras vendas, use margens reduzidas para construir reputação rapidamente.",
  "Utilize as ferramentas de publicidade interna dos marketplaces (Ads) para dar visibilidade inicial aos seus anúncios. Concentre o investimento em produtos que já possuem boas fotos e avaliações positivas para maximizar a conversão. Monitore o Retorno sobre o Investimento (ROI) de perto e use os Ads de forma intensiva em datas comemorativas e sazonais para aproveitar o aumento de tráfego.",
  "Não dependa de um único marketplace. Liste seus produtos em múltiplos canais (Mercado Livre, Shopee, Amazon, Magalu, Shein) para diversificar riscos e alcançar um público maior. Use plataformas externas como Instagram e TikTok para gerar conteúdo orgânico e direcionar o tráfego de volta para os seus anúncios nos marketplaces, ajudando a construir sua marca e a fidelizar clientes.",
];

const StrategyCard = () => {
  const [currentStrategyIndex, setCurrentStrategyIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeDuration = 500; // 0.5s fade in/out
    const displayDuration = 10000; // 10 segundos para visualização (300000 ms = 5 minutos)

    const interval = setInterval(() => {
      // 1. Inicia o fade-out
      setIsFading(true);
      
      // 2. Troca o texto após o fade-out
      setTimeout(() => {
        setCurrentStrategyIndex((prevIndex) => (prevIndex + 1) % strategies.length);
        // 3. Inicia o fade-in
        setIsFading(false);
      }, fadeDuration);

    }, displayDuration);

    // Limpa o intervalo ao desmontar
    return () => clearInterval(interval);
  }, [strategies.length]);

  const currentText = strategies[currentStrategyIndex];

  return (
    <Card className="p-8 bg-gradient-card border-accent/30">
      <div className="text-center space-y-6">
        {/* Aplicando font-space-mono ao título */}
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-3 flex-wrap font-space-mono">
          <Lightbulb className="h-6 w-6 shrink-0" style={{ color: '#ffc800' }} />
          <span>
            Estratégias para Vender 
            <span style={{ color: '#ffc800' }} className="ml-1">+</span>
          </span>
        </h2>
        
        <div className="flex items-center justify-center min-h-[6rem]"> 
          <p 
            className={`text-muted-foreground max-w-3xl mx-auto text-lg transition-opacity duration-500 ${
              isFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            "{currentText}"
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StrategyCard;