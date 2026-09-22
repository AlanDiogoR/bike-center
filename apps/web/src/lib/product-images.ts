/** Escolhe a foto de card: recorte/hero > capa-feed > primeira. */
export function pickListingImage(images: string[] | undefined | null): string {
  const list = (images ?? []).filter((src) => typeof src === "string" && src.length > 0);
  return (
    list.find((src) => /recorte/i.test(src)) ??
    list.find((src) => /capa-feed/i.test(src)) ??
    list[0] ??
    ""
  );
}

/**
 * Ordem da galeria PDP: recorte primeiro, demais fotos na ordem do seed,
 * capa-feed por último (card social, não studio).
 */
export function galleryImages(images: string[] | undefined | null): string[] {
  const list = (images ?? []).filter(
    (src) => typeof src === "string" && src.length > 0 && (src.startsWith("http") || src.startsWith("/"))
  );
  const recortes: string[] = [];
  const capas: string[] = [];
  const rest: string[] = [];
  for (const src of list) {
    if (/recorte/i.test(src)) recortes.push(src);
    else if (/capa-feed/i.test(src)) capas.push(src);
    else rest.push(src);
  }
  return [...recortes, ...rest, ...capas];
}
