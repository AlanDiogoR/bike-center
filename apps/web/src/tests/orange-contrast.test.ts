import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
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
