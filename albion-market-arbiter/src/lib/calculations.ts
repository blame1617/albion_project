// Constantes oficiales de Albion (puedes cambiarlas si suben los impuestos)
const TAX_PREMIUM = 0.04;    // 4% (con Premium)
const TAX_NO_PREMIUM = 0.08; // 8% (sin Premium)
const SETUP_FEE = 0.025;     // 2.5% costo de poner la orden

export function calculateFlip(
  sellPrice: number, // A cuánto lo venderás (ej: en Caerleon)
  buyPrice: number,  // A cuánto lo compraste (ej: en Martlock)
  hasPremium: boolean = true
) {
  // Si alguno de los precios es 0 o inválido, devolvemos 0
  if (!sellPrice || !buyPrice || sellPrice <= 0 || buyPrice <= 0) {
    return { profit: 0, roi: 0 };
  }

  const tax = hasPremium ? TAX_PREMIUM : TAX_NO_PREMIUM;
  
  // 1. Costo real de compra (Precio base + Setup Fee de la orden de compra si aplica)
  // Nota: Simplificamos asumiendo compra directa. Si pones orden de compra, suma SETUP_FEE aquí.
  const totalCost = buyPrice; 
  
  // 2. Ingreso real de venta (Precio venta - Impuestos)
  // El setup fee de venta se paga al momento de listar el ítem.
  const sellingCosts = sellPrice * (tax + SETUP_FEE);
  const netIncome = sellPrice - sellingCosts;
  
  // 3. Resultado final
  const profit = netIncome - totalCost;
  
  // 4. Retorno de Inversión (ROI)
  const roi = (profit / totalCost) * 100;

  return {
    profit: Math.floor(profit),    // Redondeamos hacia abajo para no ser optimistas
    roi: parseFloat(roi.toFixed(2)) // Dejamos solo 2 decimales
  };
}