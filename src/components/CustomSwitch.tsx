import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CustomSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  settingName: string;
}

const CustomSwitch = ({ checked, onCheckedChange, settingName }: CustomSwitchProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (newState: boolean) => {
    setIsSaving(true);
    onCheckedChange(newState);
    
    // Simulação de salvamento no backend
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    toast({
      title: "Configuração Salva",
      description: `${settingName} ${newState ? 'ativado' : 'desativado'} com sucesso.`,
    });
    setIsSaving(false);
  };

  return (
    <div className="relative">
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={isSaving}
        className={cn(
          "data-[state=checked]:bg-accent data-[state=unchecked]:bg-[#1c1c1c] transition-colors duration-700",
          "h-6 w-11"
        )}
      >
        <span 
          data-state={checked ? 'checked' : 'unchecked'}
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
            "transition-transform duration-700 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
            checked ? 'bg-black' : 'bg-white'
          )}
        />
      </Switch>
      {isSaving && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50 rounded-full">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
        </div>
      )}
    </div>
  );
};

export default CustomSwitch;