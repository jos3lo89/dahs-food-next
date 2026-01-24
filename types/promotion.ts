export type PromotionType = "DISCOUNT";

export interface Promocion {
  id: string;
  name: string;
  description: string | null;
  discount: number;
  code: string | null;
  startDate: string;
  endDate: string;
  active: boolean;
  type: PromotionType;
  image: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  products?: PromotionProduct[];
  _count?: {
    products: number;
  };
}

export interface PromotionProduct {
  id: string;
  promotionId: string;
  productId: string;
  discountPrice: number | null;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: {
      name: string;
    };
  };
}

export interface CreatePromocionDto {
  name: string;
  description?: string;
  discount: number;
  code?: string;
  startDate: string;
  endDate: string;
  type: PromotionType;
  image?: string;
  featured?: boolean;
  productIds?: string[];
}

export interface UpdatePromocionDto {
  name?: string;
  description?: string;
  discount?: number;
  code?: string;
  startDate?: string;
  endDate?: string;
  type?: PromotionType;
  image?: string;
  active?: boolean;
  featured?: boolean;
  productIds?: string[];
}

export interface PromocionesResponse {
  success: boolean;
  data: Promocion[];
}

export interface PromocionResponse {
  success: boolean;
  data: Promocion;
  message?: string;
}
