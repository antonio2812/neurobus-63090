import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, updatePasswordSchema } from "@/lib/validation";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;
type UpdateFormValues = z.infer<typeof updatePasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize forms
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    // Check if user is coming from password reset email
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsUpdateMode(true);
        // Pre-fill email if available, though usually not needed in this flow
        if (session?.user?.email) {
          resetForm.setValue('email', session.user.email);
        }
      }
    });
  }, []);

  const handleResetPassword = async (data: ResetFormValues | UpdateFormValues) => {
    setIsLoading(true);
    
    if (isUpdateMode) {
      // --- FLUXO 2: Usuário clicou no link do email e está alterando a senha ---
      const updateData = data as UpdateFormValues;
      
      // Zod already validated password match and length
      
      const { error } = await supabase.auth.updateUser({
        password: updateData.password,
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
      const resetData = data as ResetFormValues;
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetData.email, {
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
          {isUpdateMode ? (
            // Update Password Form (after clicking email link)
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="reset-email">Email</FormLabel>
                  <Input 
                    id="reset-email"
                    type="email" 
                    placeholder="seu@email.com"
                    // Display email if available, but keep it disabled
                    value={resetForm.getValues('email') || ''}
                    disabled
                    className="text-muted-foreground"
                  />
                </div>
                
                <FormField
                  control={updateForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="reset-password">Nova Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            id="reset-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua nova senha"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="reset-confirm">Confirmar Nova Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            id="reset-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua nova senha"
                            className="pr-10"
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
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Alterando senha..." : "Alterar Senha"}
                </Button>
              </form>
            </Form>
          ) : (
            // Request Reset Email Form
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="reset-email">Email</FormLabel>
                      <FormControl>
                        <Input 
                          id="reset-email"
                          type="email" 
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando email..." : "Enviar Email"}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="text-center mt-4">
            <Link 
              to="/auth"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Voltar para Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;