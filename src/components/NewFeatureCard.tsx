import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUserPlan } from "@/hooks/useUserPlan"; // Importando o hook
import SupplierFinderModal from "./SupplierFinderModal"; // Importando o novo modal
import { useNavigate } from "react-router-dom"; // Importando useNavigate

const NewFeatureCard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: userPlan, isLoading } = useUserPlan(); // Usando o hook
  const accentColor = "#ffc800"; // Cor amarela

  const isPremium = userPlan?.plan_name === 'Premium' && userPlan.status === 'active';
  const isFreeOrPro = userPlan?.plan_name === 'Free' || userPlan?.plan_name === 'Pro';

  const handleExperimentClick = () => {
    if (isLoading) return;

    if (isPremium) {
      // Se for Premium, o modal será aberto pelo DialogTrigger
      // Não precisamos de lógica extra aqui, pois o componente SupplierFinderModal
      // envolverá o botão.
      return; 
    } 
    
    if (isFreeOrPro) {
      // Se for Free ou Pro, redireciona para a página de planos
      toast({
        title: "Upgrade Necessário",
        description: "Esta funcionalidade é exclusiva para o Plano Premium.",
        variant: "destructive",
      });
      navigate('/dashboard/plans');
      return;
    }

    // Fallback para usuários não logados ou em estado desconhecido
    navigate('/auth');
  };

  // O botão deve ser envolvido pelo modal se o usuário for Premium
  const ButtonContent = (
    <Button
      variant="default"
      size="lg"
      className={cn(
        "w-full md:w-auto font-bold px-8 py-6 text-lg shadow-glow-accent transition-all duration-300",
        "bg-accent text-accent-foreground",
        "hover:scale-[1.05] hover:bg-[hsl(48_100%_40%)]",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      onClick={!isPremium ? handleExperimentClick : undefined} // Se for Premium, o clique é tratado pelo DialogTrigger
      disabled={isLoading}
    >
      <span className="flex items-center">
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <>
            Experimentar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </span>
    </Button>
  );

  return (
    <Card className="p-6 md:p-8 bg-gradient-card border-accent/50 shadow-glow-accent transition-all duration-500 hover-lift">
      <div className="flex flex-col items-center justify-center gap-6">
        
        {/* Ícone de Raio Centralizado (Mobile Only) */}
        <div className="md:hidden">
          <Zap className="h-10 w-10 shrink-0" style={{ color: accentColor }} />
        </div>

        {/* Conteúdo de Texto */}
        <div className="space-y-3 text-center">
          
          {/* Título com Destaque (Oculta o ícone no mobile, exibe no desktop) */}
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-space-mono flex items-center justify-center gap-3">
            {/* Ícone de Raio (Desktop Only) */}
            <Zap className="h-6 w-6 shrink-0 hidden md:block" style={{ color: accentColor }} />
            <span style={{ color: accentColor }}>
              Nova Funcionalidade Disponível
            </span>
          </h2>
          
          {/* Subtítulo com Destaque */}
          <p className="text-lg md:text-xl font-semibold text-foreground leading-snug max-w-3xl mx-auto">
            Experimente o <span style={{ color: accentColor }}>Buscador de Fornecedores e Importadoras</span> - Aumente a sua Margem de Lucro e Ganhe mais Dinheiro!
          </p>
          
          {/* Descrição (Cor Branca) */}
          <p className="text-base text-white pt-2 max-w-3xl mx-auto">
            Descubra os Melhores Parceiros Comerciais com os Melhores Preços.
          </p>
        </div>

        {/* Botão */}
        {isPremium ? (
          <SupplierFinderModal>
            {ButtonContent}
          </SupplierFinderModal>
        ) : (
          ButtonContent
        )}
      </div>
    </Card>
  );
};

export default NewFeatureCard;