import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, Store, DollarSign, Brain, Sparkles, Box, AlertTriangle, Bell, BarChart, Trophy, Truck, Search, UserSearch, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import DashboardHeader from "@/components/DashboardHeader";
import StrategyCard from "@/components/StrategyCard";
import FoxGoCard from "@/components/FoxGoCard";
import NewFeatureCard from "@/components/NewFeatureCard"; // Importando o novo card
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Importando cn para usar classes condicionais
import PricingModal from "@/components/PricingModal"; // Importando o modal de Precificação
import TitleGeneratorModal from "@/components/TitleGeneratorModal"; // Importando o novo modal
import FeatureComingSoonModal from "@/components/FeatureComingSoonModal"; // NOVO IMPORT
import TrendSpyModal from "@/components/TrendSpyModal"; // NOVO IMPORT
import CompetitionSpyModal from "@/components/CompetitionSpyModal"; // NOVO IMPORT
import KitGeneratorModal from "@/components/KitGeneratorModal"; // NOVO IMPORT
import ForbiddenWordsModal from "@/components/ForbiddenWordsModal"; // NOVO IMPORT
import SupplierFinderModal from "@/components/SupplierFinderModal"; // NOVO IMPORT
import DateMinerModal from "@/components/DateMinerModal"; // NOVO IMPORT

// Definição das funcionalidades para os cards (TÍTULOS ATUALIZADOS)
const features = [
  { icon: Brain, title: "Precificação de Produtos", description: "Descubra o preço ideal automaticamente e maximize seus ganhos.", action: "precificacao", isModal: true }, // isModal: true
  { icon: Sparkles, title: "Gerador de Títulos e Descrições", description: "Conquiste mais cliques com textos prontos, persuasivos e otimizados.", action: "titulos", isModal: true }, // isModal: true
  { icon: Eye, title: "Espião de Tendências de Produtos", description: "Descubra o que vai bombar antes dos seus concorrentes.", action: "tendencias", isModal: true }, // isModal: true
  { icon: UserSearch, title: "Espião de Concorrência", description: "Monitore produtos, preços e estratégias dos concorrentes em tempo real.", action: "concorrencia", isModal: true }, // ÍCONE ATUALIZADO: UserSearch
  { icon: Box, title: "Gerador Inteligente de Kits", description: "Crie combinações automáticas de produtos que aumentam o ticket médio.", action: "kits", isModal: true }, // isModal: true
  { icon: AlertTriangle, title: "Detector de Palavras Proibidas", description: "Evite bloqueios e reprovações antes que prejudiquem suas vendas.", action: "proibidas", isModal: true }, // isModal: true
  // TÍTULO ATUALIZADO AQUI
  { icon: Truck, title: "Buscador de Fornecedores Nacionais e Importadoras", description: "Encontre Parceiros Comerciais com facilidade, confiáveis e com os melhores preços.", action: "fornecedores", isModal: true },
  { icon: Bell, title: "Datas Especiais + Produtos Minerados", description: "Receba alertas inteligentes sobre oportunidades sazonais e produtos lucrativos.", action: "alertas", isModal: true },
  { icon: BarChart, title: "Relatórios Mensais de Lucro", description: "Visualize seus resultados e veja seus lucros crescerem mês a mês.", action: "relatorios" },
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("Usuário");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          navigate("/auth");
          return;
        }
        
        setUser(session.user);

        // Fetch user name from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .single();

        const name = profileData?.name || session.user.user_metadata.name || session.user.email?.split('@')[0] || "Usuário";
        setUserName(name);

      } catch (e) {
        console.error("Dashboard: Erro ao verificar sessão:", e);
        setError(`Erro de autenticação: ${e instanceof Error ? e.message : String(e)}`);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Removendo handleCardClick, pois agora todos os cards usam modais
  // const handleCardClick = (feature: typeof features[0]) => {
  //   // ...
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="p-8 border-destructive border-2 max-w-md text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">Sua sessão expirou ou não foi encontrada.</p>
          <Button onClick={() => navigate("/auth")}>Ir para Login</Button>
        </Card>
      </div>
    );
  }

  const renderFeatureCard = (feature: typeof features[0], index: number) => {
    
    // Define a classe de borda padrão (Removendo a lógica de borda branca)
    const borderClass = "border-border";
    
    const CardContent = (
      <Card 
        // O card inteiro é o grupo de hover
        className={cn(
          "p-6 bg-card transition-all duration-300 hover-lift cursor-pointer text-center flex flex-col group",
          borderClass, // Aplica a classe de borda padrão
          "hover:border-accent/50" // Mantém o hover para o amarelo
        )}
        // Removendo onClick aqui para que o DialogTrigger funcione
      >
        <div className="space-y-4 flex-grow flex flex-col items-center justify-center">
          <div className="p-4 rounded-lg bg-accent/10 w-fit">
            <feature.icon className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </div>
        
        {/* Link "Toque aqui" com efeito de sublinhado animado */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <Button 
            variant="link" 
            className="text-accent p-0 h-auto mx-auto relative" // Removido 'group' daqui, pois o Card é o grupo
            // O onClick é removido, pois o DialogTrigger do modal pai irá capturar o clique
          >
            Toque aqui
            {/* Efeito de sublinhado animado - usa o hover do Card pai (group) */}
            <span className={cn(
              "absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300",
              "group-hover:w-full" // Aplica o sublinhado quando o Card (group) é hover
            )} />
          </Button>
        </div>
      </Card>
    );

    if (feature.action === 'precificacao') {
      return (
        <PricingModal key={index}>
          {CardContent}
        </PricingModal>
      );
    }
    
    if (feature.action === 'titulos') {
      return (
        <TitleGeneratorModal key={index}>
          {CardContent}
        </TitleGeneratorModal>
      );
    }
    
    if (feature.action === 'tendencias') {
      return (
        <TrendSpyModal key={index}>
          {CardContent}
        </TrendSpyModal>
      );
    }
    
    if (feature.action === 'concorrencia') {
      return (
        <CompetitionSpyModal key={index}>
          {CardContent}
        </CompetitionSpyModal>
      );
    }
    
    if (feature.action === 'kits') {
      return (
        <KitGeneratorModal key={index}>
          {CardContent}
        </KitGeneratorModal>
      );
    }
    
    if (feature.action === 'proibidas') {
      return (
        <ForbiddenWordsModal key={index}>
          {CardContent}
        </ForbiddenWordsModal>
      );
    }
    
    if (feature.action === 'fornecedores') {
      return (
        <SupplierFinderModal key={index}>
          {CardContent}
        </SupplierFinderModal>
      );
    }
    
    if (feature.action === 'alertas') {
      return (
        <DateMinerModal key={index}>
          {CardContent}
        </DateMinerModal>
      );
    }
    
    // Para todas as outras funcionalidades, usamos o modal de 'Em Breve'
    return (
      <FeatureComingSoonModal key={index} featureTitle={feature.title}>
        {CardContent}
      </FeatureComingSoonModal>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={userName} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Título e Subtítulo Atualizados */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-space-mono">
              IA que Multiplica seu <span style={{ color: '#ffc800' }}>Lucro</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              O primeiro App brasileiro que combina IA avançada com Automação inteligente 
              para transformar a precificação do seu negócio em minutos.
            </p>
          </div>
          
          {/* NOVO CARD DE DESTAQUE */}
          <NewFeatureCard />

          {/* Texto informativo movido para baixo do novo card */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto pt-4 font-semibold">
              Escolha uma de nossas Ferramentas abaixo para Turbinar o seu Negócio!
            </p>
          </div>

          {/* Functionality Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => renderFeatureCard(feature, index))}
          </div>
          
          {/* Fox GO Card */}
          <FoxGoCard />
          
          {/* Strategy Card */}
          <StrategyCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;