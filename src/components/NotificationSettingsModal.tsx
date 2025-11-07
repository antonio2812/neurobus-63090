import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Bell, Mail, Smartphone, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CustomSwitch from "@/components/CustomSwitch"; // Importando o componente reutilizável

interface NotificationSettingsModalProps {
  children: React.ReactNode;
}

const NotificationSettingsModal = ({ children }: NotificationSettingsModalProps) => {
  // Estados para Tipos de Alerta
  const [newFeatures, setNewFeatures] = useState(false);
  const [sellingStrategies, setSellingStrategies] = useState(true); // Ativado por padrão
  const [monthlyReports, setMonthlyReports] = useState(false);

  // Estados para Métodos de Notificação
  const [emailEnabled, setEmailEnabled] = useState(true); // Ativado por padrão
  const [pushEnabled, setPushEnabled] = useState(true); // Ativado por padrão
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6 md:p-8 bg-card border-border shadow-elevated max-h-[90vh] overflow-y-auto">
        
        {/* Título e Subtítulo (Ícone Bell removido) */}
        <div className="space-y-1 pb-4 border-b border-border -mt-4">
          <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            Preferências de Notificação
          </h3>
          <p className="text-base text-muted-foreground">Configure quando e como deseja receber notificações.</p>
        </div>

        {/* 1. Tipos de Alerta */}
        <Card className="p-6 border-border bg-background/50 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">
            Tipos de Alerta
          </h4>
          
          {/* Novas funcionalidades */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Novas funcionalidades</p>
              <p className="text-sm text-muted-foreground">Receba alertas sobre novos recursos da LucraAI.</p>
            </div>
            <CustomSwitch 
              checked={newFeatures} 
              onCheckedChange={setNewFeatures} 
              settingName="Novas funcionalidades"
            />
          </div>
          
          {/* Estratégias para Vender + */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Estratégias para Vender +</p>
              <p className="text-sm text-muted-foreground">Estratégias para aumentar suas vendas.</p>
            </div>
            <CustomSwitch 
              checked={sellingStrategies} 
              onCheckedChange={setSellingStrategies} 
              settingName="Estratégias para Vender +"
            />
          </div>
          
          {/* Relatórios Mensais */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Relatórios Mensais</p>
              <p className="text-sm text-muted-foreground">Resumos de lucro e desempenho do seu negócio.</p>
            </div>
            <CustomSwitch 
              checked={monthlyReports} 
              onCheckedChange={setMonthlyReports} 
              settingName="Relatórios Mensais"
            />
          </div>
        </Card>

        {/* 2. Métodos de Notificação */}
        <Card className="p-6 border-border bg-background/50 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">
            Métodos de Notificação
          </h4>
          
          {/* Email */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> Email</p>
              <p className="text-sm text-muted-foreground">Receba alertas diretamente na sua caixa de entrada.</p>
            </div>
            <CustomSwitch 
              checked={emailEnabled} 
              onCheckedChange={setEmailEnabled} 
              settingName="Notificações por Email"
            />
          </div>
          
          {/* Push (Navegador) */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground flex items-center gap-2"><Smartphone className="h-4 w-4 text-accent" /> Push (Navegador)</p>
              <p className="text-sm text-muted-foreground">Alertas instantâneos no seu navegador ou dispositivo móvel.</p>
            </div>
            <CustomSwitch 
              checked={pushEnabled} 
              onCheckedChange={setPushEnabled} 
              settingName="Notificações Push"
            />
          </div>
          
          {/* SMS */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground flex items-center gap-2"><MessageCircle className="h-4 w-4 text-accent" /> SMS</p>
              <p className="text-sm text-muted-foreground">Alertas críticos via mensagem de texto.</p>
            </div>
            <CustomSwitch 
              checked={smsEnabled} 
              onCheckedChange={setSmsEnabled} 
              settingName="Notificações por SMS"
            />
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettingsModal;