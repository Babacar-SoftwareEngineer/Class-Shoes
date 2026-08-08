import type { ProductImage } from '../services/productService';

export interface CartProductSnapshot {
  ProductId: number;
  ProductName: string;
  Price: string;
  Quantity: number;
  ProductImage?: ProductImage[] | null;
}

export interface CartItem {
  product: CartProductSnapshot;
  quantity: number;
}
