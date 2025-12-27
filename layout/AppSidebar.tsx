"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  ChevronDown,
  LayoutDashboard,
  MoreHorizontal,
  ShoppingBag,
  FolderOpen,
  Tag,
  Package,
  User,
} from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: <User className="w-5 h-5" />,
    name: "Usuarios",
    path: "/admin/usuarios",
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    name: "Productos",
    subItems: [{ name: "Lista de Productos", path: "/admin/productos" }],
  },
  {
    icon: <FolderOpen className="w-5 h-5" />,
    name: "Categorías",
    subItems: [{ name: "Lista de Categorías", path: "/admin/categorias" }],
  },
  {
    icon: <Tag className="w-5 h-5" />,
    name: "Promociones",
    subItems: [
      { name: "Productos en Promoción", path: "/admin/promociones" },
      { name: "Packs Promocionales", path: "/admin/promociones/packs" },
      { name: "Crear Promoción", path: "/admin/promociones/crear" },
    ],
  },
  {
    icon: <Package className="w-5 h-5" />,
    name: "Pedidos",
    path: "/admin/pedidos",
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } =
    useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const closeMobileSidebar = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const isActive = useCallback(
    (path: string) => {
      if (path === "/admin") {
        return pathname === path;
      }

      return pathname.startsWith(path);
    },
    [pathname]
  );

  const isExactMatch = useCallback(
    (path: string) => {
      if (pathname === path) return true;

      if (!path.includes("/crear") && !path.includes("/editar")) {
        const segments = pathname.split("/").filter(Boolean);
        const pathSegments = path.split("/").filter(Boolean);

        if (segments.length > pathSegments.length) {
          const basePath =
            "/" + segments.slice(0, pathSegments.length).join("/");
          return (
            basePath === path &&
            !pathname.includes("/crear") &&
            !pathname.includes("/editar")
          );
        }
      }

      return false;
    },
    [pathname]
  );

  const isSubmenuActive = useCallback(
    (subItems?: { name: string; path: string }[]) => {
      if (!subItems) return false;
      return subItems.some((subItem) => pathname.startsWith(subItem.path));
    },
    [pathname]
  );

  useEffect(() => {
    navItems.forEach((nav, index) => {
      if (nav.subItems && isSubmenuActive(nav.subItems)) {
        setOpenSubmenu(index);
      }
    });
  }, [pathname, isSubmenuActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `submenu-${openSubmenu}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 dark:border-gray-700
        ${isExpanded || isMobileOpen ? "w-72" : isHovered ? "w-72" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/admin" className="flex justify-start items-start gap-3">
          <div className="aspect-square w-14 h-6 rounded-lg">
            <Avatar>
              <AvatarImage src="/images/logo/logo.webp" alt="dash-food-logo" />
            </Avatar>
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="grid flex-1 text-left text-sm leading-tight text-gray-400">
              <span className="truncate font-semibold">Dahs Jhoss</span>
              <span className="truncate text-xs">Desayunos & Jugos</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu Principal"
                ) : (
                  <MoreHorizontal className="w-5 h-5" />
                )}
              </h2>

              <ul className="flex flex-col gap-2">
                {navItems.map((nav, index) => (
                  <li key={nav.name}>
                    {nav.subItems ? (
                      <>
                        <button
                          onClick={() => handleSubmenuToggle(index)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isSubmenuActive(nav.subItems)
                              ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          } ${
                            !isExpanded && !isHovered
                              ? "lg:justify-center"
                              : "lg:justify-start"
                          }`}
                        >
                          <span
                            className={
                              isSubmenuActive(nav.subItems)
                                ? "text-pink-600 dark:text-pink-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          >
                            {nav.icon}
                          </span>

                          {(isExpanded || isHovered || isMobileOpen) && (
                            <>
                              <span className="flex-1 font-medium text-left">
                                {nav.name}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  openSubmenu === index ? "rotate-180" : ""
                                }`}
                              />
                            </>
                          )}
                        </button>

                        {(isExpanded || isHovered || isMobileOpen) && (
                          <div
                            ref={(el) => {
                              subMenuRefs.current[`submenu-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                              height:
                                openSubmenu === index
                                  ? `${subMenuHeight[`submenu-${index}`]}px`
                                  : "0px",
                            }}
                          >
                            <ul className="mt-2 space-y-1 ml-11">
                              {nav.subItems.map((subItem) => {
                                const isSubItemActive = isExactMatch(
                                  subItem.path
                                );
                                return (
                                  <li key={subItem.path}>
                                    <Link
                                      href={subItem.path}
                                      onClick={closeMobileSidebar}
                                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        isSubItemActive
                                          ? "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium"
                                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                      }`}
                                    >
                                      {subItem.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      nav.path && (
                        <Link
                          href={nav.path}
                          onClick={closeMobileSidebar}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive(nav.path)
                              ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span
                            className={
                              isActive(nav.path)
                                ? "text-pink-600 dark:text-pink-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          >
                            {nav.icon}
                          </span>

                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="font-medium">{nav.name}</span>
                          )}
                        </Link>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
