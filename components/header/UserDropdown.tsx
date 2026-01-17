"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Settings, User } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleDropdown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    closeDropdown();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="w-9 h-9 bg-linear-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center font-semibold text-sm">
          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
            {session?.user?.name || "Usuario"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center font-semibold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {session?.user?.name || "Usuario"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email || "email@example.com"}
              </p>
            </div>
          </div>
        </div>

        <div className="py-2">
          <Link
            href="/admin/usuarios"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Mi Perfil</span>
          </Link>

          <Link
            href="/admin/configuracion"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Configuración</span>
          </Link>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
