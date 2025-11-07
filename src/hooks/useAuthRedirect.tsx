import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/integrations/supabase/SessionContextProvider';

/**
 * Hook para proteger rotas. Redireciona para a página de autenticação se o usuário não estiver logado.
 * @param redirectPath O caminho para onde redirecionar se o usuário não estiver logado (padrão: '/auth').
 */
export const useAuthRedirect = (redirectPath: string = '/auth') => {
  const { user, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redireciona se não estiver carregando e não houver usuário
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate, redirectPath]);

  // Retorna o estado de carregamento para que o componente possa exibir um loader
  return { isLoading, isAuthenticated: !!user };
};