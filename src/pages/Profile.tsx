import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Trophy, LogOut, XCircle, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProfileFormModal from "@/components/ProfileFormModal";
import SecuritySettingsModal from "@/components/SecuritySettingsModal";
import NotificationSettingsModal from "@/components/NotificationSettingsModal";
import AchievementsModal from "@/components/AchievementsModal"; // Importando o novo modal
import { Tables } from "@/integrations/supabase/types";
import { useAuthRedirect } from "@/hooks/useAuthRedirect"; // NOVO IMPORT

// Definindo o tipo de dados do perfil com base na tipagem do Supabase
type ProfileData = Tables<'profiles'> & {
  email: string; // Adicionando email que vem do auth.user
};

const Profile = () => {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthRedirect(); // Usando o novo hook
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirecionamento já tratado pelo useAuthRedirect, mas mantemos a verificação
      setLoadingProfile(false);
      return;
    }

    // Fetch ALL profile data from public.profiles table
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*') // Seleciona todos os campos, incluindo os novos
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      // Fallback to user data if profile fetch failed
      setProfile({
        id: user.id,
        name: user.user_metadata.name || user.email?.split('@')[0] || "Usuário",
        email: user.email || "",
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
        avatar_url: null,
        first_name: null,
        last_name: null,
        phone: null,
        date_of_birth: null,
      });
    } else {
      setProfile({
        ...profileData,
        email: user.email || "",
        // Garante que o campo 'name' seja preenchido se first/last name existirem
        name: profileData.name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || user.email?.split('@')[0] || "Usuário",
      });
    }
    setLoadingProfile(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Desconectado",
      description: "Você saiu da sua conta LucraAI.",
    });
    navigate("/auth");
  };

  const handleFileSelect = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !profile) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    // Usamos o ID do usuário como pasta e um timestamp para garantir unicidade
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    // O caminho agora usa profile.id, que é o auth.uid()
    const filePath = `${profile.id}/${fileName}`;
    
    setUploading(true);

    // 1. Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      setUploading(false);
      toast({
        title: "Erro no Upload",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 3. Update the profile table with the new URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    setUploading(false);

    if (updateError) {
      toast({
        title: "Erro ao salvar URL",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    // 4. Update local state and notify user
    setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
    toast({
      title: "Sucesso!",
      description: "Foto de perfil atualizada.",
    });
  };
  
  // Função para atualizar o estado do perfil após o modal salvar
  const handleProfileUpdate = (updatedData: Partial<Tables<'profiles'>>) => {
    setProfile(prev => {
      if (!prev) return null;
      
      // Atualiza o nome completo se first_name ou last_name mudarem
      const newFirstName = updatedData.first_name ?? prev.first_name;
      const newLastName = updatedData.last_name ?? prev.last_name;
      const newName = `${newFirstName || ''} ${newLastName || ''}`.trim();

      return {
        ...prev,
        ...updatedData,
        name: newName || prev.email?.split('@')[0] || "Usuário",
      };
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  if (isAuthLoading || loadingProfile || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
        <p className="text-xl font-bold text-foreground">
          Carregando...
        </p>
      </div>
    );
  }

  if (!profile) {
    return null; // Redirecionamento já ocorreu
  }

  const memberSince = profile.created_at 
    ? format(new Date(profile.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "N/A";
  
  const firstName = profile.name.split(' ')[0];
  const initial = profile.name.charAt(0).toUpperCase();

  // Definindo o item de menu de Dados Pessoais para abrir o modal
  const personalDataMenuItem = { 
    icon: User, 
    title: "Dados Pessoais", 
    description: "Altere seu nome e informações pessoais.", 
    action: () => {} // Ação será o DialogTrigger
  };

  // O item de Segurança será tratado separadamente com o modal
  const otherMenuItems = [
    // O item de Conquistas agora usa o modal AchievementsModal
    // { icon: Trophy, title: "Conquistas", description: "Veja seu progresso e recompensas.", action: () => toast({ title: "Funcionalidade", description: "Conquistas em desenvolvimento." }) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={profile.name} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Título e Saudação */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground font-space-mono">Meu Perfil</h1>
            <p className="text-lg text-muted-foreground">Gerencie suas informações pessoais e configurações.</p>
          </div>

          {/* Card Principal do Perfil */}
          <Card className="p-8 bg-card border-border shadow-elevated">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Avatar e Upload */}
              <div className="flex flex-col items-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                
                <div 
                  className="relative h-24 w-24 cursor-pointer group"
                  onClick={handleFileSelect}
                >
                  <Avatar 
                    className="h-full w-full transition-opacity duration-300"
                  >
                    {/* CLASSE object-cover APLICADA AQUI NOVAMENTE */}
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} className="object-cover" />
                    <AvatarFallback className="bg-accent text-accent-foreground text-3xl font-bold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Overlay de Upload */}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                  
                  {/* Overlay de Hover para Alterar Foto */}
                  {!uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs font-semibold">Alterar</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="link" 
                  className="text-accent p-0 h-auto"
                  onClick={handleFileSelect}
                  disabled={uploading}
                >
                  {uploading ? "Enviando..." : "Alterar Foto"}
                </Button>
              </div>

              {/* Informações do Usuário */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  {getGreeting()}, {firstName}!
                </h2>
                <p className="text-sm md:text-lg text-muted-foreground break-words">{profile.email}</p>
                <p className="text-sm text-muted-foreground pt-2">
                  Membro desde: {memberSince}
                </p>
              </div>
            </div>
          </Card>

          {/* Menu de Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card de Dados Pessoais (Abre o Modal) */}
            <ProfileFormModal profileData={profile} onUpdate={handleProfileUpdate}>
              <Card 
                className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <personalDataMenuItem.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{personalDataMenuItem.title}</h3>
                    <p className="text-sm text-muted-foreground">{personalDataMenuItem.description}</p>
                  </div>
                </div>
              </Card>
            </ProfileFormModal>
            
            {/* Card de Segurança (Abre o Modal de Segurança) */}
            <SecuritySettingsModal>
              <Card 
                className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Segurança</h3>
                    <p className="text-sm text-muted-foreground">Gerencie sua senha e autenticação de dois fatores.</p>
                  </div>
                </div>
              </Card>
            </SecuritySettingsModal>
            
            {/* Card de Notificações (Abre o Novo Modal) */}
            <NotificationSettingsModal>
              <Card 
                className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Notificações</h3>
                    <p className="text-sm text-muted-foreground">Configure suas preferências de alerta.</p>
                  </div>
                </div>
              </Card>
            </NotificationSettingsModal>

            {/* Card de Conquistas (Abre o Modal de Conquistas) */}
            <AchievementsModal>
              <Card 
                className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Conquistas</h3>
                    <p className="text-sm text-muted-foreground">Veja seu progresso e recompensas.</p>
                  </div>
                </div>
              </Card>
            </AchievementsModal>

            {/* Outros Cards (Vazio, pois Conquistas foi movido) */}
            {otherMenuItems.map((item, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300 hover-lift cursor-pointer"
                onClick={item.action}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Botões de Ação - Alinhados à esquerda (justify-start) */}
          <div className="flex flex-col sm:flex-row justify-start gap-4 pt-4">
            
            {/* Botão Sair (Aumentando a largura com px-8) */}
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700 flex items-center justify-center pl-1 pr-2 px-8" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> 
              Sair
            </Button>
            
            {/* Botão Cancelar Plano (Segundo, à direita) */}
            <Button 
              variant="outline" 
              className="bg-[#1c1c1c] border-border text-muted-foreground hover:bg-[#1c1c1c]/80 hover:text-foreground"
              onClick={() => toast({ title: "Funcionalidade", description: "Cancelar Plano em desenvolvimento." })}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar plano
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;