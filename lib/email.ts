import nodemailer from "nodemailer";

// Definimos la interfaz para los datos que recibirá el email
interface OrderEmailDetails {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  items: Array<{
    quantity: number;
    productName: string;
    price: number;
  }>;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const currentEmailAdmin = process.env.CURRENT_ADMIN_EMAIL!;

export const sendNotifyOrderToAdmin = async (order: OrderEmailDetails) => {
  // Construimos la lista de productos en HTML
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px;">${item.productName}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">S/ ${item.price.toFixed(2)}</td>
      </tr>
    `,
    )
    .join("");

  const mailOptions = {
    from: '"Sistema de Pedidos" <noreply@dahsjhoss.com>', // Cambia esto por tu nombre
    to: currentEmailAdmin, // Se envía al admin definido en tus variables
    subject: `🔔 Nueva Orden Recibida: ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f97316; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">¡Nueva Orden Recibida!</h2>
          <p style="margin: 5px 0 0;">Orden #${order.orderNumber}</p>
        </div>
        
        <div style="padding: 20px;">
          <h3 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 5px;">Datos del Cliente</h3>
          <p><strong>Nombre:</strong> ${order.customerName}</p>
          <p><strong>Teléfono:</strong> ${order.customerPhone}</p>
          <p><strong>Dirección:</strong> ${order.customerAddress}</p>

          <h3 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 5px; margin-top: 20px;">Detalle del Pedido</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Producto</th>
                <th style="padding: 10px; text-align: center;">Cant.</th>
                <th style="padding: 10px; text-align: right;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">TOTAL:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">S/ ${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/pedidos/${order.orderId}" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Orden en el Panel</a>
          </div>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          Este es un correo automático del sistema.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Correo de notificación enviado al admin");
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
};
