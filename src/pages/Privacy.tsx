import { Lock, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Privacy = () => {
  const location = useLocation();

  useEffect(() => {
    // Always scroll to the top when the component mounts or location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="bg-card border border-border rounded-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-full bg-accent/10">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Política de Privacidade</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section id="informacoes-coletadas">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Informações que Coletamos</h2>
              <p>
                Coletamos informações que você nos fornece diretamente ao criar uma conta, usar nossos 
                serviços ou entrar em contato conosco. Isso pode incluir: nome, e-mail, dados de produtos, 
                informações de vendas e preferências de configuração.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Usamos suas Informações</h2>
              <p>
                Usamos as informações coletadas para:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e enviar notificações relacionadas</li>
                <li>Enviar atualizações técnicas e suporte ao cliente</li>
                <li>Personalizar a experiência do usuário</li>
                <li>Analisar o uso da plataforma para melhorias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Compartilhamento de Informações</h2>
              <p>
                Não vendemos suas informações pessoais a terceiros. Podemos compartilhar suas informações 
                apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>Com provedores de serviços que nos auxiliam na operação da plataforma</li>
                <li>Para proteger os direitos e a segurança da LucraAI e de nossos usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
                pessoais. Utilizamos criptografia SSL, armazenamento seguro e acesso restrito aos dados. 
                No entanto, nenhum método de transmissão pela internet é 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies e Tecnologias Similares</h2>
              <p>
                Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da 
                plataforma e personalizar conteúdo. Você pode controlar o uso de cookies através das 
                configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seus Direitos</h2>
              <p>
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos ou incompletos</li>
                <li>Solicitar a exclusão de suas informações</li>
                <li>Retirar consentimento para uso de dados</li>
                <li>Exportar seus dados em formato estruturado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
                descritos nesta política ou conforme exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Conformidade com LGPD</h2>
              <p>
                Estamos comprometidos em cumprir a Lei Geral de Proteção de Dados (LGPD) e garantir que 
                o tratamento de dados pessoais seja realizado de forma transparente e segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                mudanças significativas através da plataforma ou por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
              <p>
                Para questões sobre privacidade ou para exercer seus direitos, entre em contato:{" "}
                <a 
                  href="mailto:suporte.lucra.ai@gmail.com" 
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  suporte.lucra.ai@gmail.com
                </a>
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Última atualização: 28/10/2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;