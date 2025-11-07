import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatBubble from "./ChatBubble"; // Importando o novo componente
import CalculationDetails from "./CalculationDetails"; // Importando o novo componente

interface PricingChatInterfaceProps {
  marketplace: string;
  onBack: () => void;
}

// Tipos de dados (mantidos aqui para o componente principal)
interface CalculationResult {
  idealSalePrice: number;
  netProfit: number;
  netMargin: number;
  details: {
    marketplace: string;
    cost: number;
    desiredMargin: number;
    fixedFee: number;
    freightFee: number;
    commissionRate: number;
    commissionValue: number;
    totalCosts: number;
    commissionLimit: boolean;
    adType: string | null;
    additionalCost: number;
  };
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  calculation?: CalculationResult;
  isTyping?: boolean;
  options?: { label: string, value: string }[];
  isAlert?: boolean;
}

type ChatStep = 'ad_type' | 'cost' | 'additional_cost' | 'margin' | 'done';

const PricingChatInterface = ({ marketplace, onBack }: PricingChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('cost');
  const [cost, setCost] = useState<number | null>(null);
  const [additionalCost, setAdditionalCost] = useState<number>(0);
  const [adType, setAdType] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou a IA de Precificação da LucraAI. Vamos calcular o preço ideal para o seu produto no **${marketplace}**!`,
  };

  useEffect(() => {
    const initialMessages: ChatMessage[] = [initialMessage];
    
    if (marketplace === "Facebook") {
      initialMessages.push({
        id: 0.5,
        sender: 'ai',
        content: `Vantagem Facebook: Venda sem taxas! Seu lucro é **100% maior** neste marketplace, garantindo mais faturamento.`,
        isAlert: true,
      });
    }

    setMessages(initialMessages);
    
    if (marketplace === "Mercado Livre") {
      setStep('ad_type');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 1,
            sender: 'ai',
            content: "Para o Mercado Livre, qual **tipo de anúncio** você deseja usar?",
            options: [
              { label: "Clássico (14% de taxa)", value: "Clássico" },
              { label: "Premium (18% de taxa)", value: "Premium" },
            ]
          }
        ]);
      }, 500);
    } else {
      setStep('cost');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 1,
            sender: 'ai',
            content: "Para começar, qual é o **custo do produto** no fornecedor (apenas o valor, ex: 49,90)?",
          }
        ]);
      }, 500);
    }
  }, [marketplace]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleOptionSelect = (value: string) => {
    if (step === 'ad_type') {
      setAdType(value);
      setStep('cost');
      
      // Adiciona a resposta do usuário
      setMessages((prev) => [
        ...prev.filter(msg => !msg.options),
        { id: Date.now(), sender: 'user', content: `Tipo de anúncio: ${value}` },
      ]);

      // Próxima pergunta
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            content: "Ótimo. Agora, qual é o **custo do produto** no fornecedor (apenas o valor, ex: 49,90)?",
          }
        ]);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || step === 'done' || step === 'ad_type') return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: input.trim(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Tenta extrair o valor numérico (aceita R$ e vírgula)
    const rawInput = input.trim().replace('R$', '').replace('.', '').replace(',', '.');
    const numericValue = parseFloat(rawInput);

    if (isNaN(numericValue) || numericValue < 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: "Ops! Por favor, insira um valor numérico válido e positivo (ou zero).",
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (step === 'cost') {
      setCost(numericValue);
      setStep('additional_cost');
      
      // Nova pergunta sobre custos adicionais (TEXTO ATUALIZADO AQUI)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: `Certo, ${formatCurrency(numericValue)} de custo. Agora, você possui algum **custo adicional** na sua operação, como envios pelos Correios ou ponto de coleta, embalagens, impressão de etiquetas e notas fiscais, devoluções ou custos de importação (caso compre de plataformas como Alibaba ou AliExpress)? (Apenas o valor total, ex: 15,00 ou 0 em caso de nenhum).`,
        },
      ]);
      setIsLoading(false);
      
    } else if (step === 'additional_cost' && cost !== null) {
      setAdditionalCost(numericValue);
      setStep('margin');
      
      // Pergunta sobre margem
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: `Entendido, ${formatCurrency(numericValue)} em custos adicionais. Por fim, qual é a **margem de lucro desejada** (apenas o percentual, ex: 30)?`,
        },
      ]);
      setIsLoading(false);

    } else if (step === 'margin' && cost !== null) {
      const margin = numericValue;
      setStep('done');
      
      // Adicionar mensagem de "calculando"
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: "Calculando... Aguarde um momento enquanto a IA processa as taxas e custos do Marketplace.",
          isTyping: true,
        },
      ]);

      // Chamar a Edge Function
      try {
        const { data, error } = await supabase.functions.invoke('calculate-price', {
          body: {
            marketplace,
            cost,
            margin,
            adType: adType,
            additionalCost,
          },
        });

        if (error) throw error;
        
        if (!data || !data.success) {
          throw new Error(data?.error || 'Erro ao processar cálculo');
        }
        
        // Remover a mensagem de "calculando" e adicionar a resposta final
        setMessages((prev) => {
          const newMessages = prev.filter(msg => !msg.isTyping);
          return [
            ...newMessages,
            {
              id: Date.now() + 2,
              sender: 'ai',
              content: data.explanation,
              calculation: data.calculation,
            },
          ];
        });

      } catch (e) {
        console.error("Erro ao calcular preço:", e);
        
        let errorMessage = "Erro desconhecido na comunicação com a IA.";
      
        const errorObject = e as any; 
        
        // Tenta extrair a mensagem de erro detalhada do corpo da resposta da Edge Function
        if (errorObject.context && errorObject.context.body) {
            try {
                const errorBody = JSON.parse(errorObject.context.body);
                if (errorBody.error) {
                    errorMessage = errorBody.error;
                }
            } catch (parseError) {
                console.error("Failed to parse error body:", parseError);
            }
        }
        
        // Se for um erro de Edge Function, usa a mensagem de erro retornada
        if (e instanceof Error) {
            errorMessage = errorMessage.includes("Erro desconhecido") ? e.message : errorMessage;
            
            // Se o erro for o genérico de status, simplifica a mensagem para o usuário
            if (errorMessage.includes("Edge Function returned a non-2xx status code")) {
                errorMessage = "Ocorreu um erro interno no servidor da IA. Por favor, verifique se a chave GOOGLE_GEMINI_API_KEY está configurada corretamente.";
            }
        }
        
        // Remove a mensagem de carregamento e adiciona uma mensagem de erro
        setMessages((prev) => {
          const newMessages = prev.filter(msg => !msg.isTyping);
          return [
            ...newMessages,
            {
              id: Date.now() + 4,
              sender: 'ai',
              content: `❌ Erro: Não foi possível calcular o preço. ${errorMessage}. Por favor, tente novamente.`,
            },
          ];
        });
        
        toast({
          title: "Erro de Cálculo",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Determina o placeholder do input (ALTERADO AQUI)
  const inputPlaceholder = (() => {
    if (step === 'done') return "Precificação concluída.";
    if (step === 'ad_type') return "Selecione o tipo de anúncio acima...";
    return "Digite aqui...";
  })();

  const handleNewPricing = () => {
    setStep(marketplace === 'Mercado Livre' ? 'ad_type' : 'cost');
    setCost(null);
    setAdditionalCost(0);
    setAdType(null);
    
    const newInitialMessages: ChatMessage[] = [initialMessage];
    if (marketplace === "Facebook") {
      newInitialMessages.push({
        id: Date.now() + 3,
        sender: 'ai',
        content: `Vantagem Facebook: Venda sem taxas! Seu lucro é **100% maior** neste marketplace, garantindo mais faturamento.`,
        isAlert: true,
      });
    }
    setMessages(newInitialMessages);
    
    setTimeout(() => {
      if (marketplace === 'Mercado Livre') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 4,
            sender: 'ai',
            content: "Para o Mercado Livre, qual **tipo de anúncio** você deseja usar?",
            options: [
              { label: "Clássico (14% de taxa)", value: "Clássico" },
              { label: "Premium (18% de taxa)", value: "Premium" },
            ]
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 4,
            sender: 'ai',
            content: "Qual é o **custo do produto** no fornecedor (apenas o valor, ex: 49,90)?",
          }
        ]);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          // ALTERADO: Removendo border-transparent e ajustando hover para ter borda
          className="text-muted-foreground hover:text-black hover:bg-accent transition-colors duration-300 border border-transparent hover:border-accent" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono">
          Precificação IA: {marketplace}
        </h3>
        <div className="w-10 h-10"></div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            onOptionSelect={handleOptionSelect} 
            isLoading={isLoading} 
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 pt-0">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || step === 'done' || step === 'ad_type'}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-4" 
          />
          
          {/* Botão de Envio */}
          <Button 
            onClick={handleSend} 
            disabled={isLoading || step === 'done' || step === 'ad_type' || !input.trim()}
            size="icon"
            className="h-10 w-10 mr-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {step === 'done' && (
          <Button 
            variant="link" 
            onClick={handleNewPricing}
            className="w-full mt-2 text-accent hover:text-accent/80"
          >
            Nova Precificação
          </Button>
        )}
      </div>
    </div>
  );
};

export default PricingChatInterface;