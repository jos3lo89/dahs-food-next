import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { hashPassword } from "@/lib/bcrypt";
import { z } from "zod";

const updateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(3).optional(),
  role: z.enum(["ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/usuarios/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const usuario = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

// PATCH /api/usuarios/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Si se actualiza el email, verificar que no esté en uso
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id: params.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "El email ya está en uso" },
          { status: 400 }
        );
      }
    }

    // Si se actualiza la contraseña, hacer hash
    const dataToUpdate: any = { ...validatedData };
    if (validatedData.password) {
      dataToUpdate.password = await hashPassword(validatedData.password);
    }

    const usuario = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: usuario,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE /api/usuarios/[id] - SOFT DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // Evitar que el admin se desactive a sí mismo
    if (params.id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "No puedes desactivar tu propia cuenta" },
        { status: 400 }
      );
    }

    // Soft delete (desactivar)
    const usuario = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario desactivado exitosamente",
      data: usuario,
    });
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    return NextResponse.json(
      { success: false, error: "Error al desactivar usuario" },
      { status: 500 }
    );
  }
}
