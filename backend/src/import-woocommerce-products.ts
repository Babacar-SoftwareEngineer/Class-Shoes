import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import prisma from './config/db.js';

type WooCommerceRow = Record<string, string>;
type ImageMapping = Record<string, string>;

const getArgument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const csvPath = getArgument('--csv');
const mappingPath = getArgument('--mapping') ?? 'data/cloudinary-image-map.json';

if (!csvPath) {
  console.error('Usage: npm run import:products -- --csv <export.csv> [--mapping <mapping.json>]');
  process.exit(1);
}

const normalizeHeader = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

const getField = (row: WooCommerceRow, label: string): string => {
  const expected = normalizeHeader(label);
  const entry = Object.entries(row).find(([key]) => normalizeHeader(key) === expected);
  return entry?.[1]?.trim() ?? '';
};

const parsePrice = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const parseStock = (row: WooCommerceRow): number => {
  const value = Number.parseInt(getField(row, 'Stock'), 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

const getImages = (row: WooCommerceRow, mapping: ImageMapping): string[] => [...new Set(
  getField(row, 'Images').split(',').map((source) => {
    try {
      return mapping[basename(new URL(source.trim()).pathname)];
    } catch {
      return undefined;
    }
  }).filter((url): url is string => Boolean(url)),
)];

const getAttribute = (row: WooCommerceRow, number: 1 | 2): { name: string; value: string } => ({
  name: getField(row, `Nom de l'attribut ${number}`),
  value: getField(row, `Valeur(s) de l'attribut ${number}`),
});

const getParentId = (row: WooCommerceRow): number | null => {
  const match = getField(row, 'Parent').match(/id:(\d+)/i);
  return match ? Number(match[1]) : null;
};

const getCategoryName = (row: WooCommerceRow): string => {
  const categories = getField(row, 'Catégories').split('>').map((value) => value.trim()).filter(Boolean);
  return categories.at(-1) || 'Non classé';
};

const getVariationPrice = (row: WooCommerceRow): number | null =>
  parsePrice(getField(row, 'Tarif promo')) ?? parsePrice(getField(row, 'Tarif régulier'));

async function findOrCreateCategory(categoryName: string): Promise<number> {
  const existing = await prisma.category.findFirst({ where: { CategoryName: categoryName } });
  if (existing) return existing.CategoryId;
  const created = await prisma.category.create({ data: { CategoryName: categoryName } });
  return created.CategoryId;
}

async function findOrCreateColor(colorName: string): Promise<number | null> {
  if (!colorName) return null;
  const existing = await prisma.color.findFirst({ where: { ColorName: colorName } });
  if (existing) return existing.ColorId;
  const created = await prisma.color.create({ data: { ColorName: colorName } });
  return created.ColorId;
}

async function findOrCreateSize(sizeName: string): Promise<number | null> {
  if (!sizeName) return null;
  const existing = await prisma.size.findFirst({ where: { SizeName: sizeName } });
  if (existing) return existing.SizeId;
  const created = await prisma.size.create({ data: { SizeName: sizeName } });
  return created.SizeId;
}

async function main(): Promise<void> {
  const csvFile = resolve(csvPath!);
  const mappingFile = resolve(mappingPath);
  if (!existsSync(csvFile)) throw new Error(`CSV introuvable : ${csvFile}`);
  if (!existsSync(mappingFile)) throw new Error(`Mapping Cloudinary introuvable : ${mappingFile}`);

  const rows = parse(readFileSync(csvFile, 'utf8'), { bom: true, columns: true, relax_quotes: true, skip_empty_lines: true }) as WooCommerceRow[];
  const mapping = JSON.parse(readFileSync(mappingFile, 'utf8')) as ImageMapping;
  const publishedRows = rows.filter((row) => getField(row, 'Publié') === '1' && getField(row, 'Visibilité dans le catalogue') === 'visible');
  const parentRows = publishedRows.filter((row) => ['simple', 'variable'].includes(getField(row, 'Type')));
  const variationsByParent = new Map<number, WooCommerceRow[]>();

  for (const row of publishedRows.filter((item) => getField(item, 'Type') === 'variation')) {
    const parentId = getParentId(row);
    if (parentId) variationsByParent.set(parentId, [...(variationsByParent.get(parentId) ?? []), row]);
  }

  await prisma.product.updateMany({ where: { WooCommerceId: null }, data: { IsActive: false } });

  let imported = 0;
  let importedVariations = 0;
  for (const row of parentRows) {
    const wooCommerceId = Number(getField(row, 'ID'));
    if (!Number.isInteger(wooCommerceId)) continue;
    const variations = variationsByParent.get(wooCommerceId) ?? [];
    const variationPrices = variations.map(getVariationPrice).filter((price): price is number => price !== null);
    const price = getVariationPrice(row) ?? (variationPrices.length ? Math.min(...variationPrices) : 0);
    const quantity = getField(row, 'Stock') ? parseStock(row) : variations.reduce((sum, item) => sum + parseStock(item), 0);
    const categoryId = await findOrCreateCategory(getCategoryName(row));
    const product = await prisma.product.upsert({
      where: { WooCommerceId: wooCommerceId },
      update: { ProductName: getField(row, 'Nom'), Price: price, Quantity: quantity, CategoryId: categoryId, IsActive: true },
      create: { WooCommerceId: wooCommerceId, ProductName: getField(row, 'Nom'), Price: price, Quantity: quantity, CategoryId: categoryId, IsActive: true },
    });

    await prisma.productImage.deleteMany({ where: { ProductId: product.ProductId } });
    const images = getImages(row, mapping);
    if (images.length) await prisma.productImage.createMany({ data: images.map((ImageUrl) => ({ ProductId: product.ProductId, ImageUrl })) });
    await prisma.productVariant.deleteMany({ where: { ProductId: product.ProductId } });

    for (const variation of variations) {
      const attributes = [getAttribute(variation, 1), getAttribute(variation, 2)];
      const colorValue = attributes.find((attribute) => attribute.name.toLowerCase().includes('couleur'))?.value ?? '';
      const sizeValue = attributes.find((attribute) => attribute.name.toLowerCase().includes('taille'))?.value ?? '';
      await prisma.productVariant.create({
        data: {
          ProductId: product.ProductId,
          ColorId: await findOrCreateColor(colorValue),
          SizeId: await findOrCreateSize(sizeValue),
          Quantity: parseStock(variation),
          Price: getVariationPrice(variation) ?? price,
        },
      });
      importedVariations += 1;
    }
    imported += 1;
  }

  console.log(`Import terminé : ${imported} produits et ${importedVariations} variantes.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});