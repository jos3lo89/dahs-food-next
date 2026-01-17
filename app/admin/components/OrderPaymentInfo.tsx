"use client";

import { useState } from "react";
import { Order, PaymentVerificationStatus } from "@/types/orders";
import { useApprovePayment, useRejectPayment } from "@/hooks/useOrders";
import {
  CreditCard,
  Image as ImageIcon,
  Eye,
  CheckCircle,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";

interface OrderPaymentInfoProps {
  order: Order;
}

const paymentMethodLabels: Record<string, string> = {
  yape: "Yape",
  plin: "Plin",
  culqi: "Tarjeta",
  efectivo: "Efectivo",
};

const paymentStatusColors: Record<PaymentVerificationStatus, string> = {
  PENDING: "bg-gray-100 text-gray-800 border-gray-300",
  VERIFIED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

const paymentStatusLabels: Record<PaymentVerificationStatus, string> = {
  PENDING: "Pendiente de verificación",
  VERIFIED: "Pago verificado",
  REJECTED: "Pago rechazado",
};

export function OrderPaymentInfo({ order }: OrderPaymentInfoProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [activeReceiptId, setActiveReceiptId] = useState<string | null>(null);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const { mutate: approvePayment, isPending: isApproving } =
    useApprovePayment();
  const { mutate: rejectPayment, isPending: isRejecting } = useRejectPayment();

  const receipts = order.receipts ?? [];
  const latestReceipt = receipts[0] ?? null;
  const legacyReceipt =
    !receipts.length && order.receiptImage
      ? {
          id: `legacy-${order.id}`,
          orderId: order.id,
          imageUrl: order.receiptImage,
          status: order.paymentStatus ?? "PENDING",
          notes: order.paymentVerificationNotes,
          verifiedBy: order.verifiedBy,
          verifiedAt: order.verifiedAt,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          legacy: true,
        }
      : null;
  const displayReceipts = legacyReceipt ? [legacyReceipt] : receipts;

  const isLegacyReceipt = (receiptId: string) =>
    receiptId.startsWith("legacy-");

  const needsVerification =
    !!latestReceipt &&
    latestReceipt.status === "PENDING" &&
    order.paymentMethod !== "efectivo" &&
    !isLegacyReceipt(latestReceipt.id);

  const handleApprovePayment = (receiptId: string) => {
    approvePayment({ receiptId });
  };

  const handleRejectPayment = () => {
    if (!rejectNotes.trim()) {
      toast.error("Ingresa el motivo del rechazo");
      return;
    }

    if (!activeReceiptId) {
      toast.error("No se encontró el comprobante");
      return;
    }

    rejectPayment({ receiptId: activeReceiptId, notes: rejectNotes }, {
      onSuccess: () => {
        setRejectDialogOpen(false);
        setRejectNotes("");
        setActiveReceiptId(null);
      },
    });
  };

  const handleZoomImage = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setImageZoomOpen(true);
  };

  return (
    <>
      <div className="bg-pink-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-pink-500" />
            Información de Pago
          </h3>
          {order.paymentStatus && (
            <Badge className={paymentStatusColors[order.paymentStatus]}>
              {paymentStatusLabels[order.paymentStatus]}
            </Badge>
          )}
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Método:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {order.paymentMethod
                ? paymentMethodLabels[order.paymentMethod] ||
                  order.paymentMethod
                : "No especificado"}
            </span>
          </div>

          {order.paymentId && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                ID transacción:
              </span>
              <span className="font-mono text-xs">{order.paymentId}</span>
            </div>
          )}

          {displayReceipts.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Historial de comprobantes:
              </p>

              <div className="space-y-4">
                {displayReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(receipt.createdAt).toLocaleString("es-PE")}
                      </span>
                      <Badge className={paymentStatusColors[receipt.status]}>
                        {paymentStatusLabels[receipt.status]}
                      </Badge>
                    </div>

                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 group">
                      <Image
                        src={receipt.imageUrl}
                        alt="Comprobante"
                        fill
                        sizes="(max-width: 768px) 90vw, 480px"
                        className="object-contain"
                      />
                      <div
                        onClick={() => handleZoomImage(receipt.imageUrl)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleZoomImage(receipt.imageUrl)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Zoom
                      </Button>
                      <a
                        href={receipt.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Abrir en nueva pestaña
                      </a>
                    </div>

                    {receipt.notes && receipt.status === "REJECTED" && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Motivo del rechazo:
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {receipt.notes}
                        </p>
                      </div>
                    )}

                    {isLegacyReceipt(receipt.id) && (
                      <p className="mt-3 text-xs text-yellow-700">
                        Comprobante antiguo: no se puede validar automáticamente.
                      </p>
                    )}

                    {needsVerification && receipt.id === latestReceipt?.id && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">
                          Verificación de pago:
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprovePayment(receipt.id)}
                            disabled={isApproving}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {isApproving ? "Aprobando..." : "Aprobar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setActiveReceiptId(receipt.id);
                              setRejectDialogOpen(true);
                            }}
                            disabled={isRejecting}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          setRejectDialogOpen(open);
          if (!open) {
            setRejectNotes("");
            setActiveReceiptId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-6 h-6" />
              Rechazar Comprobante
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="reject-notes">Motivo del rechazo *</Label>
            <Textarea
              id="reject-notes"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Ej: El monto no coincide, imagen borrosa..."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectPayment}
                disabled={isRejecting || !rejectNotes.trim()}
              >
                {isRejecting ? "Rechazando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="relative">
            {zoomedImage && (
              <Image
                src={zoomedImage}
                alt="Comprobante zoom"
                width={900}
                height={900}
                sizes="(max-width: 768px) 90vw, 900px"
                className="h-auto w-full object-contain"
              />
            )}
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setImageZoomOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
