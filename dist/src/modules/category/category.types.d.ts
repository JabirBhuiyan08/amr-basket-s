export interface CreateCategoryDTO {
    name: string;
    description?: string;
    slug?: string;
    image?: string;
    parentId?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export interface UpdateCategoryDTO {
    name?: string;
    description?: string;
    slug?: string;
    image?: string;
    parentId?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export interface CategoryQueryDTO {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface CategoryWithChildrenDTO {
    id: string;
    name: string;
    description?: string;
    slug?: string;
    image?: string;
    parentId?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    createdAt: Date;
    updatedAt: Date;
    children?: CategoryWithChildrenDTO[];
    products?: any[];
    _count?: {
        products: number;
        children: number;
    };
}
//# sourceMappingURL=category.types.d.ts.map