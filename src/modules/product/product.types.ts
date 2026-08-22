export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  categoryId?: string;
  sku?: string; // Add this - custom product ID/SKU
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    slug?: string;
  };
  images?: Array<{
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
  }>;
}


export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  categoryId?: string;
  sku?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    slug?: string;
  };
  images?: Array<{
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
  }>;
}

export interface ProductQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minRating?: number;
}

export interface ProductImageDTO {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductSEOUpdateDTO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
}