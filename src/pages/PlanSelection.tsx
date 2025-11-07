import DashboardHeader from "@/components/DashboardHeader";
import Pricing from "@/components/Pricing";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect"; // NOVO IMPORT
import { Loader2 } from "lucide-react";

const PlanSelection = () => {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthRedirect(); // Usando o novo hook
  const [userName, setUserName] = useState("Usuário");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      // Fetch profile name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      const name = profileData?.name || user.user_metadata.name || user.email?.split('@')[0] || "Usuário";
      setUserName(name);
      setLoadingProfile(false);
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  if (isAuthLoading || loadingProfile || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-xl font-bold text-foreground">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={userName} />
      
      <main className="container mx-auto px-6 py-12">
        {/* Reutilizando o componente Pricing */}
        <Pricing />
      </main>
    </div>
  );
};

export default PlanSelection;