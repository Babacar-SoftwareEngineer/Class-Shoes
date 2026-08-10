import HeroSection from '../components/home/HeroSection';
import CategoryBar from '../components/home/CategoryBar';
import ProductGrid, { ProductCardData } from '../components/home/ProductGrid';
import EditorialSection from '../components/home/EditorialSection';
import { getProducts, Product } from '../services/productService';

const FALLBACK_HOME_CARDS: ProductCardData[] = [
  {
    id: 1001,
    name: 'Mini sac à chaîne noir',
    price: 84618,
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1200&q=80',
    category: 'Sacs à main',
    rating: 4.8,
    reviews: 128,
    badge: 'best seller',
  },
  {
    id: 1002,
    name: 'Cabas cuir grainé ivoire',
    price: 123976,
    image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=80',
    category: 'Cabas',
    rating: 4.7,
    reviews: 91,
    badge: 'new',
  },
  {
    id: 1003,
    name: 'Sac bandoulière rouge',
    price: 104297,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    category: 'Sacs bandoulière',
    rating: 4.6,
    reviews: 73,
    badge: 'trending',
  },
  {
    id: 1004,
    name: 'Escarpins slingback noirs',
    price: 97738,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    category: 'Escarpins',
    rating: 4.9,
    reviews: 44,
    badge: 'new',
  },
  {
    id: 1005,
    name: 'Sandales à talon nude',
    price: 91178,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
    category: 'Sandales',
    rating: 4.8,
    reviews: 61,
    badge: 'best seller',
  },
  {
    id: 1006,
    name: 'Bottines cuir chocolat',
    price: 137751,
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80',
    category: 'Bottines',
    rating: 4.5,
    reviews: 38,
    badge: 'trending',
  },
  {
    id: 1007,
    name: 'Sneakers femme blanches',
    price: 88554,
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80',
    category: 'Sneakers femme',
    rating: 4.9,
    reviews: 102,
    badge: 'limited',
  },
  {
    id: 1008,
    name: 'Ballerines ivoire',
    price: 78059,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
    category: 'Ballerines',
    rating: 4.8,
    reviews: 87,
    badge: 'new',
  },
];

function mapBackendProduct(product: Product, index: number): ProductCardData {
  const image = product.ProductImage?.[0]?.ImageUrl
    ?? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80';

  const badgeCycle = ['best seller', 'new', 'trending', 'limited'] as const;

  return {
    id: product.ProductId,
    name: product.ProductName,
    price: Number(product.Price),
    image,
    category: product.Category?.CategoryName ?? 'Collection',
    rating: 4.5 + ((index % 4) * 0.1),
    reviews: 40 + index * 7,
    badge: badgeCycle[index % badgeCycle.length],
  };
}

function normalizeHomeCards(cards: ProductCardData[]): ProductCardData[] {
  const normalized = [...cards];

  if (normalized.length >= 12) {
    return normalized.slice(0, 12);
  }

  let fallbackIndex = 0;
  while (normalized.length < 12) {
    const fallback = FALLBACK_HOME_CARDS[fallbackIndex % FALLBACK_HOME_CARDS.length];
    normalized.push({
      ...fallback,
      id: fallback.id + normalized.length,
    });
    fallbackIndex += 1;
  }

  return normalized.slice(0, 12);
}

export default async function Home() {
  const response = await getProducts({ limit: 16, sortBy: 'CreatedAt', sortOrder: 'desc' });
  const backendCards = response.data.map(mapBackendProduct);
  const homeCards = normalizeHomeCards(backendCards.length > 0 ? backendCards : FALLBACK_HOME_CARDS);

  const firstSelection = homeCards.slice(0, 8);
  const secondSelection = homeCards.slice(4, 12);

  return (
    <div className="bg-(--shell-bg)">
      <HeroSection />
      <CategoryBar />
      <ProductGrid title="Sélection sacs" products={firstSelection} />
      <EditorialSection />
      <ProductGrid title="Chaussures femme" products={secondSelection} />
    </div>
  );
}
