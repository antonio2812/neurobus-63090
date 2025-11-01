import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "@/lib/validation";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // Determine initial tab based on URL hash
  const initialTab = location.hash === '#signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

  // Initialize forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    // Update active tab if hash changes (e.g., user navigates back/forward)
    const newTab = location.hash === '#signup' ? 'signup' : 'login';
    setActiveTab(newTab);
  }, [location.hash]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Redirect to dashboard if user is logged in
        if (session?.user) {
          // Adicionando um pequeno atraso para garantir que o som tenha tempo de iniciar
          setTimeout(() => {
            navigate("/dashboard");
          }, 500); // 500ms de atraso
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // --- EFEITO SONORO DE SUCESSO ---
    try {
      const audio = new Audio('/Funcionalidades.mp3');
      audio.volume = 0.6;
      // Tenta reproduzir o som. O await garante que o som comece antes do toast/redirecionamento.
      await audio.play(); 
    } catch (err) {
      console.warn('Falha ao reproduzir som (pode ser bloqueio do navegador):', err);
    }

    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao LucraAI",
    });
    
    // O redirecionamento final é tratado pelo useEffect (onAuthStateChange) com um pequeno delay.
  };

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: data.name,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Conta criada com sucesso!",
      description: "Verifique seu email para confirmar sua conta",
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Link 
        to="/"
        className="fixed top-8 left-8 z-50 p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-all duration-300"
      >
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center pb-4">
          <img 
            src="/lovable-uploads/LogoMarca LucraAI 01.png" 
            alt="LucraAI Logo" 
            className="h-20 w-auto mx-auto rounded-2xl"
          />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="login-email">Email</FormLabel>
                        <FormControl>
                          <Input 
                            id="login-email"
                            type="email" 
                            placeholder="seu@email.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="login-password">Senha</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              id="login-password"
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              autoComplete="current-password"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                  <div className="text-center">
                    <Link 
                      to="/reset-password"
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="signup-name">Nome</FormLabel>
                        <FormControl>
                          <Input 
                            id="signup-name"
                            type="text" 
                            placeholder="Seu nome"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="signup-email">Email</FormLabel>
                        <FormControl>
                          <Input 
                            id="signup-email"
                            type="email" 
                            placeholder="seu@email.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="signup-password">Senha</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              id="signup-password"
                              type={showSignupPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="signup-confirm">Confirmar Senha</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              id="signup-confirm"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
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
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;