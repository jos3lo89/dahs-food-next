"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

interface AddressFormProps {
  formData: {
    address: string;
    district: string;
    city: string;
    reference: string;
  };
  onChange: (field: string, value: string) => void;
}

export function AddressForm({ formData, onChange }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dirección de Entrega
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="address">Dirección completa *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Av. Principal 123, Dpto 401"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Incluye calle, número y departamento/casa
          </p>
        </div>

        <div>
          <Label htmlFor="district">Distrito *</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => onChange("district", e.target.value)}
            placeholder="Andahuaylas, San jeronimo, Talavera"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Adahuaylas"
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="reference">Referencia (opcional)</Label>
          <Textarea
            id="reference"
            value={formData.reference}
            onChange={(e) => onChange("reference", e.target.value)}
            placeholder="Ej: Casa blanca con reja negra, al frente del parque..."
            rows={2}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ayúdanos a encontrar tu dirección más fácil
          </p>
        </div>
      </div>
    </div>
  );
}
