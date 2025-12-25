import { CartItem, CustomerInfo } from "@/types/cart.types";

interface GenerateWhatsAppMessageParams {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  customerInfo: CustomerInfo;
  promotionCode?: string;
  businessPhone: string;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(price);
};

export const generateWhatsAppMessage = ({
  items,
  subtotal,
  discount,
  total,
  customerInfo,
  promotionCode,
}: Omit<GenerateWhatsAppMessageParams, "businessPhone">): string => {
  let message = "🍽️ *NUEVO PEDIDO - DESAYUNOS DELICIOSOS*\n\n";

  message += "👤 *DATOS DEL CLIENTE*\n";
  message += `Nombre: ${customerInfo.name}\n`;
  message += `Teléfono: ${customerInfo.phone}\n`;
  message += `Dirección: ${customerInfo.address}\n`;

  if (customerInfo.notes) {
    message += `Notas: ${customerInfo.notes}\n`;
  }

  message += "\n";

  message += "📋 *PEDIDO*\n";
  message += "━━━━━━━━━━━━━━━━━━━━\n";

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    message += `• ${item.name}\n`;
    message += `  Cantidad: ${item.quantity}\n`;
    message += `  Precio unit: ${formatPrice(item.price)}\n`;
    message += `  Subtotal: ${formatPrice(itemTotal)}\n\n`;
  });

  message += "━━━━━━━━━━━━━━━━━━━━\n";
  message += `Subtotal: ${formatPrice(subtotal)}\n`;

  if (discount > 0) {
    message += `Descuento (${promotionCode || "Promoción"}): -${formatPrice(
      discount
    )}\n`;
  }

  message += `\n💰 *TOTAL A PAGAR: ${formatPrice(total)}*\n\n`;
  message += "¡Gracias por tu pedido! 🎉\n";
  message += "Te contactaremos pronto para confirmar.";

  return message;
};

export const sendWhatsAppOrder = (
  params: GenerateWhatsAppMessageParams
): void => {
  const message = generateWhatsAppMessage(params);
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = params.businessPhone.replace(/\D/g, "");
  const link = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  window.open(link, "_blank");
};
