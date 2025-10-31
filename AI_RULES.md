# AI_RULES.md

Este documento descreve a stack técnica e as convenções de codificação obrigatórias para garantir a consistência e qualidade do projeto.

## Visão Geral da Stack Técnica

*   **Framework:** React (v18) com TypeScript.
*   **Build Tool:** Vite.
*   **Estilização:** Tailwind CSS para estilização utility-first, priorizando sempre o design responsivo.
*   **Biblioteca de UI:** shadcn/ui (baseado em Radix UI) para todos os componentes padrão (Button, Card, Input, etc.).
*   **Ícones:** Lucide React.
*   **Roteamento:** React Router (v6). Todas as rotas devem ser definidas em `src/App.tsx`.
*   **Backend:** Supabase para autenticação, banco de dados e funções serverless (Edge Functions).
*   **Data Fetching:** TanStack Query para gerenciar o estado do servidor e cache.
*   **Notificações:** Use `sonner` para toasts gerais e o sistema de toast do `shadcn/ui` (`useToast`) para notificações do sistema.

## Regras de Codificação Obrigatórias

1.  **Estrutura de Arquivos:**
    *   Páginas devem residir em `src/pages/`.
    *   Componentes reutilizáveis devem residir em `src/components/`.
    *   Hooks devem residir em `src/hooks/`.
    *   Arquivos de integração Supabase devem residir em `src/integrations/supabase/`.

2.  **Criação de Componentes:** Cada novo componente ou hook, independentemente do tamanho, deve ser criado em seu próprio arquivo dedicado. Não aninhe componentes dentro de arquivos existentes.

3.  **Uso do Supabase:**
    *   Sempre use o cliente pré-configurado importado de `@/integrations/supabase/client`.
    *   **Segurança:** Row Level Security (RLS) deve ser habilitado e configurado corretamente para todas as tabelas do banco de dados. As políticas devem seguir o princípio do menor privilégio.

4.  **Estilização e Design:**
    *   Toda a estilização deve usar classes do Tailwind CSS. Evite estilos inline, a menos que seja estritamente necessário para cálculos dinâmicos.
    *   Garanta que todos os componentes sejam responsivos por padrão.

5.  **Imports:** Use aliases de caminho (`@/`) para imports internos (ex: `@/components/ui/button`).

6.  **Tratamento de Erros:** Não use blocos `try/catch` a menos que seja especificamente solicitado. Os erros devem ser permitidos para que subam para fins de depuração e tratamento centralizado.