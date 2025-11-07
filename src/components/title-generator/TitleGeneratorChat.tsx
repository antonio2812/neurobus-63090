import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, ArrowLeft, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; // Importando supabase

interface TitleGeneratorChatProps {
  onBack: () => void;
}

interface GeneratedContent {
  title: string;
  description: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  generatedContent?: GeneratedContent[];
  isTyping?: boolean;
}

type ChatStep = 'product_name' | 'done';

// Função para formatar texto com quebras de linha e negrito (markdown ***)
const formatTextWithBreaks = (text: string) => {
  // 1. Divide o texto por quebras de linha (\n)
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // 2. Divide cada linha por marcadores de negrito (***)
    const parts = line.split(/(\*\*\*.*?\*\*\*)/g);
    
    const renderedLine = parts.map((part, partIndex) => {
      if (part.startsWith('***') && part.endsWith('***')) {
        // Se for negrito, renderiza como <strong>
        return <strong key={`${lineIndex}-${partIndex}`}>{part.slice(3, -3)}</strong>;
      }
      // Se não for negrito, renderiza como texto normal
      return part;
    });
    
    // 3. Adiciona <br /> após cada linha, exceto a última
    return (
      <span key={lineIndex}>
        {renderedLine}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

// --- Componente Principal ---

const TitleGeneratorChat = ({ onBack }: TitleGeneratorChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('product_name');
  const [productName, setProductName] = useState<string | null>(null); // Mantemos para 'Gerar +'
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mensagem Inicial
  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou a IA de Conteúdo da LucraAI. Para gerar títulos e descrições otimizadas, por favor, digite o <span class="text-foreground font-bold">nome do produto</span> que você deseja vender.`,
  };
  
  // Mensagem de Dica 1 (Original)
  const tipMessage1: ChatMessage = {
    id: 0.1,
    sender: 'ai',
    content: `<span class="text-foreground font-bold">Dica:</span> Quanto mais detalhes você informar como marca, modelo e características — mais preciso e estratégico serão os resultados gerados pela IA da LucraAI.`,
  };
  
  // Mensagem de Dica 2 (NOVA)
  const tipMessage2: ChatMessage = {
    id: 0.2,
    sender: 'ai',
    content: `<span class="text-foreground font-bold">Dica:</span> Caso não encontre um título e descrição ideal, gere mais 5 sugestões para explorar novas opções. Se preferir ajustar manualmente, copie o título e a descrição clicando no ícone de copiar.`,
  };
  
  // Função auxiliar para renderizar o conteúdo da IA (incluindo o HTML do initialMessage)
  const renderAiContent = (content: string) => {
    // Verifica se é a mensagem inicial ou a dica (que contêm HTML)
    if (content.includes('<span class="text-foreground font-bold">') || content.includes('Dica:')) {
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }
    // Caso contrário, usa a formatação normal (quebras de linha e negrito ***)
    return formatTextWithBreaks(content);
  };


  useEffect(() => {
    // Garante que o chat seja reiniciado corretamente ao abrir
    if (messages.length === 0 || messages[0].id !== 0) {
      setMessages([initialMessage, tipMessage1, tipMessage2]); // Adicionando a nova dica
    }
  }, [messages.length]); 

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleCopy = (text: string, type: 'Título' | 'Descrição') => {
    // Remove as tags de destaque (***) e quebras de linha antes de copiar
    const cleanText = text.replace(/\*\*\*/g, '').replace(/<br\s*\/?>/g, '\n');
    navigator.clipboard.writeText(cleanText);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    });
  };

  // Componente auxiliar para renderizar o conteúdo gerado (Definido dentro para acessar handleCopy)
  const GeneratedContentDisplay = ({ content }: { content: GeneratedContent[] }) => (
    <div className="mt-4 space-y-6">
      <h3 className="text-xl font-bold text-foreground font-space-mono">
        Melhores Títulos com foco em SEO e Buscas
      </h3>
      {content.map((item, index) => (
        <Card key={index} className="p-4 bg-background border-accent/30 shadow-inner space-y-3">
          <h4 className="text-lg font-bold text-accent">Opção {index + 1}</h4>
          
          {/* Título */}
          <div className="border border-border/50 rounded-lg p-3 bg-card/50">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-foreground flex-1 pr-2 whitespace-pre-wrap">
                {item.title}
              </p>
              <Button 
                variant="ghost" 
                size="icon" 
                // Ajuste de estilo: hover:bg-accent e hover:text-black
                className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-accent hover:text-black transition-colors duration-300 group" 
                onClick={() => handleCopy(item.title, 'Título')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Descrição - Usando formatTextWithBreaks para garantir quebras de linha */}
          <div className="border border-border/50 rounded-lg p-3 bg-card/50">
            <div className="flex justify-between items-start">
              <div className="text-sm text-muted-foreground flex-1 pr-2 whitespace-pre-wrap">
                {formatTextWithBreaks(item.description)}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                // Ajuste de estilo: hover:bg-accent e hover:text-black
                className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-accent hover:text-black transition-colors duration-300 group" 
                onClick={() => handleCopy(item.description, 'Descrição')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Modificado para aceitar o nome do produto diretamente
  const handleGenerateContent = async (product: string, isInitial: boolean) => {
    if (!product) return;

    setIsLoading(true);
    
    const loadingMessageId = Date.now();
    
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        sender: 'ai',
        content: isInitial ? "Gerando 5 opções iniciais..." : `Gerando mais 5 opções de títulos e descrições para **${product}**...`,
        isTyping: true,
      },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          productName: product,
          count: 5,
        },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.generatedContent) {
        throw new Error(data?.error || 'Erro ao processar geração de conteúdo.');
      }
      
      const newContent: GeneratedContent[] = data.generatedContent;
      
      const aiResponseContent = isInitial 
        ? `Geração concluída! Encontrei ${newContent.length} opções de títulos e descrições otimizadas para o seu produto. Escolha a que melhor se adapta ao seu anúncio:`
        : `Mais ${newContent.length} opções geradas com sucesso:`;

      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Encontra a última mensagem que continha conteúdo gerado (para adicionar mais)
        const lastContentMessageIndex = newMessages.findIndex(msg => msg.generatedContent);
        
        if (lastContentMessageIndex !== -1) {
          // Se já existe conteúdo, atualiza o último bloco de conteúdo
          const updatedMessages = [...newMessages];
          updatedMessages[lastContentMessageIndex] = {
            ...updatedMessages[lastContentMessageIndex],
            generatedContent: [
              ...(updatedMessages[lastContentMessageIndex].generatedContent || []),
              ...newContent
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
            generatedContent: newContent,
          },
        ];
      });
      
      // SUCESSO: Define o passo como 'done'
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao gerar conteúdo:", e);
      
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
            id: Date.now() + 4,
            sender: 'ai',
            content: `❌ Erro: Não foi possível gerar o conteúdo. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      // Volta o passo para 'product_name' para permitir nova tentativa
      setStep('product_name');
      setProductName(null);
      
      toast({
        title: "Erro de Geração",
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
    
    // 1. Atualiza o estado do nome do produto (para uso futuro em 'Gerar +')
    setProductName(name);
    setInput(""); 

    // 2. Adiciona a mensagem do usuário
    setMessages((prev) => [...prev, userMessage]);

    // 3. Inicia a geração de conteúdo IMEDIATAMENTE, passando o nome diretamente
    await handleGenerateContent(name, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const contentMessage = messages.find(msg => msg.generatedContent);
  const totalGenerated = contentMessage?.generatedContent?.length || 0;

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          // ALTERADO: Usando hover:bg-accent e hover:text-black
          className="text-muted-foreground hover:text-black hover:bg-accent transition-colors duration-300 border-transparent" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1">
          Gerador de Títulos e Descrições IA
        </h3>
        <div className="w-10 h-10"></div> {/* Placeholder para alinhamento */}
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
                // Estilo da bolha da IA (Sem fundo, texto direto)
                msg.sender === 'ai'
                  ? 'bg-transparent text-foreground text-lg leading-relaxed'
                  // Estilo da bolha do Usuário (Fundo sutil, canto arredondado)
                  : 'bg-card text-foreground rounded-xl rounded-br-sm text-base'
              )}
            >
              {msg.isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              ) : (
                // Renderiza o conteúdo usando a função segura
                msg.sender === 'ai' ? renderAiContent(msg.content) : msg.content
              )}
              
              {msg.generatedContent && <GeneratedContentDisplay content={msg.generatedContent} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        
        {/* Botão Gerar + (Aparece após a primeira geração) */}
        {step === 'done' && !isLoading && totalGenerated > 0 && (
          <div className="flex justify-center pt-4 pb-2">
            <Button
              variant="outline"
              // Ajuste de estilo: texto branco, hover bg-accent, hover text-black
              className="bg-card border-accent text-white hover:bg-accent hover:text-black transition-all duration-300" 
              onClick={() => productName && handleGenerateContent(productName, false)}
              disabled={isLoading}
            >
              Gerar + 5
            </Button>
          </div>
        )}
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={step === 'done' ? "Geração concluída." : "Digite o nome do produto..."}
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
        
        {step === 'done' && (
          <Button 
            variant="link" 
            onClick={() => {
              setStep('product_name');
              setProductName(null);
              setInput("");
              // Reinicia o chat com a mensagem inicial
              setMessages([initialMessage, tipMessage1, tipMessage2]);
            }}
            className="w-full mt-2 text-accent hover:text-accent/80"
          >
            Novo Produto
          </Button>
        )}
      </div>
    </div>
  );
};

export default TitleGeneratorChat;