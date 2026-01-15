"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import SidebarCart from "./SidebarCart";
import Link from "next/link";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      link: "#hero",
      name: "Inicio",
      isLink: false,
    },
    {
      link: "#promociones",
      name: "Promociones",
      isLink: false,
    },
    {
      link: "#desayunos",
      name: "Desayunos",
      isLink: false,
    },
    {
      link: "#extras",
      name: "Extras",
      isLink: false,
    },
    {
      link: "/tracking",
      name: "Rastrear Pedido",
      isLink: true,
    },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer shrink-0 group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <UtensilsCrossed className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-pink-400 font-semibold">Dahs</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks
              .filter((l) => !l.isLink)
              .map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="px-4 py-2 text-gray-700 hover:text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}

            {navLinks
              .filter((l) => l.isLink)
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium rounded-lg hover:bg-pink-50 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
          </nav>
          <div className="flex items-center gap-2">
            <SidebarCart />

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-pink-600 hover:bg-pink-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-1 border-t border-pink-100 pt-4">
            {navLinks
              .filter((l) => !l.isLink)
              .map((l, index) => (
                <a
                  key={index}
                  href={l.link}
                  className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {l.name}
                </a>
              ))}

            {navLinks
              .filter((l) => l.isLink)
              .map((l, index) => (
                <Link
                  key={index}
                  href={l.link}
                  className="block px-4 py-3 text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-medium rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {l.name}
                </Link>
              ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
