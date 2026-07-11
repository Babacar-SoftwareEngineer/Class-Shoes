'use client';

import { useCart } from '../../hooks/useCart';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, isMounted } = useCart();

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-500">
        Chargement du panier...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 max-w-2xl mx-auto my-12 text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm space-y-6 flex flex-col items-center justify-center">
        <div className="text-6xl">🛍️</div>
        <h2 className="text-2xl font-bold">Votre panier est vide</h2>
        <p className="text-zinc-500 max-w-sm">Découvrez nos collections pour commencer vos achats.</p>
        <Link
          href="/products"
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition"
        >
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const defaultImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';
              const imageUrl = item.product.ProductImage && item.product.ProductImage.length > 0 
                ? item.product.ProductImage[0].ImageUrl 
                : defaultImg;

              return (
                <div
                  key={item.product.ProductId}
                  className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xs gap-4"
                >
                  {/* Image & Infos */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl relative overflow-hidden flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.product.ProductName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1">{item.product.ProductName}</h3>
                      <p className="text-xs text-zinc-400 font-semibold">{parseFloat(item.product.Price).toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* Actions Quantité */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.ProductId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.ProductId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold transition-colors cursor-pointer"
                      disabled={item.quantity >= item.product.Quantity}
                    >
                      +
                    </button>
                  </div>

                  {/* Prix total de la ligne & Action de suppression */}
                  <div className="flex items-center gap-4">
                    <div className="text-right font-extrabold text-sm sm:text-base w-20">
                      {(parseFloat(item.product.Price) * item.quantity).toFixed(2)} €
                    </div>
                    <button
                      onClick={() => removeItem(item.product.ProductId)}
                      className="text-red-500 hover:text-red-600 transition-colors text-sm font-semibold cursor-pointer"
                      title="Supprimer l'article"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Résumé de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm space-y-6">
              <h2 className="text-lg font-bold">Résumé</h2>

              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Articles</span>
                <span className="font-semibold">{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-black text-violet-600 dark:text-violet-400">
                  {getTotalPrice().toFixed(2)} €
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition shadow-xs cursor-pointer"
                  onClick={() => alert("Fonctionnalité de paiement non implémentée !")}
                >
                  Commander
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
