import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Subscription = Tables<'user_subscriptions'>;

const fetchUserPlan = async (): Promise<Subscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Busca a assinatura ativa do usuário (assumindo que só há uma ativa por vez)
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
    console.error("Erro ao buscar plano do usuário:", error);
    // Em caso de erro, retorna o plano Free como fallback seguro
    return {
      id: 'fallback',
      user_id: user.id,
      plan_name: 'Free',
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: null,
      created_at: new Date().toISOString(),
    } as Subscription;
  }
  
  // Se não encontrar nenhuma assinatura ativa, retorna Free
  if (!data) {
    return {
      id: 'default',
      user_id: user.id,
      plan_name: 'Free',
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: null,
      created_at: new Date().toISOString(),
    } as Subscription;
  }

  return data;
};

export const useUserPlan = () => {
  return useQuery({
    queryKey: ['userPlan'],
    queryFn: fetchUserPlan,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};