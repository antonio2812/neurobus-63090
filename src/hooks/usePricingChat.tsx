import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// --- Tipos de Dados ---
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
    category: string | null;
    weight: number | null;
    weightUnit: 'g' | 'kg';
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

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- Hook Implementation ---

export const usePricingChat = (marketplace: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cost, setCost] = useState<number | null>(null);
  const [additionalCost, setAdditionalCost] = useState<number>(0);
  const [adType, setAdType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('kg');
  const { toast } = useToast();
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou a IA de Precificação da LucraAI. Vamos calcular o preço ideal para o seu produto no **${marketplace}**!`,
  };
  
  const initialStep = marketplace === 'Mercado Livre' ? 'select_ad_type' : 'select_category';
  const [step, setStep] = useState<ChatStep>(initialStep);

  const handleNewPricing = useCallback(() => {
    setCost(null);
    setAdditionalCost(0);
    setAdType(null);
    setSelectedCategory(null);
    setWeight(null);
    setWeightUnit('kg');
    
    const newInitialStep = marketplace === 'Mercado Livre' ? 'select_ad_type' : 'select_category';
    setStep(newInitialStep);
    
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
  }, [marketplace]);

  useEffect(() => {
    // Initialize chat on mount or marketplace change
    handleNewPricing();
  }, [marketplace, handleNewPricing]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionSelect = (value: string) => {
    if (step === 'select_ad_type') {
      setAdType(value);
      setStep('select_category');
      
      // Add user response
      setMessages((prev) => [
        ...prev.filter(msg => !msg.options),
        { id: Date.now(), sender: 'user', content: `Tipo de anúncio: ${value}` },
      ]);

      // Next question: Category
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
      
      // Add user response
      setMessages((prev) => [
        ...prev.filter(msg => !msg.options),
        { id: Date.now(), sender: 'user', content: `Categoria: ${value}` },
      ]);

      // Next question: Weight
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
      const rawInput = userMessage.content.toLowerCase();
      let numericValue: number;
      let unit: 'g' | 'kg' = 'kg';
      let valueInKg: number;

      const isGram = rawInput.includes('g');
      const isKg = rawInput.includes('kg');
      
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
      
      if (isGram && !isKg) {
        valueInKg = numericValue / 1000;
        unit = 'g';
      } else if (isKg || (numericValue >= 10 && !isGram)) {
        valueInKg = numericValue;
        unit = 'kg';
      } else if (numericValue < 10 && !isGram) {
        valueInKg = numericValue;
        unit = 'kg';
      } else {
        valueInKg = numericValue;
        unit = 'kg';
      }
      
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
      const rawInput = userMessage.content.replace('R$', '').replace('.', '').replace(',', '.');
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
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            content: "Calculando... Aguarde um momento enquanto a IA processa as taxas e custos do Marketplace.",
            isTyping: true,
          },
        ]);

        try {
          const { data, error } = await supabase.functions.invoke('calculate-price', {
            body: {
              marketplace,
              cost,
              margin,
              adType: adType,
              additionalCost,
              category: selectedCategory,
              weight,
              weightUnit,
            },
          });

          if (error) throw error;
          
          if (!data || !data.success) {
            throw new Error(data?.error || 'Erro ao processar cálculo');
          }
          
          const finalCalculation = {
              ...data.calculation,
              details: {
                  ...data.calculation.details,
                  weightUnit: weightUnit,
              }
          };

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
          
          if (e instanceof Error) {
              errorMessage = errorMessage.includes("Erro desconhecido") ? e.message : errorMessage;
              if (errorMessage.includes("Edge Function returned a non-2xx status code")) {
                  errorMessage = "Ocorreu um erro interno no servidor da IA. Por favor, verifique se a chave GOOGLE_GEMINI_API_KEY está configurada corretamente.";
              }
          }
          
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
  
  // Determine input placeholder
  const inputPlaceholder = (() => {
    if (step === 'done') return "Precificação concluída.";
    if (step === 'select_category' || step === 'select_ad_type') return "Selecione uma opção acima...";
    if (step === 'weight' || step === 'cost' || step === 'additional_cost' || step === 'margin') return "Digite aqui...";
    return "Digite aqui...";
  })();
  
  // Determine if input should be disabled
  const isInputDisabled = isLoading || step === 'done' || step === 'select_category' || step === 'select_ad_type';

  return {
    messages,
    input,
    setInput,
    isLoading,
    step,
    categories,
    chatEndRef,
    inputPlaceholder,
    isInputDisabled,
    handleSend,
    handleOptionSelect,
    handleNewPricing,
  };
};