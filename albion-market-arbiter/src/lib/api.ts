import { MarketPrice } from "@/app/types/market";

// Las ciudades principales que queremos consultar
const LOCATIONS = "Caerleon,Martlock,Bridgewatch,Lymhurst,FortSterling,Thetford";

export async function getItemPrices(itemId: string): Promise<MarketPrice[]> {
  // Construimos la URL oficial del Albion Data Project
  const url = `https://www.albion-online-data.com/api/v2/stats/prices/${itemId}?locations=${LOCATIONS}`;

  // Hacemos la petición. 
  // 'revalidate: 60' significa que guardará los datos en caché por 60 segundos.
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    // Si la API falla, lanzamos un error o devolvemos un array vacío
    console.error("Error fetching Albion data");
    return [];
  }
  
  return res.json();
}