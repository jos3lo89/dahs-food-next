import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "@/services/upload.service";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
    onSuccess: () => {
      toast.success("Imagen subida exitosamente");
      setUploadProgress(0);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al subir imagen");
      setUploadProgress(0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (url: string) => uploadApi.deleteImage(url),
    onSuccess: () => {
      toast.success("Imagen eliminada");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al eliminar imagen");
    },
  });

  return {
    upload: uploadMutation.mutate,
    deleteImage: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadProgress,
  };
};
