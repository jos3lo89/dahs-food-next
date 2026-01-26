import type { ReactElement, SVGProps } from "react";
import { Clock, Mail, MapPin, Phone, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

type SocialIconProps = SVGProps<SVGSVGElement>;

interface SocialLink {
  name: string;
  href: string;
  Icon: (props: SocialIconProps) => ReactElement;
  color: string
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
    hours: [
      "Lun - Vie: 7:00 AM - 10:00 PM",
      "Sáb: 8:00 AM - 10:00 PM", 
      "Dom: 8:00 AM - 10:00 PM",
    ],
  };

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/jhoselin.jhosel.2025",
      Icon: FacebookIcon,
      color: "text-blue-400"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/dahsjhoss/?utm_source=ig_web_button_share_sheet",
      Icon: InstagramIcon,
      color: "text-pink-400"
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@dash..h",
      Icon: TikTokIcon,
      color: "text-black-900"
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative container mx-auto px-6 py-16">
        {/* Header section with branding */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-rose-500" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Dahs Food
            </h3>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deliciosos platos preparados con amor para tu familia. 
            Calidad, sabor y tradición en cada bocado.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Ubicación</h4>
            </div>
            <div className="space-y-4 pl-15">
              <a
                href={contactInfo.address.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-rose-600 transition-colors duration-200"
              >
                {contactInfo.address.label}
              </a>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-rose-500" />
                <a
                  href={contactInfo.phone.href}
                  className="hover:text-rose-600 transition-colors duration-200"
                >
                  {contactInfo.phone.label}
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-rose-500" />
                <a
                  href={contactInfo.email.href}
                  className="hover:text-rose-600 transition-colors duration-200"
                >
                  {contactInfo.email.label}
                </a>
              </div>
            </div>
          </div>

          {/* Hours Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Horario</h4>
            </div>
            <div className="pl-15 space-y-3">
              {contactInfo.hours.map((hour) => (
                <p key={hour} className="text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  {hour}
                </p>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Síguenos</h4>
            </div>
            <div className="flex gap-4 pl-15">
              {socialLinks.map((link) =>(
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="group relative"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-gray-100">
                    <link.Icon className={`w-8 h-8  bg-clip-text ${link.color}`} />
                  </div>
                </a>
              ) )}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © 2026 Dahs Food. Hecho con <Heart className="w-4 h-4 inline text-rose-500" /> para ti
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/terminos"
                className="text-gray-600 hover:text-rose-600 transition-colors duration-200 font-medium"
              >
                Términos
              </Link>
              <Link
                href="/privacidad"
                className="text-gray-600 hover:text-rose-600 transition-colors duration-200 font-medium"
              >
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
