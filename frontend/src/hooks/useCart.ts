import { useSyncExternalStore } from 'react';
import { useCartStore } from '../store/useCartStore';

export function useCart() {
  const store = useCartStore();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return {
    ...store,
    items: isMounted ? store.items : [],
    getTotalItems: isMounted ? store.getTotalItems : () => 0,
    getTotalPrice: isMounted ? store.getTotalPrice : () => 0,
    isMounted,
  };
}
