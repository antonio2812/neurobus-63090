import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalculationResult {
  idealSalePrice: number;
  netProfit: number;
  netMargin: number;
  details: {
    marketplace: string;
    cost: number;
    desiredMargin: number;
    fixedFee: number;
    freightFee: number;
    commissionRate: number;
    commissionValue: number;
    totalCosts: number;
    commissionLimit: boolean;
    adType: string | null;
    additionalCost: number;
    category: string | null; // NOVO
    weight: number | null; // NOVO (em KG)
    rawWeightValue: number | null; // NOVO: Valor numérico digitado pelo usuário
    weightUnit: 'g' | 'kg'; // NOVO
    rawWeightInputString: string | null; // NOVO
  };
}

interface CalculationDetailsProps {
  calculation: CalculationResult;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2).replace('.', ',')}%`;
};

const CalculationDetails = ({ calculation }: CalculationDetailsProps) => {
  
  // Determina o valor e a unidade a ser exibida
  const rawWeightInputString = calculation.details.rawWeightInputString;
  const originalUnit = calculation.details.weightUnit;
  
  let formattedWeight = 'N/A';
  
  if (rawWeightInputString) {
    const trimmedInput = rawWeightInputString.trim();
    
    // Verifica se a string bruta já contém a unidade (g ou kg)
    if (trimmedInput.toLowerCase().endsWith('g') || trimmedInput.toLowerCase().endsWith('kg')) {
      formattedWeight = trimmedInput;
    } else {
      // Se não contiver a unidade, anexa a unidade inferida
      formattedWeight = `${trimmedInput} ${originalUnit}`;
    }
  } else if (calculation.details.rawWeightValue !== null) {
    // Lógica de fallback (se a string bruta não estiver disponível)
    const rawWeightValue = calculation.details.rawWeightValue;
    const valueString = rawWeightValue.toString().replace('.', ',');
    formattedWeight = `${valueString} ${originalUnit}`;
  }

  return (
    <Card className="mt-4 p-4 bg-background border-accent/30 shadow-inner">
      <h4 className="text-lg font-bold text-accent mb-3">Detalhes do Cálculo LucraAI:</h4>
      <div className="space-y-2 text-sm">
        
        {/* Categoria e Peso (Novos Detalhes) */}
        {calculation.details.category && (
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-muted-foreground">Categoria:</span>
            <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{calculation.details.category}</span>
          </div>
        )}
        {calculation.details.rawWeightValue !== null && (
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-muted-foreground">Peso:</span>
            <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{formattedWeight}</span>
          </div>
        )}
        
        {/* Custo no Fornecedor */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">Custo no Fornecedor:</span>
          <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{formatCurrency(calculation.details.cost)}</span>
        </div>
        
        {/* Taxa de Comissão (com tipo de anúncio se for ML) */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">
            Taxa de Comissão ({formatPercentage(calculation.details.commissionRate)}
            {calculation.details.adType && calculation.details.marketplace === 'Mercado Livre' ? ` - Anúncio ${calculation.details.adType.split(' ')[0]}` : ''}):
          </span>
          <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{formatCurrency(calculation.details.commissionValue)}</span>
        </div>
        
        {/* Custo Fixo */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">Custo Fixo ({calculation.details.marketplace}):</span>
          <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{formatCurrency(calculation.details.fixedFee)}</span>
        </div>
        
        {/* Custo de Frete */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">Custo de Frete:</span>
          <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{formatCurrency(calculation.details.freightFee)}</span>
        </div>
        
        {/* Custos Adicionais */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">Custos Adicionais:</span>
          <span className="font-semibold text-foreground mt-1 sm:mt-0 sm:text-right">{formatCurrency(calculation.details.additionalCost)}</span>
        </div>
        
        {/* Custo Total */}
        <div className="border-t border-border/50 pt-2 mt-2 flex flex-col sm:flex-row sm:justify-between font-bold">
          <span className="text-foreground">Custo Total:</span>
          <span className="text-foreground mt-1 sm:mt-0 sm:text-right">{formatCurrency(calculation.details.totalCosts)}</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-accent/10 rounded-lg space-y-2">
        {/* Preço de Venda Ideal */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <span className="text-xl font-bold text-accent">Preço de Venda Ideal:</span>
          <span className="text-2xl font-extrabold text-accent mt-1 sm:mt-0">{formatCurrency(calculation.idealSalePrice)}</span>
        </div>
        {/* Lucro Líquido */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <span className="text-lg font-semibold text-foreground">Lucro Líquido:</span>
          <span className="text-xl font-bold text-foreground mt-1 sm:mt-0">{formatCurrency(calculation.netProfit)}</span>
        </div>
        {/* Margem de Lucro */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <span className="text-lg font-semibold text-foreground">Margem de Lucro:</span>
          <span className="text-xl font-bold text-foreground mt-1 sm:mt-0">{formatPercentage(calculation.netMargin * 100)}</span>
        </div>
      </div>
      
      {/* ALERTA DE PREJUÍZO (Se o lucro for negativo) */}
      {calculation.netProfit < 0 && (
        <div className="mt-6 p-4 bg-destructive/20 border border-destructive rounded-lg text-center flex flex-col items-center space-y-3">
          <p className="text-lg font-semibold text-destructive">
            Eiii… Parece que essa precificação vai te deixar no prejuízo.
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            Analise seus custos e margem de lucro desejada com atenção — ajustar agora pode ser o passo que faltava para transformar prejuízo em lucro.
          </p>
        </div>
      )}
    </Card>
  );
};

export default CalculationDetails;