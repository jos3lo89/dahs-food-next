"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import SidebarCart from "./SidebarCart";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/productos?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <header className="bg-linear-to-r from-pink-200/80 via-pink-10/80 to-pink-300/80 shadow-lg sticky top-0 z-50 backdrop-blur-md ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center space-x-3 cursor-pointer shrink-0"
          >
            <div className="relative w-12 h-12 bg-pink-900/10 rounded-lg">
              <Image
                src="/images/logo/logo.webp"
                alt="Desayunos Dulces Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            <a
              href="#hero"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Inicio
            </a>

            <a
              href="#promociones"
              className="text-pink-600 hover:text-pink-800 font-medium transition relative"
            >
              Promociones
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                HOT
              </span>
            </a>

            <a
              href="#desayunos"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Desayunos
            </a>

            <a
              href="#extras"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Extras
            </a>
            <Link
              href="/tracking"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Rastrear Pedido
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <SidebarCart />

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-pink-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-2 border-t border-pink-200 pt-4">
            <a
              href="#hero"
              className="block text-pink-600 hover:text-pink-800 font-medium transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </a>

            <a
              href="#promociones"
              className="block text-pink-600 hover:text-pink-800 font-medium transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔥 Promociones
            </a>

            <a
              href="#desayunos"
              className="block text-pink-600 hover:text-pink-800 font-medium transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Desayunos
            </a>

            <a
              href="#extras"
              className="block text-pink-600 hover:text-pink-800 font-medium transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Extras
            </a>
            <Link
              href="/tracking"
              className="block text-pink-600 hover:text-pink-800 font-medium transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              📦 Rastrear Pedido
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
