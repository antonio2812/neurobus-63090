import { MarketplaceCalculation, CalculationResult } from "./types.ts";

// --- Funções de Cálculo Central ---

export const solveForPrice = (
  productCost: number, 
  fixedFee: number, 
  freightFee: number, 
  commissionRate: number, 
  desiredMarginRate: number
) => {
  const denominator = 1 - commissionRate - desiredMarginRate;
  
  if (denominator <= 0.0001) { 
    const priceForZeroProfit = (productCost + fixedFee + freightFee) / (1 - commissionRate);
    return { idealSalePrice: priceForZeroProfit, commissionLimit: true };
  }
  
  const idealSalePrice = (productCost + fixedFee + freightFee) / denominator;
  return { idealSalePrice, commissionLimit: false };
};

// --- Funções de Cálculo por Marketplace ---

const calculateMercadoLivrePrice = (productCost: number, desiredMarginRate: number, adType: string | null): MarketplaceCalculation => {
    const commissionRate = adType === 'Premium' ? 0.18 : 0.14;
    let finalIdealSalePrice = 0;
    let fixedFee = 0;
    let freightFee = 0;
    
    // 1. TIER 1: Preço < R$19.00
    let currentFixedFee = 6.50;
    let currentFreightFee = 10.00; 
    let { idealSalePrice: price1 } = solveForPrice(productCost, currentFixedFee, currentFreightFee, commissionRate, desiredMarginRate);
    
    if (price1 < 19.00) {
      finalIdealSalePrice = price1;
      fixedFee = currentFixedFee;
      freightFee = currentFreightFee;
    } else {
      // 2. TIER 2: Preço R$19.00 to R$78.99
      currentFixedFee = 0.00;
      currentFreightFee = 25.00;
      let { idealSalePrice: price2 } = solveForPrice(productCost, currentFixedFee, currentFreightFee, commissionRate, desiredMarginRate);
      
      if (price2 >= 19.00 && price2 <= 78.99) {
        finalIdealSalePrice = price2;
        fixedFee = currentFixedFee;
        freightFee = currentFreightFee;
      } else {
        // 3. TIER 3: Preço > R$78.99
        currentFixedFee = 0.00;
        currentFreightFee = 50.00;
        let { idealSalePrice: price3 } = solveForPrice(productCost, currentFixedFee, currentFreightFee, commissionRate, desiredMarginRate);
        
        finalIdealSalePrice = price3;
        fixedFee = currentFixedFee;
        freightFee = currentFreightFee;
      }
    }
    
    return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit: false };
};

const calculateShopeePrice = (productCost: number, desiredMarginRate: number): MarketplaceCalculation => {
    let commissionRate = 0.20;
    const fixedFee = 4.00;
    const freightFee = 0.00; 
    let commissionLimit = false;
    const maxCommission = 100.00;
    
    let { idealSalePrice: initialPrice } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    
    const commissionValue = initialPrice * commissionRate;
    
    if (commissionValue > maxCommission) {
        commissionLimit = true;
        const denominator = 1 - desiredMarginRate;
        if (denominator <= 0.0001) {
            return { finalIdealSalePrice: initialPrice, commissionRate, fixedFee, freightFee, commissionLimit };
        }
        const finalIdealSalePrice = (productCost + fixedFee + freightFee + maxCommission) / denominator;
        commissionRate = (maxCommission / finalIdealSalePrice) || 0; 
        return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit };
    }
    
    return { finalIdealSalePrice: initialPrice, commissionRate, fixedFee, freightFee, commissionLimit };
};

const calculateAmazonPrice = (productCost: number, desiredMarginRate: number): MarketplaceCalculation => {
    const commissionRate = 0.16;
    const freightFee = 0.00; 
    let finalIdealSalePrice = 0;
    let fixedFee = 0;

    // TIER 1: Preço < R$30.00
    let currentFixedFee = 4.50;
    let { idealSalePrice: price1 } = solveForPrice(productCost, currentFixedFee, freightFee, commissionRate, desiredMarginRate);
    
    if (price1 < 30.00) {
      finalIdealSalePrice = price1;
      fixedFee = currentFixedFee;
    } else {
      // TIER 2: Preço R$30.00 to R$78.99
      currentFixedFee = 8.00;
      let { idealSalePrice: price2 } = solveForPrice(productCost, currentFixedFee, freightFee, commissionRate, desiredMarginRate);
      
      if (price2 >= 30.00 && price2 <= 78.99) {
        finalIdealSalePrice = price2;
        fixedFee = currentFixedFee;
      } else {
        // TIER 3: Preço > R$79.00 (Placeholder para custo fixo baseado no peso)
        currentFixedFee = 15.00; 
        let { idealSalePrice: price3 } = solveForPrice(productCost, currentFixedFee, freightFee, commissionRate, desiredMarginRate);
        
        finalIdealSalePrice = price3;
        fixedFee = currentFixedFee;
      }
    }
    
    return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit: false };
};

const calculateMagaluPrice = (productCost: number, desiredMarginRate: number): MarketplaceCalculation => {
    const commissionRate = 0.15; 
    const fixedFee = 5.00;
    let freightFee = 0.00;
    let finalIdealSalePrice = 0;
    
    let { idealSalePrice: initialPrice } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    
    if (initialPrice > 79.00) {
        // Se o preço ideal for acima de R$79,00, o frete é cobrado (50% do frete médio de R$30.00)
        freightFee = 15.00; 
        let { idealSalePrice: finalPriceWithFreight } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
        finalIdealSalePrice = finalPriceWithFreight;
    } else {
        finalIdealSalePrice = initialPrice;
    }
    
    return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit: false };
};

const calculateSheinPrice = (productCost: number, desiredMarginRate: number, weight: number | null): MarketplaceCalculation => {
    const commissionRate = 0.16;
    const fixedFee = 0.00; 
    let freightFee = 0.00;
    
    const w = weight || 0.5; // Default para 0.5kg se não informado
    
    if (w <= 0.3) {
        freightFee = 4.00;
    } else if (w <= 1) { 
        freightFee = 5.00;
    } else if (w <= 2) {
        freightFee = 5.00;
    } else if (w <= 5) {
        freightFee = 15.00;
    } else if (w <= 9) {
        freightFee = 32.00;
    } else if (w <= 13) {
        freightFee = 63.00;
    } else if (w <= 17) {
        freightFee = 73.00;
    } else if (w <= 23) {
        freightFee = 89.00;
    } else if (w <= 30) {
        freightFee = 106.00;
    } else {
        freightFee = 120.00;
    }
    
    let { idealSalePrice: finalIdealSalePrice } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    
    return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit: false };
};

const calculateFacebookPrice = (productCost: number, desiredMarginRate: number): MarketplaceCalculation => {
    // Regra do Facebook: Não tem taxas/custos de comissão ou fixos.
    const commissionRate = 0.00;
    const fixedFee = 0.00;
    const freightFee = 0.00;
    
    let { idealSalePrice: finalIdealSalePrice } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    
    return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit: false };
};

const calculateFallbackPrice = (productCost: number, desiredMarginRate: number): MarketplaceCalculation => {
    const commissionRate = 0.14;
    const fixedFee = 6.99;
    const freightFee = 10.00;
    
    let { idealSalePrice: finalIdealSalePrice } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    
    return { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit: false };
};


// Função principal de cálculo (Dispatcher)
export const calculatePrice = (
  marketplace: string, 
  cost: number, 
  margin: number, 
  adType: string | null, 
  additionalCost: number,
  category: string | null,
  weight: number | null, // Em KG
  weightUnit: 'g' | 'kg' // Unidade original
): CalculationResult => {
  const desiredMarginRate = margin / 100;
  const productCost = cost + additionalCost;
  
  let result: MarketplaceCalculation;

  switch (marketplace) {
    case 'Mercado Livre':
      result = calculateMercadoLivrePrice(productCost, desiredMarginRate, adType);
      break;
    case 'Shopee':
      result = calculateShopeePrice(productCost, desiredMarginRate);
      break;
    case 'Amazon':
      result = calculateAmazonPrice(productCost, desiredMarginRate);
      break;
    case 'Magalu':
      result = calculateMagaluPrice(productCost, desiredMarginRate);
      break;
    case 'Shein':
      result = calculateSheinPrice(productCost, desiredMarginRate, weight);
      break;
    case 'Facebook':
      result = calculateFacebookPrice(productCost, desiredMarginRate);
      break;
    default:
      result = calculateFallbackPrice(productCost, desiredMarginRate);
      break;
  }
  
  // --- Finalização do Cálculo Centralizada ---
  
  const { finalIdealSalePrice, commissionRate, fixedFee, freightFee, commissionLimit } = result;
  
  const finalCommissionRate = commissionRate;
  let commissionValue = finalIdealSalePrice * finalCommissionRate;
  
  // Se Shopee atingiu o limite, a comissão é R$100.00
  const actualCommissionValue = commissionLimit && marketplace === 'Shopee' ? 100.00 : commissionValue;
  
  const totalCosts = productCost + fixedFee + freightFee + actualCommissionValue;
  const netProfit = finalIdealSalePrice - totalCosts;
  const netMargin = (netProfit / finalIdealSalePrice) || 0;

  return {
    idealSalePrice: parseFloat(finalIdealSalePrice.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    netMargin: parseFloat(netMargin.toFixed(4)),
    details: {
      marketplace,
      cost,
      desiredMargin: margin,
      fixedFee: parseFloat(fixedFee.toFixed(2)),
      freightFee: parseFloat(freightFee.toFixed(2)),
      commissionRate: parseFloat((finalCommissionRate * 100).toFixed(2)),
      commissionValue: parseFloat(actualCommissionValue.toFixed(2)),
      totalCosts: parseFloat(totalCosts.toFixed(2)),
      commissionLimit: commissionLimit,
      adType,
      additionalCost,
      category,
      weight,
      weightUnit,
    }
  };
};