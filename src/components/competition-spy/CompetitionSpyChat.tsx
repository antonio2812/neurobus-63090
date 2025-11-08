import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Search, Send, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface CompetitorInsight {
  competitorName: string;
  price: number;
  strategy: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  insights?: CompetitorInsight[];
  isTyping?: boolean;
}

interface CompetitionSpyChatProps {
  onBack: () => void;
}

type ChatStep = 'product_name' | 'done';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Função auxiliar para renderizar texto com negrito (markdown **)
const renderContentWithBold = (content: string) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const CompetitionSpyChat = ({ onBack }: CompetitionSpyChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('product_name');
  const [productName, setProductName] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const accentColor = "#ffc800";

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou o **Espião de Concorrência** da LucraAI. Para começar a monitorar o mercado, por favor, digite o **nome do produto** que você deseja analisar.`,
  };
  
  const tipMessage: ChatMessage = {
    id: 0.1,
    sender: 'ai',
    content: `<span class="text-foreground font-bold">Dica:</span> Quanto mais detalhes você informar como marca, modelo e características — mais preciso e estratégico serão os resultados gerados pela IA da LucraAI.`,
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage, tipMessage]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Componente auxiliar para renderizar os resultados
  const InsightDisplay = ({ insights }: { insights: CompetitorInsight[] }) => (
    <div className="mt-4 space-y-4">
      <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
        {/* Ícone Zap removido conforme solicitado */}
        Insights de Concorrência
      </h3>
      
      {insights.map((insight, index) => (
        <Card key={index} className="p-4 bg-background border-accent/30 shadow-inner space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
              {/* Ícone de lupa removido daqui */}
              {insight.competitorName}
            </h4>
            <span className="text-xl font-extrabold text-accent">
              {formatCurrency(insight.price)}
            </span>
          </div>
          
          <div className="space-y-1 ml-7">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Estratégia:</strong> {insight.strategy}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const handleAnalyzeCompetition = async (product: string, isInitial: boolean) => {
    if (!product) return;

    setIsLoading(true);
    
    const loadingMessageId = Date.now();
    
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        sender: 'ai',
        content: isInitial 
          ? `Monitorando o mercado... Pesquisando preços e estratégias dos concorrentes para **${product}** em tempo real.`
          : `Buscando mais 5 concorrentes para **${product}**...`,
        isTyping: true,
      },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('competition-spy', {
        body: { productName: product },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.insights) {
        throw new Error(data?.error || 'Erro ao processar a análise de concorrência.');
      }
      
      const newInsights: CompetitorInsight[] = data.insights;
      
      const aiResponseContent = isInitial 
        ? `Análise concluída! Encontrei ${newInsights.length} insights de concorrentes para **${product}**. Use essas informações para ajustar sua estratégia de preço e venda:`
        : `Mais ${newInsights.length} concorrentes encontrados.`;

      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Encontra a última mensagem que continha insights gerados (para adicionar mais)
        const lastInsightMessageIndex = newMessages.findIndex(msg => msg.insights);
        
        if (lastInsightMessageIndex !== -1) {
          // Se já existe conteúdo, atualiza o último bloco de insights
          const updatedMessages = [...newMessages];
          updatedMessages[lastInsightMessageIndex] = {
            ...updatedMessages[lastInsightMessageIndex],
            insights: [
              ...(updatedMessages[lastInsightMessageIndex].insights || []),
              ...newInsights
            ]
          };
          return [
            ...updatedMessages,
            // Adiciona a mensagem de sucesso após a atualização
            {
              id: Date.now() + 3,
              sender: 'ai',
              content: aiResponseContent,
            }
          ];
        }
        
        // Primeira geração
        return [
          ...newMessages,
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: aiResponseContent,
            insights: newInsights,
          },
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao analisar concorrência:", e);
      
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
      
      // Se for um erro de Edge Function, simplifica a mensagem para o usuário
      if (e instanceof Error) {
          errorMessage = errorMessage.includes("Erro desconhecido") ? e.message : errorMessage;
          
          // Se o erro for o genérico de status, simplifica a mensagem para o usuário
          if (errorMessage.includes("Edge Function returned a non-2xx status code")) {
              errorMessage = "Ocorreu um erro interno no servidor da IA. Por favor, verifique se a chave GOOGLE_GEMINI_API_KEY está configurada corretamente.";
          }
      }
      
      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        return [
          ...newMessages,
          {
            id: Date.now() + 4,
            sender: 'ai',
            content: `❌ Erro: Não foi possível analisar a concorrência. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      setStep('product_name');
      setProductName(null);
      
      toast({
        title: "Erro de Análise",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || step === 'done') return;

    const name = input.trim();
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: name,
    };
    
    setProductName(name);
    setInput(""); 

    setMessages((prev) => [...prev, userMessage]);

    await handleAnalyzeCompetition(name, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleNewSearch = () => {
    setStep('product_name');
    setProductName(null);
    setInput("");
    setMessages([initialMessage, tipMessage]);
  };
  
  const handleBuscarMais = () => {
    if (productName) {
      handleAnalyzeCompetition(productName, false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          // CLASSE ATUALIZADA: border-transparent hover:border-accent hover:bg-accent hover:text-black transition-all duration-300
          className="text-muted-foreground hover:text-black hover:bg-accent transition-all duration-300 border-transparent hover:border-accent" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1 flex items-center justify-center gap-2">
          {/* Ícone Zap removido daqui */}
          Espião de Concorrência
        </h3>
        <div className="w-10 h-10"></div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] p-3 shadow-none transition-all duration-300",
                msg.sender === 'ai'
                  ? 'bg-transparent text-foreground text-lg leading-relaxed'
                  : 'bg-card text-foreground rounded-xl rounded-br-sm text-base'
              )}
            >
              {msg.isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              ) : (
                // Renderiza o conteúdo usando a função segura
                msg.sender === 'ai' ? <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /> : msg.content
              )}
              
              {msg.insights && <InsightDisplay insights={msg.insights} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        
        {/* Botão Buscar + (Aparece após a conclusão) */}
        {step === 'done' && !isLoading && (
          <div className="flex justify-center pt-4 pb-2 space-x-4">
            <Button
              variant="outline"
              className="bg-card border-accent text-white hover:bg-accent hover:text-black transition-all duration-300" 
              onClick={handleBuscarMais}
              disabled={isLoading}
            >
              Buscar + 5
            </Button>
            
            <Button
              variant="link" 
              onClick={handleNewSearch}
              className="text-accent hover:text-accent/80"
            >
              Nova Análise
            </Button>
          </div>
        )}
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={step === 'done' ? "Análise concluída." : "Digite o nome do produto..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || step === 'done'}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-4" 
          />
          
          <Button 
            onClick={handleSend} 
            disabled={isLoading || step === 'done' || !input.trim()}
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
      </div>
    </div>
  );
};

export default CompetitionSpyChat;