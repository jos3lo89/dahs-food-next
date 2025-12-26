export interface Usuario {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioDto {
  email: string;
  password: string;
  name: string;
  role?: "ADMIN";
  avatar?: string;
}

export interface UpdateUsuarioDto {
  email?: string;
  name?: string;
  role?: "ADMIN";
  isActive?: boolean;
  avatar?: string;
}

export interface ChangePasswordDto {
  password: string;
}

export interface UsuariosResponse {
  success: boolean;
  data: Usuario[];
}

export interface UsuarioResponse {
  success: boolean;
  data: Usuario;
  message?: string;
}
