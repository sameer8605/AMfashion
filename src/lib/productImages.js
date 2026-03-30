/** Normalize gallery: legacy `image` only, or `images` array (max 4 on write). */
export function getProductImages(product) {
  if (!product) return [];
  const fromArray = Array.isArray(product.images)
    ? product.images.filter((u) => typeof u === "string" && u.trim())
    : [];
  if (fromArray.length) return fromArray.slice(0, 4);
  if (product.image && typeof product.image === "string" && product.image.trim()) {
    return [product.image.trim()];
  }
  return [];
}

export function getPrimaryImage(product) {
  const urls = getProductImages(product);
  return urls[0] ?? "";
}
