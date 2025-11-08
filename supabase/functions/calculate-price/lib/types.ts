export interface CalculationResult {
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
    category: string | null;
    weight: number | null; // Em KG
    weightUnit: 'g' | 'kg'; // Unidade original
  };
}

export interface MarketplaceCalculation {
    finalIdealSalePrice: number;
    commissionRate: number;
    fixedFee: number;
    freightFee: number;
    commissionLimit: boolean;
}