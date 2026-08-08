import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '../services/productService';
import type { CartItem, CartProductSnapshot } from '../types/cart';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const createProductSnapshot = (product: Product): CartProductSnapshot => ({
  ProductId: product.ProductId,
  ProductName: product.ProductName,
  Price: product.Price,
  Quantity: product.Quantity,
  ProductImage: product.ProductImage?.map((image) => ({
    ImageId: image.ImageId,
    ImageUrl: image.ImageUrl,
  })) ?? [],
});

const normalizeQuantity = (quantity: number, maxStock: number): number => {
  const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  const boundedStock = Math.max(1, maxStock);

  if (safeQuantity < 1) {
    return 1;
  }

  return Math.min(safeQuantity, boundedStock);
};

export const selectTotalItems = (state: CartState): number => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectTotalPrice = (state: CartState): number => {
  return state.items.reduce((total, item) => {
    const price = parseFloat(item.product.Price);
    return total + (Number.isNaN(price) ? 0 : price * item.quantity);
  }, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();

        if (product.Quantity <= 0) {
          return;
        }

        const existingItem = items.find((item) => item.product.ProductId === product.ProductId);
        const normalizedQuantity = normalizeQuantity(quantity, product.Quantity);
        const snapshot = createProductSnapshot(product);

        if (existingItem) {
          const nextQuantity = Math.min(existingItem.quantity + normalizedQuantity, product.Quantity);

          set({
            items: items.map((item) =>
              item.product.ProductId === product.ProductId
                ? { ...item, quantity: nextQuantity, product: snapshot }
                : item
            ),
          });

          return;
        }

        set({
          items: [...items, { product: snapshot, quantity: normalizedQuantity }],
        });
      },

      removeItem: (productId: number) => {
        set({
          items: get().items.filter((item) => item.product.ProductId !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();
        const item = items.find((currentItem) => currentItem.product.ProductId === productId);

        if (!item) {
          return;
        }

        const maxStock = Math.max(item.product.Quantity, 1);
        const targetQuantity = normalizeQuantity(quantity, maxStock);

        set({
          items: items.map((currentItem) =>
            currentItem.product.ProductId === productId
              ? { ...currentItem, quantity: targetQuantity }
              : currentItem
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'class-shoes-cart',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const state = persistedState as Partial<CartState>;
        const items = (state.items ?? []).map((item) => ({
          quantity: item.quantity,
          product: {
            ProductId: item.product.ProductId,
            ProductName: item.product.ProductName,
            Price: item.product.Price,
            Quantity: item.product.Quantity,
            ProductImage: item.product.ProductImage ?? [],
          },
        }));

        return {
          ...currentState,
          ...state,
          items,
        };
      },
    }
  )
);
