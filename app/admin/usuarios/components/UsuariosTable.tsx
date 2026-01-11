"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Key, Shield, ShieldOff, User } from "lucide-react";
import { useToggleUsuarioActive } from "@/hooks/useUser";
import { Usuario } from "@/types/users";
import { EditUserDialog } from "./EditUserDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UsuariosTableProps {
  usuarios: Usuario[];
}

export function UsuariosTable({ usuarios }: UsuariosTableProps) {
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [changingPasswordUsuario, setChangingPasswordUsuario] =
    useState<Usuario | null>(null);

  const { mutate: toggleActive } = useToggleUsuarioActive();

  const handleToggleActive = (usuario: Usuario) => {
    toggleActive({
      id: usuario.id,
      isActive: !usuario.isActive,
    });
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") {
      return (
        <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
        <User className="w-3 h-3 mr-1" />
        Manager
      </Badge>
    );
  };

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No hay usuarios registrados
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {usuario.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {usuario.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {usuario.email}
                  </p>
                </TableCell>

                <TableCell>{getRoleBadge(usuario.role)}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={usuario.isActive}
                      onCheckedChange={() => handleToggleActive(usuario)}
                    />
                    <span
                      className={`text-sm ${
                        usuario.isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {usuario.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(usuario.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingUsuario(usuario)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setChangingPasswordUsuario(usuario)}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Cambiar Contraseña
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(usuario)}
                        className={
                          usuario.isActive ? "text-red-600" : "text-green-600"
                        }
                      >
                        {usuario.isActive ? (
                          <>
                            <ShieldOff className="w-4 h-4 mr-2" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        usuario={editingUsuario}
        open={!!editingUsuario}
        onOpenChange={(open) => !open && setEditingUsuario(null)}
      />

      <ChangePasswordDialog
        usuario={changingPasswordUsuario}
        open={!!changingPasswordUsuario}
        onOpenChange={(open) => !open && setChangingPasswordUsuario(null)}
      />
    </>
  );
}
