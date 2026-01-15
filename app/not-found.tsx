"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-gray-600 mb-6">
          La página que busca no existe o fue movida.
        </p>
        <Button onClick={() => router.back()} className="w-full">
          Volver atrás
        </Button>
      </div>
    </div>
  );
}
