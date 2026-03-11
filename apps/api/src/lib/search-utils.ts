/**
 * Busca inteligente: normalização, sinônimos e termos relacionados
 * Ajuda a encontrar produtos mesmo com erros de digitação comuns
 */

const ACCENT_MAP: Record<string, string> = {
  á: "a",
  à: "a",
  â: "a",
  ã: "a",
  é: "e",
  ê: "e",
  í: "i",
  ó: "o",
  ô: "o",
  õ: "o",
  ú: "u",
  ç: "c",
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .split("")
    .map((c) => ACCENT_MAP[c] ?? c)
    .join("");
}

/** Sinônimos e termos relacionados (termo buscado -> termos adicionais para incluir na busca) */
const SYNONYMS: Record<string, string[]> = {
  pneu: ["pneus", "peneu", "peneus"],
  pneus: ["pneu"],
  bicicleta: ["bike", "bicicletas", "bicleta"],
  bicicletas: ["bicicleta", "bikes"],
  bike: ["bicicleta", "bikes"],
  bikes: ["bicicleta", "bike"],
  oleo: ["óleo", "oleos", "óleos", "lubrificante"],
  óleo: ["oleo", "oleos", "lubrificante"],
  motul: ["óleo", "oleo"],
  ceat: ["pneu", "pneus"],
  câmbio: ["cambio", "catraca", "coroa"],
  cambio: ["câmbio", "catraca", "coroa"],
  freio: ["freios", "pastilha", "disco"],
  freios: ["freio"],
  guidão: ["guidao", "manopla"],
  guidao: ["guidão", "manopla"],
  selim: ["banco", "sella"],
  banco: ["selim"],
  quadrado: ["quadro", "frame"],
  quadro: ["quadrado", "frame"],
  aro: ["roda", "rodas"],
  roda: ["aro", "rodas"],
  corrente: ["correntes", "transmissão"],
  bomba: ["bombas", "inflador"],
};

/**
 * Expande o termo de busca com sinônimos e normaliza
 * Retorna array de termos para usar em OR na query
 */
export function expandSearchTerms(search: string): string[] {
  const trimmed = search.trim();
  if (!trimmed) return [];

  const normalized = normalize(trimmed);
  const terms = new Set<string>([trimmed, normalized]);

  // Adicionar sinônimos do termo exato
  const key = Object.keys(SYNONYMS).find(
    (k) => normalize(k) === normalized || k === trimmed
  );
  if (key) {
    SYNONYMS[key].forEach((t) => terms.add(t));
  }

  // Adicionar sinônimos do termo normalizado
  const keyNorm = Object.keys(SYNONYMS).find((k) => normalize(k) === normalized);
  if (keyNorm && keyNorm !== key) {
    SYNONYMS[keyNorm].forEach((t) => terms.add(t));
  }

  return Array.from(terms);
}
