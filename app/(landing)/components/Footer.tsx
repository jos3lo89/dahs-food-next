import type { ReactElement, SVGProps } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

type SocialIconProps = SVGProps<SVGSVGElement>;

interface SocialLink {
  name: string;
  href: string;
  Icon: (props: SocialIconProps) => ReactElement;
}

const FacebookIcon = (props: SocialIconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M13.5 9H16V6H13.5C11.57 6 10 7.57 10 9.5V12H8V15H10V20H13V15H15.5L16 12H13V9.5C13 9.22 13.22 9 13.5 9Z"
    />
  </svg>
);

const InstagramIcon = (props: SocialIconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3Zm-4.5 5.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm5-1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-5 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
    />
  </svg>
);

const TikTokIcon = (props: SocialIconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M15.5 3c.3 2.2 1.8 4 4.5 4.2v3a7.4 7.4 0 0 1-4.5-1.6V15a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 1 0 1.9 2V3h2.1Z"
    />
  </svg>
);

const Footer = () => {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const whatsappDigits = whatsappPhone.replace(/\D/g, "");
  const whatsappTel = whatsappPhone.replace(/\s/g, "");
  const phoneLabel = whatsappPhone || whatsappDigits;

  const contactInfo = {
    address: {
      label: "Uripa - Chincheros-Apurímac",
      href: "https://maps.app.goo.gl/PSozWaohxWFjEBh66",
    },
    phone: {
      label: phoneLabel,
      href: `tel:${whatsappTel || whatsappDigits}`,
    },
    email: {
      label: "dahsjhoss@gmail.com",
      href: "mailto:dahsjhoss@gmail.com",
    },
    hours: {
      title: "Horario de Atención:",
      items: [
        "Lun - Vie: 7:00 AM - 10:00 PM",
        "Sáb: 8:00 AM - 10:00 PM",
        "Dom: 8:00 AM - 10:00 PM",
      ],
    },
  };

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/jhoselin.jhosel.2025",
      Icon: FacebookIcon,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/dahsjhoss/?utm_source=ig_web_button_share_sheet",
      Icon: InstagramIcon,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@dash..h",
      Icon: TikTokIcon,
    },
  ];

  return (
    <footer className="bg-linear-to-r from-pink-200 to-pink-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-bold text-pink-900 mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-pink-700">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <a
                  href={contactInfo.address.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-900 transition"
                >
                  {contactInfo.address.label}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-pink-700">
                <Phone className="w-5 h-5 shrink-0" />
                <a
                  href={contactInfo.phone.href}
                  className="hover:text-pink-900 transition"
                >
                  {contactInfo.phone.label}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-pink-700">
                <Mail className="w-5 h-5 shrink-0" />
                <a
                  href={contactInfo.email.href}
                  className="hover:text-pink-900 transition"
                >
                  {contactInfo.email.label}
                </a>
              </li>
              {/* <li className="flex items-start gap-2 text-sm text-pink-700">
                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{contactInfo.hours.title}</p>
                  {contactInfo.hours.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-pink-900 mb-4">
              Horario de Atención
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-pink-700">
                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  {contactInfo.hours.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-pink-900 mb-4">Síguenos</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition shadow-md"
                >
                  <link.Icon className="w-5 h-5 text-pink-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-pink-400 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
