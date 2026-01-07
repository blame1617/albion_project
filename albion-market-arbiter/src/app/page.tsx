import Image from "next/image"; // <--- Importante: Faltaba esto
import { ItemSelector } from "@/components/ui/item-selector"; 
import { getItemPrices } from "@/lib/api";
import { calculateFlip } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRelativeTime, isPriceOld } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ item?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const itemId = params.item || "T4_BAG";

  const prices = await getItemPrices(itemId);

  // Filtramos calidad "Normal" (1)
  const normalQualityPrices = prices.filter((p) => p.quality === 1);

  // Buscamos precio referencia en Caerleon
  const caerleonData = normalQualityPrices.find((p) => p.city === "Caerleon");
  const sellInCaerleonPrice = caerleonData?.sell_price_min || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 font-sans">
      <main className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Albion Market Arbiter ⚖️
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Analiza oportunidades de arbitraje entre las Ciudades Reales y Caerleon.
            </p>
          </div>
          <ItemSelector />
        </div>

        {/* Tarjeta de Resultados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               {/* Imagen Grande en el Header de la tarjeta */}
              <div className="relative w-12 h-12 bg-slate-100 rounded-lg border overflow-hidden">
                <Image 
                  src={`https://render.albiononline.com/v1/item/${itemId}.png`}
                  alt={itemId}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <CardTitle>
                Análisis para: <span className="text-blue-600 font-mono">{itemId}</span>
              </CardTitle>
            </div>

            {sellInCaerleonPrice > 0 && (
              <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border">
                Precio ref. Caerleon: <span className="font-bold text-slate-900">{sellInCaerleonPrice.toLocaleString()}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ciudad Origen</TableHead>
                  <TableHead>Precio Compra (Allí)</TableHead>
                  <TableHead>Precio Venta (Allí)</TableHead>
                  <TableHead className="text-right">Profit (Vendiendo en Caerleon)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normalQualityPrices.map((price) => {
                  const { profit, roi } = calculateFlip(sellInCaerleonPrice, price.sell_price_min, true);

                  // Calculamos si el dato es viejo (más de 4 horas)
                  const timeAgo = getRelativeTime(price.sell_price_min_date);
                  const isOldData = isPriceOld(price.sell_price_min_date);

                  if (price.sell_price_min === 0) return null;

                  return (
                    <TableRow key={price.city}>
                      
                      {/* CELDA 1: Ciudad e Imagen */}
                      <TableCell className="font-medium flex items-center gap-3">
                        <div className="relative w-8 h-8 bg-slate-100 rounded-md border overflow-hidden shrink-0">
                            <Image 
                            src={`https://render.albiononline.com/v1/item/${itemId}.png`}
                            alt={price.city}
                            fill
                            className="object-contain p-0.5"
                            sizes="32px"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm">{price.city}</span>
                            <span className={`text-[10px] uppercase font-bold ${price.city === 'Caerleon' ? 'text-red-500' : 'text-slate-400'}`}>
                            {price.city === 'Caerleon' ? 'Destino' : 'Origen'}
                            </span>
                        </div>
                      </TableCell>

                      {/* CELDA 2: Precio de Venta (Compra para nosotros) */}
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium">{price.sell_price_min.toLocaleString()}</span>
                            {/* Aquí mostramos la "frescura" del dato */}
                            <span className={`text-[10px] ${isOldData ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                              {timeAgo}
                            </span>
                        </div>
                      </TableCell>

                      {/* CELDA 3: Orden de Compra (Referencia) */}
                      <TableCell className="text-slate-400">
                        {price.buy_price_max > 0 ? price.buy_price_max.toLocaleString() : '-'}
                      </TableCell>
                      
                      {/* CELDA 4: Profit */}
                      <TableCell className="text-right">
                        {price.city === "Caerleon" ? (
                          <span className="text-slate-300 italic text-xs">-- Punto de Venta --</span>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {profit > 0 ? '+' : ''}{profit.toLocaleString()}
                            </span>
                            <span className={`text-xs ${profit > 0 ? 'text-green-600' : 'text-red-400'}`}>
                              ROI: {roi}%
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {normalQualityPrices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      No se encontraron datos recientes para este ítem. Intenta con otro.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}