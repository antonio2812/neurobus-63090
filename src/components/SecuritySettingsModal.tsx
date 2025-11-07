import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Shield, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CustomSwitch from "@/components/CustomSwitch"; // Importando o componente reutilizável

// Schema de validação para alteração de senha
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória."),
  newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres."),
  confirmNewPassword: z.string().min(8, "A confirmação é obrigatória."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As novas senhas não coincidem.",
  path: ["confirmNewPassword"],
});

type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>;

interface SecuritySettingsModalProps {
  children: React.ReactNode;
}

const SecuritySettingsModal = ({ children }: SecuritySettingsModalProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Estados mockados para 2FA e Privacidade (AJUSTADOS)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Desativado por padrão
  const [isPublicProfile, setIsPublicProfile] = useState(false); // Desativado por padrão
  const [isDataAnalysisAllowed, setIsDataAnalysisAllowed] = useState(true); // Ativado por padrão
  const [isMarketingAllowed, setIsMarketingAllowed] = useState(false); // Desativado por padrão

  const form = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handlePasswordUpdate = async (data: PasswordUpdateFormValues) => {
    // Nota: O Supabase não verifica a senha atual diretamente via `updateUser`.
    // Para fins de UX e segurança, mantemos o campo, mas a validação real
    // da senha atual exigiria uma Edge Function ou re-autenticação.
    // Aqui, focamos em atualizar a senha se a sessão estiver ativa.
    
    const { newPassword } = data;
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Sua senha foi alterada com sucesso.",
    });
    form.reset(); // Limpa o formulário após o sucesso
  };
  
  // Função mock para salvar configurações de privacidade/2FA
  const handleSettingChange = (setting: string, newState: boolean) => {
    // Aqui você implementaria a lógica real de salvar no banco de dados (e.g., na tabela profiles)
    
    // Esta função agora é chamada dentro do CustomSwitch, mas a mantemos aqui
    // para referência, caso o CustomSwitch precise de um callback externo.
    console.log(`Setting ${setting} changed to ${newState}`);
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6 md:p-8 bg-card border-border shadow-elevated max-h-[90vh] overflow-y-auto">
        
        {/* Título e Subtítulo */}
        <div className="space-y-1 pb-4 border-b border-border -mt-4">
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Segurança da Conta</h3>
          <p className="text-base text-muted-foreground">Gerencie a segurança e privacidade da sua conta.</p>
        </div>

        {/* 1. Alteração de Senha */}
        <Card className="p-6 border-border bg-background/50 space-y-4">
          <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" /> Alterar Senha
          </h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-4">
              
              {/* Senha Atual */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                          className="pr-10"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Nova Senha */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Crie uma nova senha forte"
                          className="pr-10"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Confirmar Nova Senha */}
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua nova senha"
                          className="pr-10"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Alterar Senha"
                )}
              </Button>
            </form>
          </Form>
        </Card>

        {/* 2. Autenticação de Dois Fatores (2FA) */}
        <Card className="p-6 border-border bg-background/50 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">
            Autenticação de Dois Fatores
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">2FA via SMS</p>
              <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança.</p>
            </div>
            <CustomSwitch 
              checked={is2FAEnabled} 
              onCheckedChange={setIs2FAEnabled} 
              settingName="Autenticação de Dois Fatores"
            />
          </div>
        </Card>

        {/* 3. Privacidade */}
        <Card className="p-6 border-border bg-background/50 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">
            Privacidade
          </h4>
          
          {/* Perfil Público */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Perfil público</p>
              <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil básico.</p>
            </div>
            <CustomSwitch 
              checked={isPublicProfile} 
              onCheckedChange={setIsPublicProfile} 
              settingName="Perfil Público"
            />
          </div>
          
          {/* Permitir Análise de Dados */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Permitir análise de dados</p>
              <p className="text-sm text-muted-foreground">Ajude-nos a melhorar a IA anonimamente.</p>
            </div>
            <CustomSwitch 
              checked={isDataAnalysisAllowed} 
              onCheckedChange={setIsDataAnalysisAllowed} 
              settingName="Análise de Dados"
            />
          </div>
          
          {/* Receber Comunicações de Promoções (TEXTO ALTERADO) */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Receber comunicações de promoções</p>
              <p className="text-sm text-muted-foreground">Receber promoções e novidades da LucraAI.</p>
            </div>
            <CustomSwitch 
              checked={isMarketingAllowed} 
              onCheckedChange={setIsMarketingAllowed} 
              settingName="Comunicações de Promoções"
            />
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SecuritySettingsModal;