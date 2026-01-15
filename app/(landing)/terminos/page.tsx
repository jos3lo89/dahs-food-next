import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Desayunos Dulces",
  description: "Términos y condiciones de uso de Desayunos Dulces",
};

export default function TerminosPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-pink-900">
              Términos y Condiciones
            </h1>
          </div>

          <p className="text-gray-600">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-700 mb-3">
              Bienvenido a Desayunos Dulces. Al acceder y utilizar este sitio
              web y nuestro servicio de delivery de desayunos, usted acepta
              estar sujeto a estos Términos y Condiciones, todas las leyes y
              regulaciones aplicables, y acepta que es responsable del
              cumplimiento de las leyes locales aplicables.
            </p>
            <p className="text-gray-700">
              Si no está de acuerdo con alguno de estos términos, tiene
              prohibido usar o acceder a este sitio y servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              2. Descripción del Servicio
            </h2>
            <p className="text-gray-700 mb-3">
              Desayunos Dulces ofrece un servicio de venta y entrega a domicilio
              de desayunos y productos alimenticios preparados. Nuestros
              servicios incluyen:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Venta de desayunos preparados y productos complementarios</li>
              <li>Servicio de entrega a domicilio (delivery)</li>
              <li>Plataforma de pedidos en línea</li>
              <li>Opciones de pago en línea y contra entrega</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              3. Información del Usuario
            </h2>
            <p className="text-gray-700 mb-3">
              Al realizar un pedido, usted se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Proporcionar información verídica, precisa y completa</li>
              <li>Mantener actualizada su dirección de entrega</li>
              <li>
                Proporcionar un número de teléfono activo para coordinaciones
              </li>
              <li>
                Ser mayor de 18 años o contar con autorización de un tutor
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              4. Realización de Pedidos
            </h2>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              4.1. Proceso de Pedido
            </h3>
            <p className="text-gray-700 mb-3">
              Los pedidos se realizan a través de nuestro sitio web. Al
              confirmar un pedido, usted acepta comprar los productos
              seleccionados bajo las condiciones especificadas.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              4.2. Confirmación
            </h3>
            <p className="text-gray-700 mb-3">
              Recibirá una confirmación del pedido vía WhatsApp y/o correo
              electrónico. Esta confirmación no constituye aceptación del
              pedido, sino solo un acuse de recibo.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              4.3. Disponibilidad
            </h3>
            <p className="text-gray-700">
              Todos los productos están sujetos a disponibilidad. Nos reservamos
              el derecho de limitar las cantidades de cualquier producto o
              servicio que ofrecemos. En caso de no disponibilidad, nos
              comunicaremos con usted para ofrecer alternativas o cancelar el
              pedido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              5. Precios y Métodos de Pago
            </h2>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              5.1. Precios
            </h3>
            <p className="text-gray-700 mb-3">
              Todos los precios están expresados en Soles Peruanos (PEN) e
              incluyen el IGV cuando corresponda. Los precios pueden cambiar sin
              previo aviso, pero los cambios no afectarán pedidos ya
              confirmados.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              5.2. Métodos de Pago Aceptados
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Yape:</strong> Transferencia inmediata con QR
              </li>
              <li>
                <strong>Plin:</strong> Transferencia bancaria rápida
              </li>
              <li>
                <strong>Tarjetas:</strong> Débito y crédito (próximamente)
              </li>
              <li>
                <strong>Efectivo:</strong> Pago contra entrega
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              5.3. Comprobantes de Pago
            </h3>
            <p className="text-gray-700">
              Para pagos con Yape o Plin, es obligatorio subir el comprobante de
              transferencia. Su pedido será confirmado una vez verificado el
              pago, lo cual puede tomar hasta 15 minutos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              6. Política de Entrega (Delivery)
            </h2>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              6.1. Zonas de Cobertura
            </h3>
            <p className="text-gray-700 mb-3">
              Actualmente realizamos entregas en Lima Metropolitana. Consulte
              disponibilidad para zonas específicas al momento de realizar su
              pedido.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              6.2. Tiempo de Entrega
            </h3>
            <p className="text-gray-700 mb-3">
              El tiempo estimado de entrega es de 30 a 45 minutos desde la
              confirmación del pedido. Este tiempo puede variar según:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Distancia del punto de entrega</li>
              <li>Tráfico y condiciones climáticas</li>
              <li>Volumen de pedidos</li>
              <li>Disponibilidad de repartidores</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              6.3. Envío
            </h3>
            <p className="text-gray-700">
              El envío está incluido en el precio de los productos. No hay costo adicional por entrega.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              6.4. Recepción del Pedido
            </h3>
            <p className="text-gray-700">
              El cliente o una persona autorizada debe estar disponible en la
              dirección de entrega. Si no hay nadie disponible, intentaremos
              contactarlo por teléfono. Si no podemos completar la entrega, el
              pedido podrá ser cancelado con cargo de envío.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              7. Cancelaciones y Devoluciones
            </h2>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              7.1. Cancelación por el Cliente
            </h3>
            <p className="text-gray-700 mb-3">
              Puede cancelar su pedido sin costo hasta 10 minutos después de
              confirmado. Después de este tiempo, el pedido podría estar en
              preparación y no será posible cancelarlo.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              7.2. Cancelación por Desayunos Dulces
            </h3>
            <p className="text-gray-700 mb-3">
              Nos reservamos el derecho de cancelar pedidos en casos de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Falta de disponibilidad de productos</li>
              <li>Información de contacto incorrecta</li>
              <li>Problemas con la verificación del pago</li>
              <li>Condiciones climáticas extremas</li>
              <li>Dirección fuera de zona de cobertura</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              7.3. Reembolsos
            </h3>
            <p className="text-gray-700">
              En caso de cancelación procedente, el reembolso se realizará en un
              plazo de 3 a 5 días hábiles mediante el mismo método de pago
              utilizado.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              7.4. Productos con Problemas
            </h3>
            <p className="text-gray-700">
              Si recibe un producto en mal estado, debe reportarlo dentro de las
              2 horas siguientes a la entrega. Envíe fotos del producto al
              WhatsApp de atención al cliente para evaluación y reemplazo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              8. Calidad y Seguridad Alimentaria
            </h2>
            <p className="text-gray-700 mb-3">Nos comprometemos a:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Utilizar ingredientes frescos y de calidad</li>
              <li>Mantener estándares de higiene y manipulación</li>
              <li>Preparar los alimentos el mismo día de la entrega</li>
              <li>Cumplir con normativas sanitarias vigentes</li>
              <li>Mantener la cadena de frío cuando corresponda</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              8.1. Alergias e Intolerancias
            </h3>
            <p className="text-gray-700">
              Si tiene alergias o intolerancias alimentarias, indíquelo en las
              notas del pedido. Sin embargo, debido a las condiciones de nuestra
              cocina, no podemos garantizar la ausencia total de alérgenos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              9. Propiedad Intelectual
            </h2>
            <p className="text-gray-700">
              Todo el contenido del sitio web, incluyendo textos, gráficos,
              logos, imágenes, y software, es propiedad de Desayunos Dulces y
              está protegido por las leyes de propiedad intelectual de Perú.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              10. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700 mb-3">
              Desayunos Dulces no será responsable por:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Retrasos en la entrega por causas de fuerza mayor</li>
              <li>Daños derivados del mal uso o almacenamiento de productos</li>
              <li>Reacciones alérgicas no reportadas previamente</li>
              <li>Problemas técnicos del sitio web o plataforma de pago</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              11. Modificaciones de los Términos
            </h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entrarán en vigor inmediatamente después de
              su publicación en el sitio web. El uso continuado del servicio
              después de dichos cambios constituye su aceptación de los nuevos
              términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              12. Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-gray-700">
              Estos Términos y Condiciones se rigen por las leyes de la
              República del Perú. Cualquier disputa derivada de estos términos
              será sometida a la jurisdicción exclusiva de los tribunales de
              Lima, Perú.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              13. Contacto
            </h2>
            <p className="text-gray-700 mb-3">
              Para cualquier consulta sobre estos Términos y Condiciones, puede
              contactarnos a través de:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>WhatsApp:</strong> {whatsappPhone}
              </li>
              <li>
                <strong>Email:</strong> info@desayunosdulces.pe
              </li>
              <li>
                <strong>Dirección:</strong> Av. Principal 123, Miraflores, Lima,
                Perú
              </li>
            </ul>
          </section>

          <div className="pt-6 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Al utilizar nuestros servicios, usted reconoce que ha leído y
              comprendido estos Términos y Condiciones y acepta estar sujeto a
              ellos.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition">
              Volver a la Tienda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
