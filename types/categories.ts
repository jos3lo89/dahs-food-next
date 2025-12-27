export interface Categoria {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoriaDto {
  name: string;
  slug: string;
}

export interface UpdateCategoriaDto {
  name?: string;
  slug?: string;
  order?: number;
  active?: boolean;
}

export interface CategoriasResponse {
  success: boolean;
  data: Categoria[];
}

export interface CategoriaResponse {
  success: boolean;
  data: Categoria;
  message?: string;
}

export interface ReorderCategoriesDto {
  categories: { id: string; order: number }[];
}
