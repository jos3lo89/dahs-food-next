import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const uploadOptions = {
  folder: "dahs-fotos",
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
  transformation: [
    { width: 800, height: 800, crop: "limit" },
    { quality: "auto" },
    { fetch_format: "auto" },
  ],
};

export function getPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/dahs-fotos\/([^/]+)\./);
    return match ? `dahs-fotos/${match[1]}` : null;
  } catch {
    return null;
  }
}
