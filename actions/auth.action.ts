"use server";

import { signIn } from "@/auth";
import { LoginType } from "@/schemas/auth.schema";
import { AuthError } from "next-auth";

export const login = async (data: LoginType) => {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return { success: true, message: "Inicio de sesión exitoso" };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.cause?.err?.message || "Error de autenticación",
      };
    }
    return { success: false, message: "Error al iniciar sesión" };
  }
};
