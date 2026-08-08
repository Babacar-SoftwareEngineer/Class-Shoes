import { useSyncExternalStore } from 'react';
import { useCartStore, selectTotalItems, selectTotalPrice } from '../store/useCartStore';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return {
    items: isMounted ? items : [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: isMounted ? totalItems : 0,
    totalPrice: isMounted ? totalPrice : 0,
    isMounted,
  };
}
