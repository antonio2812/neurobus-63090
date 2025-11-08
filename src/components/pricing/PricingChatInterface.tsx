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
    category: string | null; // NOVO
    weight: number | null; // NOVO
    weightUnit: 'g' | 'kg'; // NOVO
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

type ChatStep = 'select_ad_type' | 'select_category' | 'weight' | 'cost' | 'additional_cost' | 'margin' | 'done';

const categories = [
  "Perfumaria & cosméticos (beleza)",
  "Alimentos e bebidas",
  "Saúde e bem-estar",
  "Eletrônicos & gadgets",
  "Utensílios para casa & decoração",
  "Moda & acessórios (roupas, calçados)",
  "Produtos para bebê & criança",
  "Esportes & lazer ao ar livre",
  "Móveis & iluminação",
  "Pets & acessórios para animais",
  "Ferramentas & melhoramentos para a casa (DIY)",
  "Automotivo & peças para veículos",
  "Livros, música & entretenimento",
  "Alimentos funcionais ou suplementos",
  "Produtos importados",
];

const PricingChatInterface = ({ marketplace, onBack }: PricingChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Define o passo inicial: se for Mercado Livre, começa em 'select_ad_type', senão, em 'select_category'
  const [step, setStep] = useState<ChatStep>(marketplace === 'Mercado Livre' ? 'select_ad_type' : 'select_category'); 
  const [cost, setCost] = useState<number | null>(null);
  const [additionalCost, setAdditionalCost] = useState<number>(0);
  const [adType, setAdType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('kg');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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
    
    // Lógica da primeira pergunta
    setTimeout(() => {
      if (marketplace === 'Mercado Livre') {
        setMessages((prev) => [
          ...prev,
          {
            id: 1,
            sender: 'ai',
            content: "Para o **Mercado Livre**, qual **tipo de anúncio** você deseja usar? (Isso afeta as taxas de comissão)",
            options: [
              // TEXTOS ATUALIZADOS AQUI
              { label: "Clássico (14% de taxa)", value: "Clássico" },
              { label: "Premium (18% de taxa)", value: "Premium" },
            ]
          }
        ]);
      } else {
        // Se não for Mercado Livre, vai direto para a categoria
        setMessages((prev) => [
          ...prev,
          {
            id: 1,
            sender: 'ai',
            content: "Para começar, qual é a **Categoria do Produto** que você deseja precificar?",
          }
        ]);
      }
    }, 500);
  }, [marketplace]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionSelect = (value: string) => {
    if (step === 'select_ad_type') {
      setAdType(value);
      setStep('select_category');
      
      // Adiciona a resposta do usuário
      setMessages((prev) => [
        ...prev.filter(msg => !msg.options),
        { id: Date.now(), sender: 'user', content: `Tipo de anúncio: ${value}` },
      ]);

      // Próxima pergunta: Categoria
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            content: "Certo. Agora, qual é a **Categoria do Produto** que você deseja precificar?",
          }
        ]);
      }, 500);
      
    } else if (step === 'select_category') {
      setSelectedCategory(value);
      setStep('weight');
      
      // Adiciona a resposta do usuário
      setMessages((prev) => [
        ...prev.filter(msg => !msg.options),
        { id: Date.now(), sender: 'user', content: `Categoria: ${value}` },
      ]);

      // Próxima pergunta: Peso
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            content: "Qual é o **peso do produto** em gramas ou quilogramas (g, kg)? (Apenas o valor, ex: 0.5 ou 2.3)",
          },
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: `<span class="text-foreground font-bold">Dica:</span> Se não souber, tente procurar no site do fornecedor. Se mesmo assim não encontrar, entre em contato com o fornecedor por WhatsApp ou E-mail.`,
          }
        ]);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || step === 'done' || step === 'select_category' || step === 'select_ad_type') return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: input.trim(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (step === 'weight') {
      const rawInput = input.trim().toLowerCase();
      let numericValue: number;
      let unit: 'g' | 'kg' = 'kg';
      let valueInKg: number;

      // 1. Tenta detectar a unidade (g ou kg)
      const isGram = rawInput.includes('g');
      const isKg = rawInput.includes('kg');
      
      // Remove letras e formatação (R$, vírgula)
      const cleanValue = rawInput.replace(/r\$/g, '').replace(/g|kg/g, '').replace('.', '').replace(',', '.').trim();
      numericValue = parseFloat(cleanValue);

      if (isNaN(numericValue) || numericValue < 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            content: "Ops! Por favor, insira um valor numérico válido e positivo (ex: 500g ou 0.5kg).",
          },
        ]);
        setIsLoading(false);
        return;
      }
      
      // 2. Determina a unidade e converte para KG
      if (isGram && !isKg) {
        // Se for grama, converte para kg (ex: 500g -> 0.5)
        valueInKg = numericValue / 1000;
        unit = 'g';
      } else if (isKg || (numericValue >= 10 && !isGram)) {
        // Se for kg (explicitamente ou se for um número grande sem unidade, assumimos kg)
        valueInKg = numericValue;
        unit = 'kg';
      } else if (numericValue < 10 && !isGram) {
        // Se for um número pequeno sem unidade, assumimos kg (ex: 0.5)
        valueInKg = numericValue;
        unit = 'kg';
      } else {
        // Fallback seguro (deve ser raro com a lógica acima)
        valueInKg = numericValue;
        unit = 'kg';
      }
      
      // 3. Armazena o peso em KG e a unidade original
      setWeight(valueInKg);
      setWeightUnit(unit);
      setStep('cost');
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            content: "Certo. Agora, qual é o **custo do produto** no fornecedor (apenas o valor, ex: 49,90)?",
          }
        ]);
      }, 500);
      setIsLoading(false);
      
    } else {
      // --- Passos de Custo, Custo Adicional e Margem ---
      
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
        
        // Nova pergunta sobre custos adicionais
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

      } else if (step === 'margin' && cost !== null && selectedCategory !== null && weight !== null) {
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
              category: selectedCategory,
              weight, // Peso já está em KG
              weightUnit, // Unidade original para a Edge Function usar na explicação
            },
          });

          if (error) throw error;
          
          if (!data || !data.success) {
            throw new Error(data?.error || 'Erro ao processar cálculo');
          }
          
          // Adiciona a unidade original ao objeto de cálculo retornado
          const finalCalculation = {
              ...data.calculation,
              details: {
                  ...data.calculation.details,
                  weightUnit: weightUnit,
              }
          };

          // Remover a mensagem de "calculando" e adicionar a resposta final
          setMessages((prev) => {
            const newMessages = prev.filter(msg => !msg.isTyping);
            return [
              ...newMessages,
              {
                id: Date.now() + 2,
                sender: 'ai',
                content: data.explanation,
                calculation: finalCalculation,
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Determina o placeholder do input
  const inputPlaceholder = (() => {
    if (step === 'done') return "Precificação concluída.";
    if (step === 'select_category' || step === 'select_ad_type') return "Selecione uma opção acima...";
    // Alterado para "Digite aqui..." para os passos de entrada de dados
    if (step === 'weight' || step === 'cost' || step === 'additional_cost' || step === 'margin') return "Digite aqui...";
    return "Digite aqui...";
  })();
  
  // Determina se o input deve estar desabilitado
  const isInputDisabled = isLoading || step === 'done' || step === 'select_category' || step === 'select_ad_type';

  const handleNewPricing = () => {
    // Resetar todos os estados
    setCost(null);
    setAdditionalCost(0);
    setAdType(null);
    setSelectedCategory(null);
    setWeight(null);
    setWeightUnit('kg');
    
    // Define o passo inicial: se for Mercado Livre, volta para 'select_ad_type', senão, para 'select_category'
    const initialStep = marketplace === 'Mercado Livre' ? 'select_ad_type' : 'select_category';
    setStep(initialStep);
    
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
            content: "Para o **Mercado Livre**, qual **tipo de anúncio** você deseja usar? (Isso afeta as taxas de comissão)",
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
            content: "Para começar, qual é a **Categoria do Produto** que você deseja precificar?",
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
        
        {/* Opções de Categoria (Aparece apenas no passo 'select_category') */}
        {step === 'select_category' && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left h-auto py-3 px-4 border-border text-foreground transition-all duration-300",
                  "hover:bg-accent hover:text-black hover:border-accent"
                )}
                onClick={() => handleOptionSelect(category)}
                disabled={isLoading}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
        
        {/* Opções de Ad Type (REMOVIDO DAQUI - AGORA É RENDERIZADO APENAS PELO CHATBUBBLE) */}
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 pt-0">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isInputDisabled}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-4" 
          />
          
          {/* Botão de Envio */}
          <Button 
            onClick={handleSend} 
            disabled={isInputDisabled || !input.trim()}
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