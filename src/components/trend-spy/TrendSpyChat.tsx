import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Zap, TrendingUp, CheckCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrendSpyChatProps {
  onBack: () => void;
}

interface TrendProduct {
  name: string;
  reason: string;
  potential: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  products?: TrendProduct[];
  isTyping?: boolean;
}

type ChatStep = 'select_category' | 'done';

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
  "Produtos importados", // TEXTO ALTERADO AQUI
];

const TrendSpyChat = ({ onBack }: TrendSpyChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('select_category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const accentColor = "#ffc800";

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou o **Espião de Tendências** da LucraAI. Para encontrar os produtos mais lucrativos e com pouca concorrência, por favor, **selecione o nicho/categoria** que você deseja explorar:`,
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCategorySelect = async (category: string) => {
    if (isLoading) return;

    setSelectedCategory(category);
    setIsLoading(true);

    // 1. Adiciona a mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: `Nicho selecionado: ${category}`,
    };
    
    // 2. Adiciona a mensagem de carregamento
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      sender: 'ai',
      content: `Analisando o mercado... Buscando os 5 produtos mais lucrativos e com baixa concorrência na categoria **${category}**...`,
      isTyping: true,
    };
    
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('trend-spy', {
        body: { category },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.products) {
        throw new Error(data?.error || 'Erro ao processar a busca de tendências.');
      }
      
      const trendProducts: TrendProduct[] = data.products;
      
      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Adiciona a resposta final com os produtos
        return [
          ...newMessages,
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: `Sucesso! Encontrei ${trendProducts.length} produtos com **potencial gigantesco** de lucro na categoria **${category}**.`,
            products: trendProducts,
          },
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.log("Erro ao buscar tendências:", e);
      
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
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        return [
          ...newMessages,
          {
            id: Date.now() + 3,
            sender: 'ai',
            content: `❌ Erro: Não foi possível buscar as tendências. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      toast({
        title: "Erro de Tendência",
        description: errorMessage,
        variant: "destructive",
      });
      
      setStep('select_category'); // Volta para a seleção
      setSelectedCategory(null);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewSearch = () => {
    setStep('select_category');
    setSelectedCategory(null);
    setMessages([initialMessage]);
  };

  // Componente auxiliar para renderizar os resultados
  const TrendResultsDisplay = ({ products }: { products: TrendProduct[] }) => (
    <div className="mt-4 space-y-6">
      <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
        <TrendingUp className="h-6 w-6" /> Produtos em Alta
      </h3>
      
      {products.map((product, index) => (
        <Card key={index} className="p-4 bg-background border-accent/30 shadow-inner space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent shrink-0" />
            <h4 className="text-lg font-bold text-foreground">
              {product.name}
            </h4>
          </div>
          
          <div className="space-y-1 ml-7">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Motivo da Tendência:</strong> {product.reason}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Potencial de Lucro:</strong> {product.potential}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          // CLASSE ATUALIZADA: Borda transparente por padrão, borda amarela no hover
          className="text-muted-foreground transition-all duration-300 border-transparent hover:border-accent hover:bg-transparent hover:text-foreground" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1 flex items-center justify-center gap-2">
          {/* Ícone Zap removido daqui */}
          Espião de Tendências
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
                <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              )}
              
              {msg.products && <TrendResultsDisplay products={msg.products} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        
        {/* Seleção de Categoria (Aparece apenas no passo 1) */}
        {step === 'select_category' && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left h-auto py-3 px-4 border-border text-foreground transition-all duration-300",
                  "hover:bg-accent hover:text-black hover:border-accent" // Efeito de hover solicitado
                )}
                onClick={() => handleCategorySelect(category)}
                disabled={isLoading}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
        
        {/* Botão Nova Busca (Aparece após a conclusão) */}
        {step === 'done' && !isLoading && (
          <div className="flex justify-center pt-4 pb-2">
            <Button
              variant="outline"
              className="bg-card border-accent text-white hover:bg-accent hover:text-black transition-all duration-300" 
              onClick={handleNewSearch}
              disabled={isLoading}
            >
              Nova Busca de Tendências
            </Button>
          </div>
        )}
      </div>

      {/* Input (Oculto ou desabilitado dependendo do passo) */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          <input
            placeholder={step === 'select_category' ? "Selecione uma categoria acima..." : "Busca concluída."}
            disabled={true}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-4 cursor-default" 
          />
          <Button 
            disabled={true}
            size="icon"
            className="h-10 w-10 mr-2 rounded-full bg-muted text-muted-foreground cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrendSpyChat;