import { axiosInstance } from "@/lib/axios";
import { UploadImageResponse } from "@/types/products";

export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.post<UploadImageResponse>(
      "upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteImage: async (url: string) => {
    const { data } = await axiosInstance.delete("upload/delete", {
      data: { url },
    });
    return data;
  },
};
