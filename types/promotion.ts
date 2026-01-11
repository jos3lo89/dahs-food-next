export type PromotionType = "DISCOUNT" | "PACK" | "DAY_SPECIAL" | "WEEK_DEAL";

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
  packs?: PromotionPack[];
  _count?: {
    products: number;
    packs: number;
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

export interface PromotionPack {
  id: string;
  promotionId: string;
  name: string;
  description: string | null;
  items: PackItem[];
  originalPrice: number;
  packPrice: number;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackItem {
  productId: string;
  quantity: number;
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
  packs?: CreatePackDto[];
}

export interface CreatePackDto {
  name: string;
  description?: string;
  items: PackItem[];
  originalPrice: number;
  packPrice: number;
  image?: string;
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
  packs?: CreatePackDto[];
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
