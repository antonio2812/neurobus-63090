import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";
import { usePricingChat } from "@/hooks/usePricingChat"; // Importando o novo hook

interface PricingChatInterfaceProps {
  marketplace: string;
  onBack: () => void;
}

const PricingChatInterface = ({ marketplace, onBack }: PricingChatInterfaceProps) => {
  const {
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
  } = usePricingChat(marketplace);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
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