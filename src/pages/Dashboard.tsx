import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calculator, Store, TrendingUp, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Efeito sonoro de sucesso ao entrar no Dashboard
  useEffect(() => {
    // const playLoginSound = () => {
    //   try {
    //     const audio = new Audio('/Funcionalidades.mp3');
    //     audio.volume = 0.6;
    //     audio.play().catch((err) => console.warn('Som bloqueado pelo navegador:', err));
    //   } catch (error) {
    //     console.error('Erro ao tentar reproduzir áudio:', error);
    //   }
    // };

    // // Toca o som imediatamente após o componente montar
    // playLoginSound();
  }, []);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="p-2 rounded-lg hover:bg-accent/10 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img 
              src="/lovable-uploads/lucraia-logo.png" 
              alt="LucraAI Logo" 
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Bem-vindo ao <span className="text-accent">LucraAI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sua jornada para precificação inteligente começa aqui. 
              Configure seus produtos e deixe a IA maximizar seus lucros.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 w-fit">
                  <Calculator className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Calcular Preços
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use nossa calculadora inteligente
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 w-fit">
                  <Store className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Integrar Marketplace
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Conecte suas plataformas
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 w-fit">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Ver Análises
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe seu desempenho
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 w-fit">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Relatórios
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Visualize seus lucros
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Getting Started */}
          <Card className="p-8 bg-gradient-card border-accent/30">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Próximos Passos
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Para começar a usar todas as funcionalidades da LucraAI, 
                conecte sua primeira plataforma de vendas ou adicione seus produtos manualmente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="default"
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Conectar Marketplace
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                >
                  Adicionar Produtos
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;