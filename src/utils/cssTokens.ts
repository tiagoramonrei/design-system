/**
 * Runtime CSS token reader.
 * Reads CSS custom properties from :root so the DS page stays
 * in sync with the stylesheet without duplicating values.
 */

export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
}

export function buildScale(
  prefix: string,
  steps: string[],
): { step: string; hex: string }[] {
  return steps.map((step) => ({
    step,
    hex: getCssVar(`${prefix}-${step}`),
  }));
}

/**
 * Builds a hex → primitive-name map by reading CSS variables at runtime.
 * Used by TokenTable to show which primitive each semantic token resolves to.
 */
export function buildScaleMap(
  scales: [prefix: string, steps: string[]][],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [prefix, steps] of scales) {
    for (const step of steps) {
      const hex = getCssVar(`${prefix}-${step}`).toUpperCase();
      if (hex) map[hex] = `${prefix}-${step}`;
    }
  }
  return map;
}

/**
 * Resolves semantic tokens for both light and dark themes in one pass.
 * Temporarily switches data-theme, reads values, then restores.
 * Safe to call during render (synchronous, no repaint between switches).
 */
export function resolveSemanticTokens<T extends { token: string }>(
  defs: T[],
): (T & { lightValue: string; darkValue: string })[] {
  const root = document.documentElement;
  const saved = root.getAttribute("data-theme");

  root.setAttribute("data-theme", "light");
  const lightVals = defs.map((d) =>
    getCssVar(d.token.replace(/^\$/, "")),
  );

  root.setAttribute("data-theme", "dark");
  const darkVals = defs.map((d) =>
    getCssVar(d.token.replace(/^\$/, "")),
  );

  if (saved) root.setAttribute("data-theme", saved);
  else root.removeAttribute("data-theme");

  return defs.map((d, i) => ({
    ...d,
    lightValue: lightVals[i],
    darkValue: darkVals[i],
  }));
}
