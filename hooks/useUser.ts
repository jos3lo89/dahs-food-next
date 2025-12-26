import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usuariosApi } from "@/services/user.service";
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  ChangePasswordDto,
  Usuario,
} from "@/types/users";
import { toast } from "sonner";

// Hook para obtener usuarios
export const useUsuarios = (params?: {
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["usuarios", params],
    queryFn: () => usuariosApi.getUsuarios(params),
  });
};

// Hook para obtener un usuario
export const useUsuario = (id: string) => {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: () => usuariosApi.getUsuario(id),
    enabled: !!id,
  });
};

// Hook para crear usuario
export const useCreateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usuario: CreateUsuarioDto) =>
      usuariosApi.createUsuario(usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al crear usuario");
    },
  });
};

// Hook para actualizar usuario (con optimistic update)
export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioDto }) =>
      usuariosApi.updateUsuario(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });

      // Snapshot del estado anterior
      const previousUsuarios = queryClient.getQueryData(["usuarios"]);

      // Actualizar optimistamente
      queryClient.setQueryData(["usuarios"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((usuario: Usuario) =>
            usuario.id === id ? { ...usuario, ...data } : usuario
          ),
        };
      });

      return { previousUsuarios };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario actualizado exitosamente");
    },

    onError: (error: any, variables, context) => {
      // Revertir al estado anterior
      if (context?.previousUsuarios) {
        queryClient.setQueryData(["usuarios"], context.previousUsuarios);
      }
      toast.error(error.response?.data?.error || "Error al actualizar usuario");
    },
  });
};

// Hook para cambiar contraseña
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      usuariosApi.changePassword(id, { password }),
    onSuccess: () => {
      toast.success("Contraseña actualizada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al cambiar contraseña");
    },
  });
};

// Hook para toggle active (con optimistic update)
export const useToggleUsuarioActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usuariosApi.updateUsuario(id, { isActive }),

    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });
      const previousUsuarios = queryClient.getQueryData(["usuarios"]);

      queryClient.setQueryData(["usuarios"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((usuario: Usuario) =>
            usuario.id === id ? { ...usuario, isActive } : usuario
          ),
        };
      });

      return { previousUsuarios };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(
        variables.isActive
          ? "Usuario activado exitosamente"
          : "Usuario desactivado exitosamente"
      );
    },

    onError: (error: any, _, context) => {
      if (context?.previousUsuarios) {
        queryClient.setQueryData(["usuarios"], context.previousUsuarios);
      }
      toast.error(error.response?.data?.error || "Error al cambiar estado");
    },
  });
};

// Hook para eliminar usuario
export const useDeleteUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosApi.deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario desactivado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al desactivar usuario");
    },
  });
};
