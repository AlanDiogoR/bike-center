import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import colors from "tailwindcss/colors";
import { contrastRatio } from "@/lib/contrast";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = path.join(webRoot, "src");

const ORANGE_TOKEN = "#c2410c";
const WHITE = "#ffffff";
const FAILING_ORANGE = "#ec6e37";

function read(rel: string): string {
  return fs.readFileSync(path.join(srcRoot, rel), "utf8");
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full;
  });
}

function cssVars(css: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const pattern = /--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css)) !== null) {
    vars[match[1]] = match[2].toLowerCase();
  }
  return vars;
}

function brandColors(tailwindSource: string): Record<string, string> {
  const block = tailwindSource.match(/brand:\s*\{([\s\S]*?)\n\s{6}\},/);
  expect(block, "bloco brand do Tailwind").toBeTruthy();
  const colors: Record<string, string> = {};
  const pattern = /(\w+):\s*"(#[0-9a-fA-F]{6})"/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(block![1])) !== null) {
    colors[match[1]] = match[2].toLowerCase();
  }
  return colors;
}

type Decls = Record<string, string>;

function parseRules(css: string): { selector: string; decls: Decls }[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: { selector: string; decls: Decls }[] = [];
  const pattern = /([^{}@][^{]*)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(stripped)) !== null) {
    const decls: Decls = {};
    for (const part of match[2].split(";")) {
      const colon = part.indexOf(":");
      if (colon === -1) continue;
      const key = part.slice(0, colon).trim().toLowerCase();
      const value = part.slice(colon + 1).trim().toLowerCase();
      if (key && value) decls[key] = value;
    }
    for (const selector of match[1].split(",")) {
      rules.push({ selector: selector.trim().replace(/\s+/g, " "), decls });
    }
  }
  return rules;
}

function resolveColor(value: string | undefined, vars: Record<string, string>): string | null {
  if (!value) return null;
  const raw = value.trim().toLowerCase();
  const variable = raw.match(/^var\(--([a-z0-9-]+)\)$/);
  if (variable) return vars[variable[1]] ?? null;
  if (raw === "white") return WHITE;
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
  }
  return null;
}

type OrangeState = "normal" | "hover" | "focus" | "disabled";

function stateOf(selector: string, className: string): OrangeState | null {
  const subject = selector.split(" ").at(-1) ?? selector;
  const owns =
    subject === className ||
    subject.startsWith(`${className}:`) ||
    subject.startsWith(`${className}[`);
  if (!owns) return null;
  if (subject.includes(":disabled") || subject.includes("aria-disabled")) return "disabled";
  if (subject.includes(":focus")) return "focus";
  if (subject.includes(":hover")) return "hover";
  if (subject === className) return "normal";
  return null;
}

function statesFor(className: string, rules: { selector: string; decls: Decls }[]): Record<OrangeState, Decls> {
  const states: Record<OrangeState, Decls> = {
    normal: {},
    hover: {},
    focus: {},
    disabled: {},
  };
  for (const rule of rules) {
    const state = stateOf(rule.selector, className);
    if (!state) continue;
    states[state] = { ...states[state], ...rule.decls };
  }
  return states;
}

function roundRatio(foreground: string, background: string): number {
  return Math.round(contrastRatio(foreground, background) * 100) / 100;
}

function classAtoms(source: string): string[] {
  const atoms: string[] = [];
  const pattern =
    /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\}|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\})/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    const raw = match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5] ?? "";
    if (match[3] != null) {
      const quoted = /["']([^"']*)["']/g;
      let inner: RegExpExecArray | null;
      while ((inner = quoted.exec(raw)) !== null) atoms.push(inner[1]);
      atoms.push(raw.replace(/\$\{[^}]*\}/g, " ").replace(/["'][^"']*["']/g, " "));
    } else {
      atoms.push(raw);
    }
  }
  return atoms;
}

function tokenBase(token: string): string {
  return token.trim().replace(/^!/, "").replace(/^(?:[\w-]+:)*/, "");
}

/** Combinação proibida: fundo sólido #ec6e37 com texto branco no mesmo className. */
function orangeWhiteViolations(source: string, failingBgs: string[], whiteTexts: string[]): string[] {
  const violations: string[] = [];
  for (const atom of classAtoms(source)) {
    const tokens = atom.split(/\s+/).filter(Boolean);
    const hasFailingBg = tokens.some((token) => {
      const base = tokenBase(token);
      return failingBgs.includes(base) || /^bg-\[#ec6e37\]$/i.test(base);
    });
    const hasWhiteText = tokens.some((token) => {
      const base = tokenBase(token);
      return whiteTexts.includes(base) || base === "text-white" || /^text-\[#fff(?:fff)?\]$/i.test(base);
    });
    if (hasFailingBg && hasWhiteText) violations.push(atom.trim());
  }
  return violations;
}

describe("contraste do laranja com texto branco", () => {
  const css = fs.readFileSync(path.join(srcRoot, "app/globals.css"), "utf8");
  const tailwind = fs.readFileSync(path.join(webRoot, "tailwind.config.ts"), "utf8");
  const vars = cssVars(css);
  const rules = parseRules(css);

  it("usa um único token #c2410c, com branco em 5,18:1", () => {
    expect(css.match(/--brand-orange:\s*#[0-9a-fA-F]{6}/g)).toEqual([`--brand-orange: ${ORANGE_TOKEN}`]);
    expect(tailwind).toMatch(/orange:\s*"var\(--brand-orange\)"/);
    expect(tailwind).not.toMatch(/orange:\s*"#(?:c2410c|b8430f|ec6e37)"/i);
    expect(vars["brand-orange"]).toBe(ORANGE_TOKEN);
    expect(roundRatio(WHITE, ORANGE_TOKEN)).toBe(5.18);
    expect(roundRatio(WHITE, FAILING_ORANGE)).toBe(3.06);
    expect(roundRatio(WHITE, FAILING_ORANGE)).toBeLessThan(4.5);
  });

  it("mede normal, hover, focus e disabled em pelo menos 4,5:1", () => {
    const controls = [".btn-brand-orange", ".surface-brand-orange"] as const;
    const measured: {
      control: string;
      state: OrangeState;
      foreground: string;
      background: string;
      ratio: number;
    }[] = [];

    for (const control of controls) {
      const states = statesFor(control, rules);
      for (const state of ["normal", "hover", "focus", "disabled"] as const) {
        const decls = states[state];
        const foreground = resolveColor(decls.color, vars);
        const background = resolveColor(decls["background-color"], vars);
        expect(foreground, `${control} ${state} fg`).toBeTruthy();
        expect(background, `${control} ${state} bg`).toBeTruthy();
        expect(Number(decls.opacity ?? "1"), `${control} ${state} opacity`).toBe(1);
        const ratio = roundRatio(foreground!, background!);
        expect(ratio, `${control} ${state} ${foreground} sobre ${background}`).toBeGreaterThanOrEqual(4.5);
        expect([foreground, background].sort()).toEqual([ORANGE_TOKEN, WHITE].sort());
        measured.push({
          control: control.slice(1),
          state,
          foreground: foreground!,
          background: background!,
          ratio,
        });
      }
    }

    expect(measured).toEqual([
      { control: "btn-brand-orange", state: "normal", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
      { control: "btn-brand-orange", state: "hover", foreground: ORANGE_TOKEN, background: WHITE, ratio: 5.18 },
      { control: "btn-brand-orange", state: "focus", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
      { control: "btn-brand-orange", state: "disabled", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
      { control: "surface-brand-orange", state: "normal", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
      { control: "surface-brand-orange", state: "hover", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
      { control: "surface-brand-orange", state: "focus", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
      { control: "surface-brand-orange", state: "disabled", foreground: WHITE, background: ORANGE_TOKEN, ratio: 5.18 },
    ]);
  });

  it("barra #ec6e37 com texto branco no código", () => {
    const colors = brandColors(tailwind);
    const failingBgs = Object.entries(colors)
      .filter(([, hex]) => hex === FAILING_ORANGE)
      .map(([name]) => `bg-brand-${name}`);
    expect(failingBgs).toEqual(expect.arrayContaining(["bg-brand-primary", "bg-brand-secondary", "bg-brand-accent"]));

    const whiteTexts = Object.entries(colors)
      .filter(([, hex]) => hex === WHITE)
      .map(([name]) => `text-brand-${name}`);

    expect(
      orangeWhiteViolations('className="bg-brand-primary text-white"', failingBgs, whiteTexts)
    ).toHaveLength(1);
    expect(
      orangeWhiteViolations('className="bg-brand-primary/10 text-brand-primary"', failingBgs, whiteTexts)
    ).toEqual([]);
    expect(
      orangeWhiteViolations('className="hover:bg-brand-primary text-brand-primaryText"', failingBgs, whiteTexts)
    ).toHaveLength(1);

    const sourceFiles = walk(srcRoot).filter(
      (file) => /\.(tsx|css)$/.test(file) && !file.includes(`${path.sep}tests${path.sep}`)
    );
    sourceFiles.push(path.join(webRoot, "tailwind.config.ts"));

    for (const file of sourceFiles) {
      const src = fs.readFileSync(file, "utf8");
      expect(orangeWhiteViolations(src, failingBgs, whiteTexts), file).toEqual([]);
    }

    for (const rule of rules) {
      const background = resolveColor(rule.decls["background-color"] ?? rule.decls.background, vars);
      const foreground = resolveColor(rule.decls.color, vars);
      if (background === FAILING_ORANGE && foreground === WHITE) {
        expect.fail(`${rule.selector} usa ${FAILING_ORANGE} com texto branco`);
      }
    }
  });

  it("aplica o token no badge, na barra, em Como chegar, nos filtros, no login e no cadastro", () => {
    expect(read("components/layout/Header.tsx")).toContain("surface-brand-orange");
    expect(read("components/layout/Header.tsx")).not.toContain("text-[10px]");
    expect(read("components/layout/Header.tsx")).toContain("text-xs");
    expect(read("components/layout/AnnouncementBar.tsx")).toContain("surface-brand-orange");
    expect(read("components/home/StoreVisitSection.tsx")).toContain("surface-brand-orange");
    expect(read("components/home/StoreVisitSection.tsx")).toContain("Como chegar");
    expect(read("app/produtos/components/ProductFilters.tsx")).toContain("surface-brand-orange");
    expect(read("app/login/LoginForm.tsx")).toContain("btn-brand-orange");
    expect(read("app/cadastro/CadastroForm.tsx")).toContain("btn-brand-orange");
    expect(read("app/not-found.tsx")).toContain("btn-brand-orange");
    expect(read("app/layout.tsx")).toContain("surface-brand-orange");

    const tsxFiles = walk(srcRoot).filter((file) => file.endsWith(".tsx"));
    for (const file of tsxFiles) {
      const src = fs.readFileSync(file, "utf8");
      expect(src, file).not.toContain("text-[10px]");
      for (const atom of classAtoms(src)) {
        if (!atom.includes("btn-brand-orange") && !atom.includes("surface-brand-orange")) continue;
        expect(atom, file).not.toMatch(/disabled:opacity-/);
        expect(atom, file).not.toMatch(/opacity-50/);
      }
    }
  });

  it("preserva hero com um priority, WhatsApp #1a7f3c, tel: e header sticky só na barra do logo", () => {
    const hero = read("components/home/HeroSection.tsx");
    expect(hero.match(/\bpriority\b/g)).toEqual(["priority"]);
    expect(css).toContain("--wa-solid-bg: #1a7f3c");
    expect(read("components/contact/StoreContactLinks.tsx")).toContain("telHref(line)");
    const header = read("components/layout/Header.tsx");
    const headerClose = header.indexOf("</header>");
    expect(header).toContain("sticky top-0");
    expect(header.indexOf("<StoreContactPair")).toBeGreaterThan(headerClose);
    expect(header.slice(headerClose)).not.toContain("sticky");
  });
});

const GRAY_50 = (colors.gray as Record<string, string>)["50"].toLowerCase();
const GRAY_100 = (colors.gray as Record<string, string>)["100"].toLowerCase();
const GRAY_900 = (colors.gray as Record<string, string>)["900"].toLowerCase();

/** Fundos escuros em que #ec6e37 continua válido como texto. */
const DARK_CSS_BACKGROUNDS = new Set(["#0a0a0a", "#000000", GRAY_900, "#1f2937"]);

/**
 * Componentes sem fundo próprio: só entram no rodapé escuro.
 * A varredura trata a raiz como escura e o teste confirma o único importador.
 */
const DARK_FRAGMENT_FILES = new Set([
  "components/layout/footer/FooterNav.tsx",
  "components/layout/footer/SocialLinks.tsx",
]);

const LIGHT_ORANGE_TEXT_COUNTS: Record<string, number> = {
  "components/home/SocialProofSection.tsx": 1,
  "components/home/StoreVisitSection.tsx": 2,
  "components/home/FAQSection.tsx": 1,
  "components/home/TrustBar.tsx": 1,
  "components/ProductCard.tsx": 1,
  "app/login/LoginForm.tsx": 1,
  "app/cadastro/CadastroForm.tsx": 1,
  "app/checkout/CheckoutPage.tsx": 3,
  "components/layout/LegalPageLayout.tsx": 2,
  "app/contato/page.tsx": 5,
  "app/politica-privacidade/page.tsx": 1,
  "app/termos-uso/page.tsx": 1,
  "app/produtos/components/ProductPagination.tsx": 1,
  "app/produtos/[slug]/ProductDetail.tsx": 13,
};

const DARK_ORANGE_TEXT_COUNTS: Record<string, number> = {
  "components/home/HeroSection.tsx": 1,
  "components/layout/Header.tsx": 7,
  "components/layout/Footer.tsx": 6,
  "components/layout/footer/FooterNav.tsx": 6,
  "components/layout/footer/SocialLinks.tsx": 2,
  "app/produtos/ProductListPage.tsx": 1,
};

function cssCustomProps(css: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const pattern = /--([a-z0-9-]+):\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css)) !== null) {
    vars[match[1]] = match[2].trim().toLowerCase();
  }
  return vars;
}

function resolveCustom(name: string, vars: Record<string, string>): string | null {
  let value = vars[name];
  const seen = new Set<string>();
  while (value?.startsWith("var(--")) {
    const next = value.match(/^var\(--([a-z0-9-]+)\)$/)?.[1];
    if (!next || seen.has(next)) return null;
    seen.add(next);
    value = vars[next];
  }
  return value ?? null;
}

function utilityBase(token: string): string {
  let rest = token.trim();
  for (;;) {
    const next = rest.replace(/^!/, "").replace(/^[\w-]+(?:\[[^\]]*\])?:/, "");
    if (next === rest) return rest.replace(/^!/, "");
    rest = next;
  }
}

function isFailingOrangeText(token: string): boolean {
  return /^text-(?:brand-(?:primary|secondary|accent)|\[#ec6e37\])(?:\/\d+)?$/i.test(utilityBase(token));
}

function backgroundKind(token: string): "light" | "dark" | null {
  const base = utilityBase(token);
  if (/^bg-(?:white|brand-background|gray-50|gray-100)$/i.test(base)) return "light";
  if (/^bg-\[#(?:fff|ffffff|f9fafb|f3f4f6)\]$/i.test(base)) return "light";
  if (/^bg-brand-(?:primary|secondary|accent)\/(?:[1-9]|[1-4]\d|50)$/i.test(base)) return "light";
  if (/^bg-(?:black|brand-headerBg|brand-footerBg|gray-800|gray-900)$/i.test(base)) return "dark";
  if (/^bg-\[#(?:0a0a0a|000|000000|111827|1f2937)\]$/i.test(base)) return "dark";
  return null;
}

function quotedChunks(attrs: string): string[] {
  const chunks: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|`([^`]*)`/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(attrs)) !== null) {
    chunks.push(match[1] ?? match[2] ?? match[3] ?? "");
  }
  return chunks;
}

function tokensFromChunk(chunk: string): string[] {
  return chunk.replace(/\$\{[^}]*\}/g, " ").split(/\s+/).filter(Boolean);
}

type JsxTag = { closing: boolean; name: string; attrs: string; selfClosing: boolean };

function parseJsxTags(source: string): JsxTag[] {
  const tags: JsxTag[] = [];
  let i = 0;
  while (i < source.length) {
    const lt = source.indexOf("<", i);
    if (lt === -1) break;
    const next = source[lt + 1] ?? "";
    if (!/[A-Za-z/]/.test(next)) {
      i = lt + 1;
      continue;
    }
    let j = lt + 1;
    const closing = source[j] === "/";
    if (closing) j += 1;
    const nameStart = j;
    while (j < source.length && /[\w.]/.test(source[j] ?? "")) j += 1;
    const name = source.slice(nameStart, j);
    if (!name) {
      i = lt + 1;
      continue;
    }
    let quote: string | null = null;
    let brace = 0;
    let selfClosing = false;
    const attrStart = j;
    let ended = false;
    while (j < source.length) {
      const c = source[j] ?? "";
      if (quote) {
        if (c === "\\") {
          j += 2;
          continue;
        }
        if (c === quote) quote = null;
        j += 1;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        quote = c;
        j += 1;
        continue;
      }
      if (c === "{") {
        brace += 1;
        j += 1;
        continue;
      }
      if (c === "}") {
        brace = Math.max(0, brace - 1);
        j += 1;
        continue;
      }
      if (brace === 0 && c === "/" && source[j + 1] === ">") {
        selfClosing = true;
        j += 2;
        ended = true;
        break;
      }
      if (brace === 0 && c === ">") {
        j += 1;
        ended = true;
        break;
      }
      j += 1;
    }
    if (!ended) break;
    tags.push({
      closing,
      name,
      attrs: closing ? "" : source.slice(attrStart, selfClosing ? j - 2 : j - 1),
      selfClosing,
    });
    i = j;
  }
  return tags;
}

type SurfaceFrame = { name: string; light: boolean; dark: boolean };

function elementSurface(ownLight: boolean, ownDark: boolean, stack: SurfaceFrame[]): "light" | "dark" {
  if (ownDark && !ownLight) return "dark";
  if (ownLight) return "light";
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    const frame = stack[index];
    if (frame.dark && !frame.light) return "dark";
    if (frame.light) return "light";
  }
  return "light";
}

/** #ec6e37 como cor de texto ou ícone. Em fundo escuro não é violação. */
function lightOrangeTextViolations(source: string, rootDark = false): string[] {
  const cleaned = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  const stack: SurfaceFrame[] = rootDark ? [{ name: "#root", light: false, dark: true }] : [];
  const violations: string[] = [];
  const inlineFailing = /color\s*:\s*["'](?:#ec6e37|var\(--brand-primary\))["']|(?:fill|stroke)\s*=\s*["']#ec6e37["']/i;

  for (const tag of parseJsxTags(cleaned)) {
    if (tag.closing) {
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index].name === tag.name) {
          stack.length = index;
          break;
        }
      }
      continue;
    }

    const tokens = quotedChunks(tag.attrs).flatMap(tokensFromChunk);
    const failing = tokens.filter(isFailingOrangeText);
    let ownLight = false;
    let ownDark = false;
    for (const token of tokens) {
      const kind = backgroundKind(token);
      if (kind === "light") ownLight = true;
      if (kind === "dark") ownDark = true;
    }
    if ((failing.length > 0 || inlineFailing.test(tag.attrs)) && elementSurface(ownLight, ownDark, stack) === "light") {
      violations.push(`${tag.name}: ${failing.join(" ") || "inline #ec6e37"}`);
    }
    if (!tag.selfClosing) stack.push({ name: tag.name, light: ownLight, dark: ownDark });
  }
  return violations;
}

function countUtility(source: string, utility: string): number {
  return source.match(new RegExp(`(?:[\\w-]+:)*${utility}\\b`, "g"))?.length ?? 0;
}

function relSrc(file: string): string {
  return path.relative(srcRoot, file).split(path.sep).join("/");
}

describe("contraste do laranja como texto sobre fundo claro", () => {
  const css = fs.readFileSync(path.join(srcRoot, "app/globals.css"), "utf8");
  const tailwind = fs.readFileSync(path.join(webRoot, "tailwind.config.ts"), "utf8");
  const vars = cssCustomProps(css);
  const rules = parseRules(css);
  const orangeText = resolveCustom("brand-orange-text", vars);

  it("aponta brand.orangeText para o mesmo #c2410c, sem hex solto", () => {
    expect(GRAY_50).toBe("#f9fafb");
    expect(GRAY_100).toBe("#f3f4f6");
    expect(vars["brand-orange"]).toBe(ORANGE_TOKEN);
    expect(vars["brand-orange-text"]).toBe("var(--brand-orange)");
    expect(orangeText).toBe(ORANGE_TOKEN);
    expect(css.match(/--brand-orange(?:-text)?:\s*#[0-9a-fA-F]{6}/g)).toEqual([`--brand-orange: ${ORANGE_TOKEN}`]);
    expect(tailwind).toMatch(/orangeText:\s*"var\(--brand-orange-text\)"/);
    expect(tailwind).toMatch(/orange:\s*"var\(--brand-orange\)"/);
    expect(tailwind).not.toMatch(/orangeText:\s*"#/);
  });

  it("mede o token de texto sobre branco, gray-50 e gray-100 em pelo menos 4,5:1", () => {
    expect(orangeText).toBe(ORANGE_TOKEN);
    const surfaces = [
      ["branco", "#ffffff", 5.18],
      ["gray-50", GRAY_50, 4.96],
      ["gray-100", GRAY_100, 4.71],
    ] as const;
    for (const [name, background, ratio] of surfaces) {
      expect(roundRatio(orangeText!, background), name).toBe(ratio);
      expect(roundRatio(orangeText!, background), name).toBeGreaterThanOrEqual(4.5);
      expect(roundRatio(FAILING_ORANGE, background), `${FAILING_ORANGE} sobre ${name}`).toBeLessThan(4.5);
    }
    expect(roundRatio(FAILING_ORANGE, "#0a0a0a")).toBe(6.46);
    expect(roundRatio(FAILING_ORANGE, "#0a0a0a")).toBeGreaterThanOrEqual(4.5);
    expect(roundRatio(FAILING_ORANGE, GRAY_900)).toBeGreaterThanOrEqual(4.5);
    expect(roundRatio(ORANGE_TOKEN, "#0a0a0a")).toBeLessThan(4.5);
  });

  it("barra #ec6e37 como cor de texto apenas sobre fundo claro", () => {
    expect(lightOrangeTextViolations('<p className="text-brand-primary">loja</p>')).toEqual([
      "p: text-brand-primary",
    ]);
    expect(lightOrangeTextViolations('<a className="bg-white text-brand-primary">link</a>')).toEqual([
      "a: text-brand-primary",
    ]);
    expect(lightOrangeTextViolations('<a className="bg-gray-50 text-[#ec6e37]">link</a>')).toEqual([
      "a: text-[#ec6e37]",
    ]);
    expect(lightOrangeTextViolations('<a className="bg-gray-100 hover:text-brand-secondary">link</a>')).toEqual([
      "a: hover:text-brand-secondary",
    ]);
    expect(lightOrangeTextViolations('<span className="bg-brand-primary/10 text-brand-accent" />')).toEqual([
      "span: text-brand-accent",
    ]);
    expect(
      lightOrangeTextViolations(
        '<button onClick={() => setOpen(true)} className="bg-white"><span className="text-brand-primary">+</span></button>'
      )
    ).toEqual(["span: text-brand-primary"]);
    expect(lightOrangeTextViolations('<p className="text-brand-orangeText">ok</p>')).toEqual([]);
    expect(
      lightOrangeTextViolations('<section className="bg-black"><p className="text-brand-primary">hero</p></section>')
    ).toEqual([]);
    expect(
      lightOrangeTextViolations(
        '<header className="bg-brand-headerBg"><a className="hover:text-brand-primary">nav</a></header>'
      )
    ).toEqual([]);
    expect(
      lightOrangeTextViolations(
        '<footer className="bg-brand-footerBg"><a className="text-brand-primary">Como chegar</a></footer>'
      )
    ).toEqual([]);
    expect(
      lightOrangeTextViolations(
        '<div className="bg-gray-50"><section className="bg-gray-900"><p className="text-brand-primary">aviso</p></section></div>'
      )
    ).toEqual([]);

    const footer = read("components/layout/Footer.tsx");
    expect(footer).toContain("bg-brand-footerBg");
    expect(footer).toContain("<SocialLinks");
    expect(footer).toContain("<FooterNav");
    for (const fragment of DARK_FRAGMENT_FILES) {
      const base = path.basename(fragment, ".tsx");
      const importers = walk(srcRoot).filter((file) => {
        if (!file.endsWith(".tsx") || file.includes(`${path.sep}tests${path.sep}`)) return false;
        if (relSrc(file) === fragment) return false;
        return fs.readFileSync(file, "utf8").includes(`<${base}`);
      });
      expect(importers.map(relSrc), fragment).toEqual(["components/layout/Footer.tsx"]);
      expect(lightOrangeTextViolations(read(fragment))).not.toEqual([]);
      expect(lightOrangeTextViolations(read(fragment), true), fragment).toEqual([]);
    }

    const sourceFiles = walk(srcRoot).filter((file) => file.endsWith(".tsx") && !file.includes(`${path.sep}tests${path.sep}`));
    for (const file of sourceFiles) {
      const rel = relSrc(file);
      const src = fs.readFileSync(file, "utf8");
      expect(lightOrangeTextViolations(src, DARK_FRAGMENT_FILES.has(rel)), rel).toEqual([]);
      expect(countUtility(src, "text-brand-orangeText"), rel).toBe(LIGHT_ORANGE_TEXT_COUNTS[rel] ?? 0);
      expect(countUtility(src, "text-brand-primary"), rel).toBe(DARK_ORANGE_TEXT_COUNTS[rel] ?? 0);
      expect(countUtility(src, "text-brand-secondary"), rel).toBe(0);
      expect(countUtility(src, "text-brand-accent"), rel).toBe(0);
    }

    const contato = read("app/contato/page.tsx");
    expect(contato).toContain('className="inline-flex min-h-11 items-center text-brand-orangeText hover:underline"');
    expect(contato).toContain("Como chegar");
    const visit = read("components/home/StoreVisitSection.tsx");
    const comoChegar = visit.slice(Math.max(0, visit.indexOf("Como chegar") - 220), visit.indexOf("Como chegar"));
    expect(comoChegar).toContain("surface-brand-orange");
    expect(comoChegar).not.toContain("text-brand-");
    expect(footer).toContain("text-brand-primary");
    expect(footer).toContain("Como chegar (Google Maps)");

    for (const rule of rules) {
      const foreground = resolveColor(rule.decls.color, vars);
      if (foreground !== FAILING_ORANGE) continue;
      const background = resolveColor(rule.decls["background-color"] ?? rule.decls.background, vars);
      expect(background && DARK_CSS_BACKGROUNDS.has(background), rule.selector).toBe(true);
    }
  });
});
