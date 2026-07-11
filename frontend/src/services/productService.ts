export interface Category {
  CategoryId: number;
  CategoryName: string;
}

export interface ProductImage {
  ImageId: number;
  ImageUrl: string;
}

export interface Product {
  ProductId: number;
  ProductName: string;
  Price: string; // Le type Decimal de Prisma/Postgres est sérialisé en String dans le JSON
  Quantity: number;
  CategoryId: number | null;
  IsActive: boolean;
  CreatedAt: string;
  Category?: Category | null;
  ProductImage?: ProductImage[];
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Récupère les produits depuis le backend avec pagination et filtres
 */
export async function getProducts(filters: ProductFilters = {}): Promise<GetProductsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`, {
      // Revalidation toutes les minutes pour Next.js App Router (mise en cache serveur)
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération : ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend indisponible, utilisation des données fictives (mock) de secours.');
    
    const mockProducts: Product[] = [
      {
        ProductId: 1,
        ProductName: "Air Sneakers Premium",
        Price: "129.99",
        Quantity: 8,
        CategoryId: 1,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        Category: { CategoryId: 1, CategoryName: "Sneakers" },
        ProductImage: [{ ImageId: 1, ImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" }]
      },
      {
        ProductId: 2,
        ProductName: "Ultra Running Pro",
        Price: "89.50",
        Quantity: 3,
        CategoryId: 2,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        Category: { CategoryId: 2, CategoryName: "Running" },
        ProductImage: [{ ImageId: 2, ImageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" }]
      },
      {
        ProductId: 3,
        ProductName: "Bottes de Randonnée Explorer",
        Price: "159.00",
        Quantity: 5,
        CategoryId: 3,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        Category: { CategoryId: 3, CategoryName: "Bottes" },
        ProductImage: [{ ImageId: 3, ImageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80" }]
      },
      {
        ProductId: 4,
        ProductName: "Sandales d'Été Confort",
        Price: "45.00",
        Quantity: 0,
        CategoryId: 4,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        Category: { CategoryId: 4, CategoryName: "Sandales" },
        ProductImage: [{ ImageId: 4, ImageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80" }]
      },
      {
        ProductId: 5,
        ProductName: "Mocassins Ville Élégance",
        Price: "110.00",
        Quantity: 12,
        CategoryId: 5,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        Category: { CategoryId: 5, CategoryName: "Ville" },
        ProductImage: [{ ImageId: 5, ImageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80" }]
      }
    ];

    let filtered = [...mockProducts];
    if (filters.categoryId) {
      filtered = filtered.filter(p => p.CategoryId === Number(filters.categoryId));
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.ProductName.toLowerCase().includes(s));
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => parseFloat(p.Price) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => parseFloat(p.Price) <= Number(filters.maxPrice));
    }

    const page = filters.page ? Number(filters.page) : 1;
    const limit = filters.limit ? Number(filters.limit) : 9;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: paginatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
