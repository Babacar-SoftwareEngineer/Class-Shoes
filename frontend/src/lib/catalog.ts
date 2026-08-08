export interface CatalogCategory {
  id: number;
  name: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: 1, name: 'Sacs à main' },
  { id: 2, name: 'Cabas' },
  { id: 3, name: 'Sacs bandoulière' },
  { id: 4, name: 'Escarpins' },
  { id: 5, name: 'Sandales' },
  { id: 6, name: 'Bottines' },
  { id: 7, name: 'Ballerines' },
  { id: 8, name: 'Sneakers femme' },
  { id: 9, name: 'Mules' },
  { id: 10, name: 'Mocassins' },
];

export const HOUSE_LINKS = [
  { label: 'Chaussures', description: 'Silhouettes sculptées', href: '/products?categoryId=4', image: '/cat-shoes.jpg' },
  { label: 'Sacs', description: 'Cuirs travaillés', href: '/products?categoryId=1', image: '/cat-bags.jpg' },
  { label: 'Parfums', description: 'Signatures discrètes', href: '/products', image: '/cat-perfumes.jpg' },
  { label: 'Accessoires', description: 'La touche finale', href: '/products', image: '/cat-accessories.jpg' },
] as const;

export function formatPrice(value: number | string): string {
  const amount = Math.round(Number(value) * 655.957);
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}
