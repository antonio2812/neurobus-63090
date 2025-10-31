import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is coming from password reset email
    // If the user is redirected here via the email link, Supabase sets the session state to PASSWORD_RECOVERY
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsUpdateMode(true);
      }
    });
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (isUpdateMode) {
      // --- FLUXO 2: Usuário clicou no link do email e está alterando a senha ---
      if (password !== confirmPassword) {
        setIsLoading(false);
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      setIsLoading(false);

      if (error) {
        toast({
          title: "Erro ao alterar senha",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Senha alterada com sucesso!",
        description: "Você pode fazer login com sua nova senha",
      });
      navigate("/auth");
    } else {
      // --- FLUXO 1: Usuário solicitando o email de recuperação ---
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setIsLoading(false);

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Back Button */}
      <Link 
        to="/auth"
        className="fixed top-8 left-8 z-50 p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-all duration-300"
      >
        <ArrowLeft className="h-6 w-6" />
      </Link>

      {/* Reset Password Card */}
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/LogoMarca LucraAI 01.png" 
            alt="LucraAI Logo" 
            className="h-20 w-auto mx-auto mb-4 rounded-2xl"
          />
          <CardTitle className="text-2xl">
            Alterar Senha
          </CardTitle>
          <CardDescription>
            {isUpdateMode ? "Crie sua nova senha." : "Digite seu email para receber instruções de alteração."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input 
                id="reset-email"
                name="email"
                type="email" 
                placeholder="seu@email.com"
                required
                // Disable email input if we are in the update flow (token already present)
                disabled={isUpdateMode}
              />
            </div>
            
            {/* Password fields are shown only in update mode */}
            {isUpdateMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-password">Nova Senha</Label>
                  <div className="relative">
                    <Input 
                      id="reset-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-confirm">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input 
                      id="reset-confirm"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
            <Button 
              type="submit" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading 
                ? (isUpdateMode ? "Alterando senha..." : "Enviando email...") 
                : (isUpdateMode ? "Alterar Senha" : "Enviar Email de Alteração")
              }
            </Button>
            <div className="text-center">
              <Link 
                to="/auth"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Voltar para Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;