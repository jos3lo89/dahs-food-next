import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL no proporcionada" },
        { status: 400 }
      );
    }

    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "URL de Cloudinary inválida" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      message: "Imagen eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar imagen" },
      { status: 500 }
    );
  }
}
