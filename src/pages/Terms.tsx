import { Scale, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Terms = () => {
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
              <Scale className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Termos de Uso</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section id="aceitacao-termos">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma LucraAI, você concorda com estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
              <p>
                A LucraAI oferece uma plataforma de precificação inteligente com IA avançada e automação 
                para auxiliar vendedores e empresas a otimizar seus preços e maximizar lucros em marketplaces 
                e plataformas de e-commerce.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Conta de Usuário</h2>
              <p>
                Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em 
                aceitar a responsabilidade por todas as atividades que ocorram sob sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Uso Adequado</h2>
              <p>
                Você concorda em usar a plataforma apenas para fins legais e de acordo com estes Termos. 
                É proibido usar a plataforma de qualquer maneira que possa danificar, desabilitar ou 
                prejudicar o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software, 
                é propriedade da LucraAI e protegido pelas leis de direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Planos e Pagamentos</h2>
              <p>
                Os planos pagos estão sujeitos às taxas descritas na página de preços. Cancelamentos 
                podem ser feitos a qualquer momento. Oferecemos garantia de 7 dias nos planos pagos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitação de Responsabilidade</h2>
              <p>
                A LucraAI não se responsabiliza por perdas ou danos resultantes do uso ou incapacidade 
                de usar a plataforma. As sugestões de precificação são apenas orientações e não garantem 
                resultados específicos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Modificações dos Termos</h2>
              <p>
                Reservamos o direito de modificar estes termos a qualquer momento. As mudanças entrarão 
                em vigor imediatamente após a publicação na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contato</h2>
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco em:{" "}
                <a 
                  href="mailto:suporte.lucra.ai@gmail.com" 
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  suporte.lucra.ai@gmail.com
                </a>
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;