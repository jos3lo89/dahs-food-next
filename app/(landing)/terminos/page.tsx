import type { ReactElement } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

interface BusinessInfo {
  legalName: string;
  ruc: string;
  tradeName: string;
  activity: string;
  serviceMode: string;
  salesChannel: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos, cambios, devoluciones y reclamos para pedidos en DAHS.",
};

export default function TerminosPage(): ReactElement {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "982 294 241";
  const whatsappDigits = whatsappPhone.replace(/\D/g, "");

  const businessInfo: BusinessInfo = {
    legalName: "DAHS",
    ruc: "10600469059",
    tradeName: "DAHS",
    activity: "Venta y preparación de desayunos, jugos naturales y extras",
    serviceMode: "Delivery (pedidos vía web y canales digitales)",
    salesChannel: "Página web propia con pagos en línea",
  };

  const contactInfo: ContactInfo = {
    email: "dahsjhoss@gmail.com",
    phone: whatsappPhone,
    address: "Chincheros, Chincheros, Apurímac – Perú",
  };

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
              1. Identificación del negocio
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Nombre legal:</strong> {businessInfo.legalName}
              </li>
              <li>
                <strong>RUC:</strong> {businessInfo.ruc}
              </li>
              <li>
                <strong>Razón social:</strong> {businessInfo.tradeName}
              </li>
              <li>
                <strong>Actividad:</strong> {businessInfo.activity}
              </li>
              <li>
                <strong>Modalidad de atención:</strong>{" "}
                {businessInfo.serviceMode}
              </li>
              <li>
                <strong>Canal de ventas:</strong> {businessInfo.salesChannel}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              2. Uso del sitio web
            </h2>
            <p className="text-gray-700">
              El acceso y uso del sitio web implica la aceptación plena de estos
              Términos y Condiciones. El usuario se compromete a utilizar la web
              de manera lícita y conforme a la normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              3. Servicio ofrecido
            </h2>
            <p className="text-gray-700">
              DAHS ofrece la preparación y venta de desayunos, jugos naturales y
              extras mediante la modalidad de delivery, según disponibilidad y
              cobertura establecida.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              4. Responsabilidad del proveedor
            </h2>
            <p className="text-gray-700">
              DAHS se compromete a brindar productos elaborados bajo estándares
              de calidad e higiene, y a atender los pedidos confirmados a través
              de sus canales oficiales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              5. Responsabilidad del consumidor
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Brindar datos correctos para la entrega del pedido.</li>
              <li>Revisar el producto al momento de recibirlo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              6. Casos fortuitos o fuerza mayor
            </h2>
            <p className="text-gray-700 mb-3">
              DAHS no será responsable por demoras o incumplimientos ocasionados
              por hechos ajenos a su control, tales como:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Condiciones climáticas.</li>
              <li>Tráfico.</li>
              <li>Bloqueos.</li>
              <li>Fallas de comunicación.</li>
              <li>Otros casos fortuitos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              7. Política de cambios y devoluciones
            </h2>

            <h3 className="text-xl font-semibold text-pink-800 mb-3">
              7.1. Plazo para solicitar
            </h3>
            <p className="text-gray-700 mb-3">
              El cliente puede solicitar un cambio o reembolso dentro de las 24
              horas posteriores a la recepción del pedido, solo en los
              siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Producto en mal estado al momento de la entrega.</li>
              <li>Producto equivocado.</li>
              <li>Pedido incompleto.</li>
              <li>Incidencia atribuible a la preparación o al delivery.</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3">
              7.2. Condiciones para la evaluación
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Reportar el problema dentro del plazo indicado.</li>
              <li>Enviar evidencia (foto o video) del producto y/o pedido.</li>
              <li>Conservar el empaque original cuando aplique.</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3">
              7.3. Productos no sujetos a devolución
            </h3>
            <p className="text-gray-700 mb-3">
              Por tratarse de productos perecibles y de consumo inmediato, no se
              aceptan devoluciones por cambio de opinión, gusto personal o
              consumo parcial, salvo que exista un defecto o error atribuible al
              negocio.
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3">
              7.4. Solución ofrecida
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Reposición del producto.</li>
              <li>Envío del faltante.</li>
              <li>Reembolso total o parcial.</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3">
              7.5. Reembolsos
            </h3>
            <p className="text-gray-700">
              El reembolso se realizará por el mismo medio de pago utilizado en
              la compra, una vez validada la solicitud. Los tiempos de
              procesamiento pueden variar según la entidad financiera o el
              método de pago.
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              8. Libro de reclamaciones
            </h2>
            <p className="text-gray-700 mb-3">
              DAHS cuenta con un Libro de Reclamaciones virtual integrado en la
              web, conforme al Código de Protección y Defensa del Consumidor.
            </p>
            <p className="text-gray-700 mb-3">Datos obligatorios del formulario:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Nombre del consumidor.</li>
              <li>DNI.</li>
              <li>Dirección.</li>
              <li>Correo electrónico.</li>
              <li>Detalle del reclamo o queja.</li>
              <li>Pedido del consumidor.</li>
            </ul>
            <div className="bg-pink-50 border-l-4 border-pink-400 p-4">
              <p className="text-pink-900 text-sm">
                “Conforme a lo establecido en el Código de Protección y Defensa
                del Consumidor, este establecimiento cuenta con un Libro de
                Reclamaciones virtual a disposición del consumidor.”
              </p>
            </div>
          </section> */}

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              8. Aceptación
            </h2>
            <p className="text-gray-700">
              El usuario declara: “He leído y acepto los Términos y Condiciones
              y la Política de Cambios y Devoluciones.”
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              9. Medios de contacto
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Correo electrónico:</strong> {contactInfo.email}
              </li>
              <li>
                <strong>WhatsApp / Teléfono:</strong>{" "}
                <a
                  href={`tel:${whatsappDigits}`}
                  className="text-pink-700 hover:text-pink-900 transition"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <strong>Dirección fiscal:</strong> {contactInfo.address}
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
