import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import cloudinary from './config/cloudinary.js';

type WooCommerceRow = {
  Images?: string;
};

type ImageMapping = Record<string, string>;

const getArgument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const csvPath = getArgument('--csv');
const imagesDirectory = getArgument('--images');
const mappingPath = resolve(getArgument('--mapping') ?? 'data/cloudinary-image-map.json');
const cloudinaryFolder = getArgument('--folder') ?? 'class-shoes/products';
const dryRun = process.argv.includes('--dry-run');

if (!csvPath || !imagesDirectory) {
  console.error(
    'Usage: npm run upload:images -- --csv <export.csv> --images <images-folder> [--mapping <mapping.json>]',
  );
  process.exit(1);
}

const normalizeFileName = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

const getSourceFileName = (value: string): string | undefined => {
  try {
    return basename(new URL(value.trim()).pathname);
  } catch {
    return undefined;
  }
};

const uploadImage = async (filePath: string, sourceFileName: string): Promise<string> => {
  const publicId = normalizeFileName(sourceFileName).replace(new RegExp(`${normalizeFileName(extname(sourceFileName))}$`), '');
  const result = await cloudinary.uploader.upload(filePath, {
    folder: cloudinaryFolder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: false,
    unique_filename: false,
  });

  return result.secure_url;
};

async function main(): Promise<void> {
  const csvFile = resolve(csvPath!);
  const localDirectory = resolve(imagesDirectory!);

  if (!existsSync(csvFile)) throw new Error(`CSV introuvable : ${csvFile}`);
  if (!existsSync(localDirectory)) throw new Error(`Dossier d'images introuvable : ${localDirectory}`);

  const rows = parse(readFileSync(csvFile, 'utf8'), {
    bom: true,
    columns: true,
    relax_quotes: true,
    skip_empty_lines: true,
  }) as WooCommerceRow[];

  const localFiles = new Map<string, string>();
  for (const fileName of readdirSync(localDirectory, { withFileTypes: true })) {
    if (fileName.isFile()) {
      localFiles.set(normalizeFileName(fileName.name), join(localDirectory, fileName.name));
    }
  }

  const mapping: ImageMapping = existsSync(mappingPath)
    ? JSON.parse(readFileSync(mappingPath, 'utf8')) as ImageMapping
    : {};
  const sourceNames = new Set<string>();

  for (const row of rows) {
    for (const source of (row.Images ?? '').split(',').map((value) => value.trim()).filter(Boolean)) {
      const sourceFileName = getSourceFileName(source);
      if (sourceFileName) sourceNames.add(sourceFileName);
    }
  }

  const missing: string[] = [];
  let uploaded = 0;
  let reused = 0;

  for (const sourceFileName of sourceNames) {
    if (mapping[sourceFileName]) {
      reused += 1;
      continue;
    }

    const localFile = localFiles.get(normalizeFileName(sourceFileName));
    if (!localFile) {
      missing.push(sourceFileName);
      continue;
    }

    if (!dryRun) {
      mapping[sourceFileName] = await uploadImage(localFile, sourceFileName);
    }
    uploaded += 1;
    console.log(`${dryRun ? 'Prête' : 'Téléversée'} : ${sourceFileName}`);
  }

  if (!dryRun) {
    mkdirSync(resolve(mappingPath, '..'), { recursive: true });
    writeFileSync(mappingPath, `${JSON.stringify(mapping, null, 2)}\n`, 'utf8');
  }
  console.log(`\nTerminé : ${uploaded} téléversées, ${reused} déjà disponibles.`);
  if (!dryRun) console.log(`Mapping Cloudinary : ${mappingPath}`);

  if (missing.length > 0) {
    console.warn(`Images manquantes (${missing.length}) :`);
    for (const fileName of missing) console.warn(`- ${fileName}`);
    process.exitCode = 2;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});