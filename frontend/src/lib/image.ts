const ALLOWED_REMOTE_IMAGE_HOSTS = new Set(['res.cloudinary.com']);
const FALLBACK_IMAGE = '/p1.jpg';

export function normalizeImageSrc(src?: string | null): string {
  if (!src) {
    return FALLBACK_IMAGE;
  }

  if (src.startsWith('/')) {
    return src;
  }

  try {
    const url = new URL(src);
    return ALLOWED_REMOTE_IMAGE_HOSTS.has(url.hostname) ? src : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export function getFallbackImage(): string {
  return FALLBACK_IMAGE;
}
