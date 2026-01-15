import { CartItem, CustomerInfo } from "@/types/cart.types";
import { Order, OrderStatus } from "@/types/orders";

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
  let message = "🍽️ *NUEVO PEDIDO - DAHS FOOD*\n\n";

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

const statusMessages: Record<OrderStatus, string> = {
  PENDING: "Tu pedido está siendo revisado. Pronto te confirmaremos.",
  CONFIRMED: "✅ Tu pedido ha sido confirmado y está en preparación.",
  PREPARING: "👨‍🍳 Tu pedido está siendo preparado con mucho cariño.",
  OUT_FOR_DELIVERY: "🚗 Tu pedido está en camino hacia tu ubicación.",
  DELIVERED: "🎉 Tu pedido ha sido entregado. ¡Gracias por tu compra!",
  CANCELLED: "❌ Tu pedido ha sido cancelado. Contactanos si tienes dudas.",
};

export const generateStatusUpdateMessage = (order: Order): string => {
  const statusMessage = statusMessages[order.status];

  let message = `🍽️ *DAHS FOOD - ACTUALIZACIÓN DE PEDIDO*\n\n`;
  message += `📦 *Pedido #${order.orderNumber}*\n\n`;
  message += `${statusMessage}\n\n`;

  message += "💰 *Resumen del pedido:*\n";
  message += `Total: ${formatPrice(order.total)}\n`;
  message += `Método de pago: ${order.paymentMethod || "No especificado"}\n`;

  if (order.estimatedDeliveryTime) {
    message += `\n🕐 Entrega estimada: ${formatPrice(order.total)}\n`;
  }

  message += "\n📞 ¿Dudas? Contáctanos por este chat.\n";
  message += "¡Gracias por elegir Dahs Food! 🌟";

  return message;
};

export const getWhatsAppLink = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const sendStatusUpdateWhatsApp = (order: Order): void => {
  const message = generateStatusUpdateMessage(order);
  const link = getWhatsAppLink(order.customerPhone, message);
  window.open(link, "_blank");
};

export const sendCustomWhatsAppMessage = (phone: string, message: string): void => {
  const link = getWhatsAppLink(phone, message);
  window.open(link, "_blank");
};
