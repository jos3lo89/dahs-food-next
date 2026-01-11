export interface ProductsI {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string;
  images: string[];
  categoryId: string;
  active: boolean;
  featured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Producto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string;
  images: string[];
  categoryId: string;
  category: Category;
  active: boolean;
  featured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductoDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  image: string;
  images?: string[];
  categoryId: string;
  featured?: boolean;
  stock?: number;
}

export interface UpdateProductoDto {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  images?: string[];
  categoryId?: string;
  active?: boolean;
  featured?: boolean;
  stock?: number;
}

export interface ProductosResponse {
  success: boolean;
  data: Producto[];
}

export interface ProductoResponse {
  success: boolean;
  data: Producto;
  message?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
}

export interface UploadImageResponse {
  success: boolean;
  data?: {
    url: string;
    publicId: string;
    width: number;
    height: number;
  };
  error?: string;
}
