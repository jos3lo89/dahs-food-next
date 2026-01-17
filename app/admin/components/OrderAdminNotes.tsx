"use client";

import { Order } from "@/types/orders";
import { useUpdateOrder } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderAdminNotesProps {
  order: Order;
}

export function OrderAdminNotes({ order }: OrderAdminNotesProps) {
  const [notes, setNotes] = useState(order.notes || "");
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  const handleUpdateNotes = () => {
    updateOrder(
      { id: order.id, data: { notes } },
      {
        onSuccess: () => {
          toast.success("Notas guardadas");
        },
      },
    );
  };

  return (
    <div className="bg-pink-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-pink-500" />
        Notas Administrativas
      </h3>

      <div className="space-y-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas internas sobre el pedido..."
          rows={4}
          className="resize-none bg-white"
        />
        <Button
          onClick={handleUpdateNotes}
          disabled={isPending || !notes.trim()}
          variant="outline"
          className="w-full cursor-pointer"
        >
          {isPending ? "Guardando..." : "Guardar Notas"}
        </Button>
      </div>
    </div>
  );
}
