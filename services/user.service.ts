import { axiosInstance } from "@/lib/axios";
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  ChangePasswordDto,
  UsuariosResponse,
  UsuarioResponse,
} from "@/types/users";

export const usuariosApi = {
  // GET: Obtener todos los usuarios
  getUsuarios: async (params?: { isActive?: boolean; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", String(params.isActive));
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const { data } = await axiosInstance.get<UsuariosResponse>(
      `usuarios?${queryParams.toString()}`
    );
    return data;
  },

  // GET: Obtener un usuario por ID
  getUsuario: async (id: string) => {
    const { data } = await axiosInstance.get<UsuarioResponse>(`usuarios/${id}`);
    return data;
  },

  // POST: Crear usuario
  createUsuario: async (usuario: CreateUsuarioDto) => {
    const { data } = await axiosInstance.post<UsuarioResponse>(
      "usuarios",
      usuario
    );
    return data;
  },

  // PATCH: Actualizar usuario
  updateUsuario: async (id: string, usuario: UpdateUsuarioDto) => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(
      `usuarios/${id}`,
      usuario
    );
    return data;
  },

  // PATCH: Cambiar contraseña
  changePassword: async (id: string, password: ChangePasswordDto) => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(
      `usuarios/${id}`,
      password
    );
    return data;
  },

  // DELETE: Desactivar usuario (soft delete)
  deleteUsuario: async (id: string) => {
    const { data } = await axiosInstance.delete<UsuarioResponse>(
      `usuarios/${id}`
    );
    return data;
  },

  // PATCH: Activar usuario
  activateUsuario: async (id: string) => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(
      `usuarios/${id}`,
      { isActive: true }
    );
    return data;
  },
};
