import HeroSection from '../components/home/HeroSection';
import CategoryBar from '../components/home/CategoryBar';
import ProductGrid, { ProductCardData } from '../components/home/ProductGrid';
import CatalogUnavailable from '../components/home/CatalogUnavailable';
import EditorialSection from '../components/home/EditorialSection';
import { getProducts, Product } from '../services/productService';
import { normalizeImageSrc } from '../lib/image';

function mapBackendProduct(product: Product, index: number): ProductCardData {
  const image = normalizeImageSrc(product.ProductImage?.[0]?.ImageUrl);

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

export default async function Home() {
  let backendCards: ProductCardData[] = [];

  try {
    const response = await getProducts({ limit: 16, sortBy: 'CreatedAt', sortOrder: 'desc' });
    backendCards = response.data.map(mapBackendProduct);
  } catch {
    backendCards = [];
  }

  const homeCards = backendCards.slice(0, 12);

  const firstSelection = homeCards.slice(0, 8);
  const secondSelection = homeCards.length >= 12 ? homeCards.slice(4, 12) : homeCards.slice(8, 12);

  return (
    <div className="bg-(--shell-bg)">
      <HeroSection />
      <CategoryBar />
      {homeCards.length === 0 ? <CatalogUnavailable /> : <ProductGrid title="Sélection sacs" products={firstSelection} />}
      <EditorialSection />
      {secondSelection.length > 0 ? <ProductGrid title="Chaussures femme" products={secondSelection} /> : null}
    </div>
  );
}
