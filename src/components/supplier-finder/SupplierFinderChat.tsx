import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send, Truck, DollarSign, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Supplier {
  name: string;
  type: 'Nacional' | 'Importadora';
  productFocus: string;
  contact: string;
  minOrder: number;
  focus: 'Atacado' | 'Varejo' | 'Ambos';
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  suppliers?: Supplier[];
  isTyping?: boolean;
  options?: { label: string, value: string }[];
}

interface SupplierFinderChatProps {
  onBack: () => void;
}

type ChatStep = 'select_type' | 'select_category' | 'done';

const categories = [
  "Produtos variados", // TEXTO ALTERADO AQUI
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

const SupplierFinderChat = ({ onBack }: SupplierFinderChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('select_type');
  const [supplierType, setSupplierType] = useState<'Nacional' | 'Importadora' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const accentColor = "#ffc800";

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou o **Buscador de Fornecedores** da LucraAI. Para encontrar os melhores parceiros comerciais, por favor, escolha o **tipo de fornecedor** que você deseja:`,
    options: [
      { label: "Fornecedores Nacionais", value: "Nacional" },
      { label: "Importadoras (Internacionais)", value: "Importadora" },
    ]
  };
  
  // Dica inicial removida conforme solicitado

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Componente auxiliar para renderizar os resultados
  const SupplierDisplay = ({ suppliers }: { suppliers: Supplier[] }) => (
    <div className="mt-4 space-y-6">
      <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
        <Truck className="h-6 w-6" /> Fornecedores Encontrados
      </h3>
      
      {suppliers.map((supplier, index) => (
        <Card key={index} className="p-4 bg-background border-accent/30 shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h4 className="text-lg font-bold text-foreground">
              {supplier.name}
            </h4>
            <span className={cn(
              "text-sm font-semibold px-3 py-1 rounded-full",
              supplier.type === 'Nacional' ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
            )}>
              {supplier.type}
            </span>
          </div>
          
          <div className="space-y-2 pt-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Foco de Produtos:</strong> {supplier.productFocus}
            </p>
            <p>
              <strong className="text-foreground">Foco de Venda:</strong> <span className="font-semibold text-accent">{supplier.focus}</span>
            </p>
            <p className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent shrink-0" />
              <strong className="text-foreground">Pedido Mínimo:</strong> {formatCurrency(supplier.minOrder)}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <strong className="text-foreground">Contato:</strong> {supplier.contact}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const handleFindSuppliers = async (category: string, type: 'Nacional' | 'Importadora') => {
    if (!category || !type) return;

    setIsLoading(true);
    
    const loadingMessageId = Date.now();
    
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        sender: 'ai',
        content: `Buscando na rede de fornecedores... Encontrando os 5 melhores parceiros comerciais **${type}** para a categoria **${category}**...`,
        isTyping: true,
      },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('supplier-finder', {
        body: { category, supplierType: type },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.suppliers) {
        throw new Error(data?.error || 'Erro ao processar a busca de fornecedores.');
      }
      
      const foundSuppliers: Supplier[] = data.suppliers;
      
      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Adiciona a resposta final com os fornecedores
        return [
          ...newMessages,
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: `Sucesso! Encontrei ${foundSuppliers.length} fornecedores **${type}** com **preços competitivos** para a categoria **${category}**.`,
            suppliers: foundSuppliers,
          },
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao buscar fornecedores:", e);
      
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
      
      // Remove a mensagem de carregamento e adiciona uma mensagem de erro
      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        return [
          ...newMessages,
          {
            id: Date.now() + 3,
            sender: 'ai',
            content: `❌ Erro: Não foi possível buscar fornecedores. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      setStep('select_type'); // Volta para a seleção de tipo
      setSupplierType(null);
      
      toast({
        title: "Erro de Busca",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeSelect = (type: 'Nacional' | 'Importadora') => {
    setSupplierType(type);
    setStep('select_category');
    
    // Adiciona a resposta do usuário
    setMessages((prev) => [
      ...prev.filter(msg => !msg.options),
      { id: Date.now(), sender: 'user', content: `Tipo selecionado: ${type}` },
    ]);

    // Próxima pergunta
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: `Ótimo! Agora, qual a **categoria de produtos** você deseja buscar fornecedores?`,
        }
      ]);
    }, 500);
  };
  
  const handleCategorySelect = (category: string) => {
    if (!supplierType) return;
    
    setSelectedCategory(category);
    setStep('done');
    
    // Adiciona a resposta do usuário
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', content: `Categoria selecionada: ${category}` },
    ]);
    
    // Inicia a busca
    handleFindSuppliers(category, supplierType);
  };
  
  const handleNewSearch = () => {
    setStep('select_type');
    setSupplierType(null);
    setSelectedCategory(null);
    setMessages([initialMessage]);
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
          className="text-muted-foreground hover:text-accent-foreground transition-all duration-300 border-transparent hover:bg-accent hover:border-accent hover:text-black" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1 flex items-center justify-center gap-2">
          Buscador de Fornecedores
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
              
              {/* Opções de Seleção de Tipo */}
              {msg.options && step === 'select_type' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {msg.options.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      className={cn(
                        "w-full justify-center text-center h-auto py-3 px-4 border-border text-foreground transition-all duration-300",
                        "hover:bg-accent hover:text-black hover:border-accent"
                      )}
                      onClick={() => handleTypeSelect(option.value as 'Nacional' | 'Importadora')}
                      disabled={isLoading}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}
              
              {msg.suppliers && <SupplierDisplay suppliers={msg.suppliers} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        
        {/* Seleção de Categoria (Aparece no passo 2) */}
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
              Nova Busca
            </Button>
          </div>
        )}
      </div>

      {/* Input (Oculto ou desabilitado) */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={step !== 'done' ? "Selecione uma opção acima..." : "Busca concluída."}
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

export default SupplierFinderChat;