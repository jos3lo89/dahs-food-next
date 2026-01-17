import type { ReactElement } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Shield } from "lucide-react";

interface BusinessInfo {
  legalName: string;
  ruc: string;
  tradeName: string;
  activity: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo DAHS gestiona la información de sus pedidos y contacto.",
};

export default function PrivacidadPage(): ReactElement {
  const whatsappPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "982 294 241";
  const whatsappDigits = whatsappPhone.replace(/\D/g, "");

  const businessInfo: BusinessInfo = {
    legalName: "DAHS",
    ruc: "10600469059",
    tradeName: "DAHS",
    activity: "Venta y preparación de desayunos, jugos naturales y extras",
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-pink-900">
              Política de Privacidad
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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-900">
                En <strong>{businessInfo.tradeName}</strong> protegemos los datos
                personales que nos entregas al realizar pedidos en la web y por
                canales digitales. Esta política explica qué información
                recopilamos, cómo la usamos y cómo puedes contactarnos.
              </p>
            </div>
          </section>

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
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              2. Información que recopilamos
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Datos de contacto para coordinar la entrega.</li>
              <li>Dirección de entrega y referencias indicadas por el cliente.</li>
              <li>Detalles del pedido y observaciones relacionadas.</li>
              <li>Comprobantes de pago cuando corresponda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              3. Uso de la información
            </h2>
            <p className="text-gray-700 mb-3">
              Utilizamos tus datos para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Preparar y entregar correctamente tu pedido.</li>
              <li>Confirmar pagos y dar seguimiento al delivery.</li>
              <li>Atender consultas o reclamos relacionados al servicio.</li>
              <li>Cumplir obligaciones legales o requerimientos de autoridad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              4. Conservación y seguridad
            </h2>
            <p className="text-gray-700 mb-3">
              Conservamos la información únicamente durante el tiempo necesario
              para la gestión del pedido y obligaciones legales. Implementamos
              medidas de seguridad razonables para proteger los datos contra
              accesos no autorizados o uso indebido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              5. Derechos del usuario
            </h2>
            <p className="text-gray-700 mb-3">
              Puedes solicitar acceso, rectificación o eliminación de tus datos
              personales escribiéndonos a los medios de contacto indicados.
              Atenderemos tu solicitud dentro de los plazos legales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-pink-500" />
              6. Contacto
            </h2>

            <div className="bg-pink-50 rounded-lg p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Razón Social:</p>
                <p className="font-semibold text-gray-900">
                  {businessInfo.tradeName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Email:</p>
                <p className="font-semibold text-gray-900">
                  {contactInfo.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">WhatsApp / Teléfono:</p>
                <a
                  href={`tel:${whatsappDigits}`}
                  className="font-semibold text-gray-900 hover:text-pink-700 transition"
                >
                  {contactInfo.phone}
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Dirección fiscal:</p>
                <p className="font-semibold text-gray-900">
                  {contactInfo.address}
                </p>
              </div>
            </div>
          </section>

          <div className="pt-6 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Al utilizar nuestros servicios, usted reconoce que ha leído y
              comprendido esta Política de Privacidad y acepta el tratamiento de
              sus datos personales conforme a lo establecido en la misma.
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
