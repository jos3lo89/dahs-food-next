export interface ProductsI {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
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
