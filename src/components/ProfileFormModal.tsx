import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// 1. Definir o Schema de Validação
const profileSchema = z.object({
  first_name: z.string().min(1, "O nome é obrigatório."),
  last_name: z.string().min(1, "O sobrenome é obrigatório."),
  phone: z.string().optional(),
  // Permite string (entrada manual) ou Date (seleção do calendário)
  date_of_birth: z.union([z.date().optional().nullable(), z.string().optional().nullable()]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// 2. Definir a interface de dados de entrada
interface ProfileFormModalProps {
  profileData: Tables<'profiles'>;
  onUpdate: (updatedData: Partial<Tables<'profiles'>>) => void;
  children: React.ReactNode;
}

const ProfileFormModal = ({ profileData, onUpdate, children }: ProfileFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Função auxiliar para converter string ISO (YYYY-MM-DD) para Date
  const parseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Verifica se a data é válida
    return isNaN(date.getTime()) ? null : date;
  };

  // Função para formatar a entrada da data (dd/mm/aaaa)
  const formatInputDate = (value: string) => {
    // Remove todos os caracteres que não são dígitos
    let cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara dd/mm/aaaa
    if (cleaned.length > 2) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    }
    
    return cleaned;
  };
  
  // Função para formatar o telefone (XX) XXXXX-XXXX
  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres que não são dígitos
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara
    let formatted = '';
    if (cleaned.length > 0) {
      formatted += '(' + cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += ') ' + cleaned.substring(2, 7);
    }
    if (cleaned.length > 7) {
      formatted += '-' + cleaned.substring(7, 11);
    }
    
    return formatted;
  };

  // 3. Inicializar o formulário
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profileData.first_name || profileData.name?.split(' ')[0] || "",
      last_name: profileData.last_name || profileData.name?.split(' ').slice(1).join(' ') || "",
      phone: profileData.phone || "",
      // Inicializa com objeto Date se for válido, senão null
      date_of_birth: parseDate(profileData.date_of_birth),
    },
  });

  // Resetar o formulário quando o modal abrir ou os dados externos mudarem
  useEffect(() => {
    form.reset({
      first_name: profileData.first_name || profileData.name?.split(' ')[0] || "",
      last_name: profileData.last_name || profileData.name?.split(' ').slice(1).join(' ') || "",
      phone: profileData.phone || "",
      date_of_birth: parseDate(profileData.date_of_birth),
    });
  }, [profileData, isOpen, form]);


  const onSubmit = async (data: ProfileFormValues) => {
    const { first_name, last_name, phone, date_of_birth } = data;
    
    const fullName = `${first_name} ${last_name}`.trim();
    
    let dateOfBirthISO: string | null = null;

    if (date_of_birth instanceof Date && !isNaN(date_of_birth.getTime())) {
      // Se for um objeto Date válido (vindo do calendário)
      dateOfBirthISO = format(date_of_birth, 'yyyy-MM-dd');
    } else if (typeof date_of_birth === 'string' && date_of_birth.length > 0) {
      // Se for uma string (entrada manual), tenta parsear
      // Assumindo formato DD/MM/YYYY para entrada manual
      const parts = date_of_birth.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(p => parseInt(p, 10));
        // Cria a data no formato YYYY-MM-DD para Supabase
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          dateOfBirthISO = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
      }
    }

    const updatePayload = {
      first_name,
      last_name,
      phone: phone ? phone.replace(/\D/g, '') : null, // Remove máscara antes de salvar
      date_of_birth: dateOfBirthISO,
      name: fullName, 
    };

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', profileData.id);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Notifica o componente pai para atualizar o estado local
    onUpdate(updatePayload);
    
    toast({
      title: "Sucesso!",
      description: "Dados pessoais atualizados com sucesso.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 md:p-8 bg-card border-border shadow-elevated max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Título principal removido */}
        </DialogHeader>
        
        {/* BLOCO DE INFORMAÇÕES PESSOAIS (Ajustado para o topo) */}
        <div className="space-y-1 pb-4 border-b border-border -mt-4">
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Informações Pessoais</h3>
          <p className="text-base text-muted-foreground">Atualize seus dados pessoais e preferências</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            {/* Nome e Sobrenome (Grid Responsivo) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(11) 99999-9999" 
                      {...field} 
                      onChange={(e) => {
                        const formattedValue = formatPhoneNumber(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data de Nascimento (Input + Calendar Picker) */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Popover>
                    {/* Input de Data (Não é o Trigger) */}
                    <div className="relative">
                      <Input
                        placeholder="dd/mm/aaaa"
                        value={
                          field.value instanceof Date && !isNaN(field.value.getTime())
                            ? format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            : (typeof field.value === 'string' ? field.value : '')
                        }
                        onChange={(e) => {
                          const formattedValue = formatInputDate(e.target.value);
                          field.onChange(formattedValue);
                        }}
                        className="pr-10"
                      />
                      
                      {/* Ícone do Calendário (AGORA É O TRIGGER) */}
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 p-0 transition-colors duration-300 hover:bg-[#1c1c1c]" // Adicionado hover:bg-[#1c1c1c]
                          aria-label="Abrir calendário"
                        >
                          <CalendarIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Button>
                      </PopoverTrigger>
                    </div>
                    
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value instanceof Date ? field.value : undefined}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão Salvar */}
            <Button 
              type="submit" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold mt-8"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileFormModal;