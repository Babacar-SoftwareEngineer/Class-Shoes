import { Product } from '../services/productService';

export interface CartItem {
  product: Product;
  quantity: number;
}
