import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../services/productService';
import { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.ProductId === product.ProductId);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          const maxStock = product.Quantity;
          
          set({
            items: items.map(item =>
              item.product.ProductId === product.ProductId
                ? { ...item, quantity: Math.min(newQuantity, maxStock) }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: Math.min(quantity, product.Quantity) }] });
        }
      },

      removeItem: (productId: number) => {
        set({
          items: get().items.filter(item => item.product.ProductId !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();
        const item = items.find(item => item.product.ProductId === productId);
        if (!item) return;

        const maxStock = item.product.Quantity;
        const targetQuantity = Math.max(1, Math.min(quantity, maxStock));

        set({
          items: items.map(item =>
            item.product.ProductId === productId
              ? { ...item, quantity: targetQuantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.product.Price);
          return total + (isNaN(price) ? 0 : price * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'class-shoes-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
