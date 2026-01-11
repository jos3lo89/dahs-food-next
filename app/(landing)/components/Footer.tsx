"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  CreditCard,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-r from-pink-200 to-pink-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo/logo.webp"
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-pink-700 text-sm">
              Desayunos frescos y deliciosos preparados con los mejores
              ingredientes para alegrar tu mañana.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-pink-900 mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  className="text-pink-700 hover:text-pink-900 transition text-sm"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#promociones"
                  className="text-pink-700 hover:text-pink-900 transition text-sm"
                >
                  Promociones
                </a>
              </li>
              <li>
                <a
                  href="#desayunos"
                  className="text-pink-700 hover:text-pink-900 transition text-sm"
                >
                  Desayunos
                </a>
              </li>
              <li>
                <a
                  href="#extras"
                  className="text-pink-700 hover:text-pink-900 transition text-sm"
                >
                  Extras
                </a>
              </li>
              <li>
                <Link
                  href="/tracking"
                  className="text-pink-700 hover:text-pink-900 transition text-sm"
                >
                  Rastrear Pedido
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-pink-900 mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-pink-700">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Av. Principal 123, Miraflores, Lima, Perú</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-pink-700">
                <Phone className="w-5 h-5 shrink-0" />

                <a
                  href="tel:+51999999999"
                  className="hover:text-pink-900 transition"
                >
                  +51 999 999 999
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-pink-700">
                <Mail className="w-5 h-5 shrink-0" />

                <a
                  href="mailto:info@desayunosdulces.pe"
                  className="hover:text-pink-900 transition"
                >
                  info@desayunosdulces.pe
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-pink-700">
                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Horario de Atención:</p>
                  <p>Lun - Vie: 7:00 AM - 3:00 PM</p>
                  <p>Sáb: 8:00 AM - 1:00 PM</p>
                  <p>Dom: Cerrado</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-pink-900 mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition shadow-md"
              >
                <Facebook className="w-5 h-5 text-pink-600" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition shadow-md"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition shadow-md"
              >
                <Twitter className="w-5 h-5 text-pink-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-pink-400 my-8"></div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-pink-700 text-sm text-center md:text-left">
            © {currentYear} Desayunos Dulces. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm">
            <Link
              href="/terminos"
              className="text-pink-700 hover:text-pink-900 transition"
            >
              Términos y Condiciones
            </Link>
            <span className="text-pink-400">|</span>
            <Link
              href="/privacidad"
              className="text-pink-700 hover:text-pink-900 transition"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
