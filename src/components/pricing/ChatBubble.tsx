import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CalculationDetails from "./CalculationDetails";

// Tipos de dados (replicados do PricingChatInterface para modularidade)
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

interface ChatBubbleProps {
  message: ChatMessage;
  onOptionSelect: (value: string) => void;
  isLoading: boolean;
}

// Função auxiliar para renderizar texto com negrito (markdown **)
const renderContentWithBold = (content: string) => {
  // Verifica se o conteúdo contém tags HTML (como a dica de peso)
  if (content.includes('<span class="text-foreground font-bold">')) {
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  // Se não tiver HTML, processa o markdown **
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ChatBubble = ({ message, onOptionSelect, isLoading }: ChatBubbleProps) => {
  const { sender, content, isTyping, calculation, options, isAlert } = message;

  return (
    <div
      className={cn(
        "flex",
        sender === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          "max-w-[95%] md:max-w-[85%] p-3 shadow-none transition-all duration-300", // ALTERADO: max-w-[95%] para mobile, md:max-w-[85%] para desktop
          // Estilo da bolha da IA (Sem fundo, texto direto)
          sender === 'ai'
            ? 'bg-transparent text-foreground text-lg leading-relaxed'
            // Estilo da bolha do Usuário (Fundo sutil, canto arredondado)
            : 'bg-card text-foreground rounded-xl rounded-br-sm text-base',
          
          // Estilo de Alerta (Se for o caso)
          isAlert && 'p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-center'
        )}
      >
        {isTyping ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : (
          // Renderiza o conteúdo usando a função segura
          renderContentWithBold(content)
        )}
        
        {/* Opções de Escolha (Apenas para ad_type e select_category) */}
        {options && (
          <div className="flex flex-col space-y-2 mt-3">
            {options.map(option => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={cn(
                  // NOVO ESTILO: Borda e texto branco (foreground)
                  "w-full justify-center bg-transparent border-foreground text-foreground transition-all duration-300", 
                  // NOVO HOVER: Fundo amarelo (accent) e texto preto (accent-foreground)
                  "hover:bg-accent hover:text-accent-foreground hover:border-accent" 
                )}
                onClick={() => onOptionSelect(option.value)}
                disabled={isLoading}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
        
        {calculation && <CalculationDetails calculation={calculation} />}
      </div>
    </div>
  );
};

export default ChatBubble;