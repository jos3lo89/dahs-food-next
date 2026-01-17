import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo Dahs Jhoss protege tus datos, pedidos y comunicaciones en nuestro servicio de delivery.",
};

export default function PrivacidadPage() {
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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-900">
                En <strong>Desayunos Dulces</strong>, nos comprometemos a
                proteger su privacidad y sus datos personales. Esta política
                explica cómo recopilamos, usamos, almacenamos y protegemos su
                información cuando utiliza nuestros servicios.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-pink-500" />
              1. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              1.1. Información Proporcionada Directamente
            </h3>
            <p className="text-gray-700 mb-3">
              Cuando realiza un pedido en nuestro sitio web, recopilamos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>
                <strong>Datos de identificación:</strong> Nombre completo
              </li>
              <li>
                <strong>Datos de contacto:</strong> Número de teléfono/WhatsApp,
                dirección de email (opcional)
              </li>
              <li>
                <strong>Dirección de entrega:</strong> Dirección completa,
                distrito, ciudad, referencias
              </li>
              <li>
                <strong>Notas del pedido:</strong> Preferencias, instrucciones
                especiales
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              1.2. Información de Pago
            </h3>
            <p className="text-gray-700 mb-3">
              Cuando realiza un pago, podemos recopilar:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>
                <strong>Comprobantes de pago:</strong> Capturas de pantalla de
                transferencias (Yape, Plin)
              </li>
              <li>
                <strong>Método de pago seleccionado:</strong> Yape, Plin,
                Tarjeta, Efectivo
              </li>
              <li>
                <strong>ID de transacción:</strong> Proporcionado por pasarelas
                de pago
              </li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-yellow-900 text-sm">
                <strong>Importante:</strong> No almacenamos información completa
                de tarjetas de crédito/débito. Los pagos con tarjeta son
                procesados por plataformas certificadas de pago (Culqi) que
                cumplen con estándares PCI DSS.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              1.3. Información de Navegación
            </h3>
            <p className="text-gray-700 mb-3">Automáticamente recopilamos:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas en nuestro sitio</li>
              <li>Fecha y hora de acceso</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-pink-500" />
              2. Cómo Usamos su Información
            </h2>

            <p className="text-gray-700 mb-3">
              Utilizamos la información recopilada para:
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              2.1. Procesamiento de Pedidos
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Confirmar y procesar su pedido</li>
              <li>Preparar los productos solicitados</li>
              <li>Coordinar la entrega en la dirección proporcionada</li>
              <li>Procesar y verificar pagos</li>
              <li>Enviar confirmaciones y actualizaciones del pedido</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              2.2. Comunicación con el Cliente
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>
                Notificarle sobre el estado de su pedido vía WhatsApp o email
              </li>
              <li>Responder consultas y solicitudes de soporte</li>
              <li>Informarle sobre cambios en el pedido o delivery</li>
              <li>
                Enviar información sobre promociones (solo si acepta recibir
                marketing)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              2.3. Mejora del Servicio
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Analizar preferencias y patrones de compra</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Personalizar su experiencia de compra</li>
              <li>Prevenir fraudes y garantizar seguridad</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              2.4. Cumplimiento Legal
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                Cumplir con obligaciones fiscales (emisión de comprobantes)
              </li>
              <li>Responder a requerimientos legales o de autoridades</li>
              <li>Proteger nuestros derechos legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-pink-500" />
              3. Compartir su Información
            </h2>

            <p className="text-gray-700 mb-3">
              Podemos compartir su información únicamente en las siguientes
              circunstancias:
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              3.1. Proveedores de Servicio
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>
                <strong>Servicios de delivery:</strong> Compartimos nombre,
                teléfono y dirección con nuestros repartidores
              </li>
              <li>
                <strong>Procesadores de pago:</strong> Culqi, Yape, Plin para
                procesar transacciones
              </li>
              <li>
                <strong>Servicios de mensajería:</strong> WhatsApp Business API
                para notificaciones
              </li>
              <li>
                <strong>Hosting y almacenamiento:</strong> Cloudinary para
                imágenes, proveedores cloud para datos
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              3.2. Requisitos Legales
            </h3>
            <p className="text-gray-700 mb-3">
              Podemos divulgar información cuando sea requerido por ley, por
              orden judicial, o cuando sea necesario para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Cumplir con procesos legales</li>
              <li>Proteger nuestros derechos y propiedad</li>
              <li>Prevenir fraude o actividad ilegal</li>
              <li>Proteger la seguridad de nuestros usuarios</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
              <p className="text-green-900">
                <strong>Garantía:</strong> Nunca vendemos, alquilamos ni
                compartimos su información personal con terceros para fines de
                marketing sin su consentimiento explícito.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-pink-500" />
              4. Seguridad de sus Datos
            </h2>

            <p className="text-gray-700 mb-3">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger su información:
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              4.1. Medidas Técnicas
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>
                <strong>Cifrado SSL/TLS:</strong> Todas las comunicaciones están
                cifradas
              </li>
              <li>
                <strong>Servidores seguros:</strong> Datos almacenados en
                servidores con protección avanzada
              </li>
              <li>
                <strong>Firewalls:</strong> Protección contra accesos no
                autorizados
              </li>
              <li>
                <strong>Backups regulares:</strong> Copias de seguridad
                automáticas
              </li>
              <li>
                <strong>Autenticación:</strong> Control de acceso a datos
                sensibles
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              4.2. Medidas Organizativas
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Acceso limitado solo a personal autorizado</li>
              <li>Capacitación en protección de datos</li>
              <li>Políticas internas de seguridad</li>
              <li>Auditorías periódicas de seguridad</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
              <p className="text-orange-900 text-sm">
                <strong>Nota importante:</strong> Ningún método de transmisión
                por Internet o almacenamiento electrónico es 100% seguro. Aunque
                nos esforzamos por proteger su información, no podemos
                garantizar su seguridad absoluta.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              5. Cookies y Tecnologías Similares
            </h2>

            <p className="text-gray-700 mb-3">
              Utilizamos cookies y tecnologías similares para:
            </p>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              5.1. Tipos de Cookies que Usamos
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies Estrictamente Necesarias
                </h4>
                <p className="text-gray-700 text-sm">
                  Esenciales para el funcionamiento del sitio. Permiten navegar
                  y utilizar características básicas como el carrito de compras.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies de Rendimiento
                </h4>
                <p className="text-gray-700 text-sm">
                  Recopilan información sobre cómo los visitantes usan el sitio
                  para mejorar su funcionamiento.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies de Funcionalidad
                </h4>
                <p className="text-gray-700 text-sm">
                  Permiten recordar sus preferencias (idioma, región, carrito
                  guardado).
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-4">
              5.2. Gestión de Cookies
            </h3>
            <p className="text-gray-700">
              Puede configurar su navegador para rechazar cookies. Sin embargo,
              algunas funcionalidades del sitio podrían no estar disponibles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              6. Sus Derechos sobre sus Datos
            </h2>

            <p className="text-gray-700 mb-3">
              Conforme a la Ley de Protección de Datos Personales del Perú (Ley
              N° 29733), usted tiene los siguientes derechos:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-pink-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Derecho de Acceso
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Solicitar información sobre qué datos personales tenemos
                    sobre usted
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-pink-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Derecho de Rectificación
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Solicitar la corrección de datos inexactos o incompletos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-pink-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Derecho de Cancelación
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Solicitar la eliminación de sus datos cuando ya no sean
                    necesarios
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-pink-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Derecho de Oposición
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Oponerse al procesamiento de sus datos para ciertos fines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-pink-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Derecho de Revocación
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Retirar su consentimiento para el tratamiento de datos
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-pink-800 mb-3 mt-6">
              6.1. Cómo Ejercer sus Derechos
            </h3>
            <p className="text-gray-700 mb-3">
              Para ejercer cualquiera de estos derechos, puede contactarnos
              mediante:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <strong>Email:</strong> privacidad@desayunosdulces.pe
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <strong>WhatsApp:</strong> {whatsappPhone}
              </li>
            </ul>
            <p className="text-gray-700 mt-3 text-sm">
              Responderemos su solicitud en un plazo máximo de 10 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              7. Retención de Datos
            </h2>

            <p className="text-gray-700 mb-3">
              Conservamos su información personal durante el tiempo necesario
              para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Cumplir con los fines para los que fue recopilada</li>
              <li>
                Cumplir con obligaciones legales (registros contables: 5 años)
              </li>
              <li>Resolver disputas y hacer cumplir acuerdos</li>
            </ul>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Períodos de Retención:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • <strong>Datos de pedidos:</strong> 5 años (obligación
                  fiscal)
                </li>
                <li>
                  • <strong>Datos de contacto:</strong> Hasta que solicite su
                  eliminación
                </li>
                <li>
                  • <strong>Comprobantes de pago:</strong> 5 años (obligación
                  fiscal)
                </li>
                <li>
                  • <strong>Cookies:</strong> Según configuración (generalmente
                  1 año)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              8. Protección de Menores
            </h2>
            <p className="text-gray-700">
              Nuestros servicios están dirigidos a personas mayores de 18 años.
              No recopilamos intencionalmente información de menores de edad sin
              el consentimiento de sus padres o tutores. Si descubrimos que
              hemos recopilado información de un menor sin autorización, la
              eliminaremos de inmediato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              9. Enlaces a Sitios Externos
            </h2>
            <p className="text-gray-700">
              Nuestro sitio puede contener enlaces a sitios web de terceros
              (redes sociales, pasarelas de pago, etc.). No somos responsables
              de las prácticas de privacidad de estos sitios. Le recomendamos
              leer sus políticas de privacidad antes de proporcionar
              información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              10. Transferencias Internacionales de Datos
            </h2>
            <p className="text-gray-700 mb-3">
              Algunos de nuestros proveedores de servicios pueden estar ubicados
              fuera del Perú (servicios cloud, CDN). Cuando transferimos datos
              internacionalmente, nos aseguramos de que:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Los datos estén protegidos con estándares adecuados</li>
              <li>
                Se cumplan las regulaciones de protección de datos aplicables
              </li>
              <li>
                Los proveedores tengan certificaciones de seguridad reconocidas
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              11. Cambios a esta Política
            </h2>
            <p className="text-gray-700 mb-3">
              Podemos actualizar esta Política de Privacidad periódicamente. Los
              cambios significativos serán notificados mediante:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Aviso destacado en nuestro sitio web</li>
              <li>Correo electrónico (si tenemos su dirección)</li>
              <li>Mensaje de WhatsApp para cambios importantes</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Le recomendamos revisar esta política periódicamente para estar
              informado sobre cómo protegemos su información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-pink-500" />
              12. Contacto - Oficial de Protección de Datos
            </h2>

            <p className="text-gray-700 mb-4">
              Si tiene preguntas, inquietudes o desea ejercer sus derechos sobre
              sus datos personales, puede contactarnos:
            </p>

            <div className="bg-pink-50 rounded-lg p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Razón Social:</p>
                <p className="font-semibold text-gray-900">
                  Desayunos Dulces SAC
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Email de Privacidad:
                </p>
                <p className="font-semibold text-gray-900">
                  privacidad@desayunosdulces.pe
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">WhatsApp:</p>
                <p className="font-semibold text-gray-900">{whatsappPhone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Dirección:</p>
                <p className="font-semibold text-gray-900">
                  Av. Principal 123, Miraflores, Lima, Perú
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Horario de Atención:
                </p>
                <p className="font-semibold text-gray-900">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <p className="text-blue-900 text-sm">
                <strong>Autoridad de Protección de Datos:</strong> Si considera
                que sus derechos han sido vulnerados, puede presentar una queja
                ante la Autoridad Nacional de Protección de Datos Personales del
                Perú a través de{" "}
                <a
                  href="https://www.gob.pe/minjus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-800"
                >
                  www.gob.pe/minjus
                </a>
              </p>
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
