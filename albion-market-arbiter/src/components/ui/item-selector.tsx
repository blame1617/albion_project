"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POPULAR_ITEMS } from "@/lib/items-list";

export function ItemSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtenemos el ítem actual de la URL o usamos el default
  const currentItem = searchParams.get("item") || "T4_BAG";

  const handleValueChange = (value: string) => {
    // Esto actualiza la URL a /?item=VALOR y recarga los datos
    router.push(`/?item=${value}`);
  };

  return (
    <div className="w-[280px]">
      <label className="text-sm font-medium mb-2 block text-slate-600">
        Selecciona un ítem para analizar:
      </label>
      <Select defaultValue={currentItem} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar ítem..." />
        </SelectTrigger>
        <SelectContent>
          {POPULAR_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}