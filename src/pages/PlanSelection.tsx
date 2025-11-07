import DashboardHeader from "@/components/DashboardHeader";
import Pricing from "@/components/Pricing";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PlanSelection = () => {
  const [userName, setUserName] = useState("Usuário");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
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
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Carregando Planos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={userName} />
      
      <main className="container mx-auto px-6 py-12">
        {/* Título duplicado removido daqui */}

        {/* Reutilizando o componente Pricing */}
        <Pricing />
      </main>
    </div>
  );
};

export default PlanSelection;