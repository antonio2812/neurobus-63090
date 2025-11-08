import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react'; 

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};

interface SessionContextProviderProps {
  children: React.ReactNode;
}

const SessionContextProvider = ({ children }: SessionContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Busca a sessão inicial
    const fetchInitialSession = async () => {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching initial session:", error);
      }
      
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setIsLoading(false);
    };

    fetchInitialSession();

    // 2. Configura o listener para mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      // Se o estado mudar (login, logout), garantimos que isLoading seja false
      setIsLoading(false); 
    });

    return () => subscription.unsubscribe();
  }, []);

  // Exibe o loader enquanto a sessão inicial está sendo carregada
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
        <p className="text-xl font-bold text-foreground">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider;