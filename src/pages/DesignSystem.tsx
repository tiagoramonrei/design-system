import { useState, useMemo } from "react";
import ColorScale from "../components/ds/ColorScale";
import TokenTable, { type TokenRow } from "../components/ds/TokenTable";
import ThemeToggle from "../components/ds/ThemeToggle";
import TabBar from "../components/ds/TabBar";
import logoPitacoBlack from "../assets/logo-pitaco-black.png";
import logoPitacoWhite from "../assets/logo-pitaco-white.png";
import {
  buildScale,
  buildScaleMap,
  getCssVar,
  resolveSemanticTokens,
} from "../utils/cssTokens";

type TabId = "colors" | "typography" | "spacing" | "tokens";

const DS_TABS = [
  { id: "colors" as const, label: "Colors" },
  { id: "typography" as const, label: "Typography" },
  { id: "spacing" as const, label: "Spacing" },
  { id: "tokens" as const, label: "Tokens" },
];

/* ==========================================================
   PRIMITIVE SCALE STEP DEFINITIONS
   Only the structure — hex values come from CSS at runtime.
   ========================================================== */

const PRIMITIVE_STEPS: Record<string, string[]> = {
  "brand-violet": ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "brand-purple": ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "lightdark": ["0", "15", "25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "850", "900"],
  "green": ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "yellow": ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "red": ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "blue": ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "lime": ["100", "200", "300", "400", "500"],
  "cyan": ["100", "200", "300", "400", "500"],
};

/* ==========================================================
   SEMANTIC TOKEN DEFINITIONS
   Token name + role description — values come from CSS.
   ========================================================== */

const BACKGROUND_DEFS = [
  { token: "$background", role: "Fundo padrao da pagina." },
  { token: "$background-inverse", role: "Fundo de alto contraste ou elementos invertidos." },
  { token: "$background-border", role: "Fundo com borda de separacao." },
  { token: "$background-gradient-header-01", role: "Gradiente de sobreposicao usado no header." },
  { token: "$background-gradient-header-02", role: "Gradiente de sobreposicao usado no header." },
  { token: "$background-on-color-light", role: "Fundo claro sobre cor." },
  { token: "$background-on-color-dark", role: "Fundo escuro sobre cor." },
];

const LAYER_DEFS = [
  { token: "$layer-01", role: "Fundo de camadas sobre o $background." },
  { token: "$layer-02", role: "Fundo de camadas sobre o $background." },
  { token: "$layer-03", role: "Fundo de camadas sobre o $background." },
  { token: "$layer-04", role: "Fundo de destaque sobre o $background." },
  { token: "$layer-gradient-01", role: "Gradiente de camada sobre o $background." },
  { token: "$layer-gradient-02", role: "Gradiente de camada sobre o $background." },
];

const BORDER_DEFS = [
  { token: "$border-01", role: "Cor de borda ou divisor." },
  { token: "$border-02", role: "Cor de borda ou divisor." },
  { token: "$border-03", role: "Cor de borda ou divisor." },
  { token: "$border-active", role: "Cor ativa para todas as bordas." },
  { token: "$border-gradient-01", role: "Gradiente de borda ou divisor." },
  { token: "$border-gradient-02", role: "Gradiente de borda ou divisor." },
];

const TEXT_DEFS = [
  { token: "$text-01", role: "Cor primaria de texto." },
  { token: "$text-02", role: "Cor secundaria de texto." },
  { token: "$text-03", role: "Cor de destaque (sucesso)." },
  { token: "$text-04", role: "Cor de destaque (alerta)." },
  { token: "$text-inverse", role: "Texto em camadas de alto contraste." },
  { token: "$text-on-color-white", role: "Texto branco sobre cor." },
  { token: "$text-on-color-black", role: "Texto preto sobre cor." },
];

const BUTTON_DEFS = [
  { token: "$button-primary-gradient-01", role: "Cor do botao primario." },
  { token: "$button-primary-gradient-02", role: "Cor do botao primario." },
  { token: "$button-secondary", role: "Cor do botao secundario." },
  { token: "$button-odds-01", role: "Cor do botao de odds." },
  { token: "$button-odds-02", role: "Cor do botao de odds." },
  { token: "$button-odds-selected-01", role: "Cor selecionada do $button-odds." },
  { token: "$button-odds-selected-02", role: "Cor selecionada do $button-odds." },
];

/* ==========================================================
   TYPOGRAPHY DEFINITIONS
   Structure only — values come from CSS at runtime.
   ========================================================== */

const FONT_SIZE_STEPS = ["80", "72", "64", "56", "48", "40", "32", "24", "20", "16", "14", "12", "10", "8"];

const WEIGHT_DEFS = [
  { step: "regular", label: "Regular" },
  { step: "medium", label: "Medium" },
  { step: "bold", label: "Bold" },
  { step: "extrabold", label: "Extra Bold" },
];

const FAMILY_DEFS = [
  { step: "display", label: "Red Hat Display", sample: "ABCDEFGHIJKLM abcdefghijklm 0123456789" },
];

const LINE_HEIGHT_DEFS = [
  { step: "tight", label: "Tight" },
  { step: "normal", label: "Normal" },
  { step: "relaxed", label: "Relaxed" },
];

/* ==========================================================
   SPACING DEFINITIONS
   Structure only — values come from CSS at runtime.
   ========================================================== */

const SPACING_STEPS = ["2", "4", "8", "12", "16", "20", "24", "32", "40", "48", "56", "64", "80", "96", "120", "160"];

/* ==========================================================
   TAB CONTENT COMPONENTS
   ========================================================== */

function ColorsTab() {
  const scales = useMemo(() => ({
    brandViolet: buildScale("brand-violet", PRIMITIVE_STEPS["brand-violet"]),
    brandPurple: buildScale("brand-purple", PRIMITIVE_STEPS["brand-purple"]),
    lightDark: buildScale("lightdark", PRIMITIVE_STEPS["lightdark"]),
    green: buildScale("green", PRIMITIVE_STEPS["green"]),
    yellow: buildScale("yellow", PRIMITIVE_STEPS["yellow"]),
    red: buildScale("red", PRIMITIVE_STEPS["red"]),
    blue: buildScale("blue", PRIMITIVE_STEPS["blue"]),
    lime: buildScale("lime", PRIMITIVE_STEPS["lime"]),
    cyan: buildScale("cyan", PRIMITIVE_STEPS["cyan"]),
  }), []);

  return (
    <>
      <section className="ds-section">
        <h2 className="ds-section__title">Brand Colors</h2>
        <p className="ds-section__subtitle">
          As cores primarias da marca. Brand Violet e Brand Purple formam o
          gradiente principal usado em botoes, headers e elementos de destaque.
        </p>
        <ColorScale name="Violet" steps={scales.brandViolet} />
        <ColorScale name="Purple" steps={scales.brandPurple} />
      </section>

      <hr className="ds-divider" />

      <section className="ds-section">
        <h2 className="ds-section__title">LightDark</h2>
        <p className="ds-section__subtitle">
          Escala de neutros que serve de base para backgrounds, layers, borders
          e texto. Ancoras em 0, 25, 50, 600, 700, 800 com intermediarios
          interpolados linearmente.
        </p>
        <ColorScale name="LightDark" steps={scales.lightDark} />
      </section>

      <hr className="ds-divider" />

      <section className="ds-section">
        <h2 className="ds-section__title">Semantic Colors</h2>
        <p className="ds-section__subtitle">
          Cores para estados semanticos: Success (Green), Warning (Yellow),
          Error (Red), Info (Blue). Baseadas na paleta TailwindCSS.
        </p>
        <ColorScale name="Green" steps={scales.green} />
        <ColorScale name="Yellow" steps={scales.yellow} />
        <ColorScale name="Red" steps={scales.red} />
        <ColorScale name="Blue" steps={scales.blue} />
      </section>

      <hr className="ds-divider" />

      <section className="ds-section">
        <h2 className="ds-section__title">Complementary Colors</h2>
        <p className="ds-section__subtitle">
          Mini escalas para cores complementares usadas em elementos interativos
          como odds selecionadas. Lime e Cyan com 5 steps cada.
        </p>
        <ColorScale name="Lime" steps={scales.lime} />
        <ColorScale name="Cyan" steps={scales.cyan} />
      </section>
    </>
  );
}

function TypographyTab() {
  const typo = useMemo(() => {
    const fontSizes = FONT_SIZE_STEPS.map((step) => {
      const raw = getCssVar(`font-size-${step}`);
      return { label: step, size: parseInt(raw) || parseInt(step), token: `$font-size-${step}` };
    });

    const fontWeights = WEIGHT_DEFS.map((w) => {
      const weight = parseInt(getCssVar(`font-weight-${w.step}`)) || 400;
      return { label: w.label, weight, token: `$font-weight-${w.step}` };
    });

    const fontFamilies = FAMILY_DEFS.map((f) => ({
      label: f.label,
      family: getCssVar(`font-family-${f.step}`) || f.label,
      token: `$font-family-${f.step}`,
      sample: f.sample,
    }));

    const lineHeights = LINE_HEIGHT_DEFS.map((lh) => ({
      label: lh.label,
      value: parseFloat(getCssVar(`line-height-${lh.step}`)) || 1.5,
      token: `$line-height-${lh.step}`,
    }));

    return { fontSizes, fontWeights, fontFamilies, lineHeights };
  }, []);

  return (
    <>
      <section className="ds-section">
        <h2 className="ds-section__title">Font Family</h2>
        <p className="ds-section__subtitle">
          A familia tipografica do produto. Red Hat Display para
          titulos e corpo de texto.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}>
          {typo.fontFamilies.map((f) => (
            <div
              key={f.token}
              style={{}}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "var(--spacing-16)",
                  marginBottom: "var(--spacing-8)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--font-size-20)",
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--text-01)",
                  }}
                >
                  {f.label}
                </span>
                <code
                  style={{
                    fontFamily: "var(--mono-font)",
                    fontSize: "var(--font-size-14)",
                    color: "var(--text-02)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.token}
                </code>
              </div>
              <span
                style={{
                  fontFamily: f.family,
                  fontSize: "var(--font-size-32)",
                  color: "var(--text-01)",
                }}
              >
                {f.sample}
              </span>
            </div>
          ))}
        </div>
      </section>

      <hr className="ds-divider" />

      <section className="ds-section">
        <h2 className="ds-section__title">Pesos</h2>
        <p className="ds-section__subtitle">
          Variacoes de peso da Red Hat Display usadas no produto.
          Regular para corpo, Medium para enfase, Bold para titulos
          e Extra Bold para destaques.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-20)",
          }}
        >
          {typo.fontWeights.map((w, i) => (
            <div
              key={w.weight}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "var(--spacing-24)",
                ...(i < typo.fontWeights.length - 1 && {
                  borderBottom: "1px solid var(--background-border)",
                  paddingBottom: "var(--spacing-16)",
                }),
              }}
            >
              <span
                style={{
                  fontWeight: w.weight,
                  fontSize: "var(--font-size-32)",
                  flex: 1,
                  color: "var(--text-01)",
                }}
              >
                {w.label} — {w.weight}
              </span>
              <code
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: "var(--font-size-14)",
                  color: "var(--text-02)",
                  whiteSpace: "nowrap",
                }}
              >
                {w.token}
              </code>
            </div>
          ))}
        </div>
      </section>

      <hr className="ds-divider" />

      <section className="ds-section">
        <h2 className="ds-section__title">Escala de Tamanhos</h2>
        <p className="ds-section__subtitle">
          Escala tipografica de 8px a 80px. Cada step e um token
          reutilizavel que garante consistencia entre codigo e design.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-16)",
          }}
        >
          {typo.fontSizes.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "var(--spacing-24)",
                ...(i < typo.fontSizes.length - 1 && {
                  borderBottom: "1px solid var(--background-border)",
                  paddingBottom: "var(--spacing-12)",
                }),
              }}
            >
              <span
                style={{
                  fontSize: s.size,
                  fontWeight: "var(--font-weight-medium)",
                  flex: 1,
                  color: "var(--text-01)",
                  lineHeight: "var(--line-height-tight)",
                }}
              >
                Red Hat Display — {s.size}px
              </span>
              <code
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: "var(--font-size-14)",
                  color: "var(--text-02)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.token}
              </code>
            </div>
          ))}
        </div>
      </section>

      <hr className="ds-divider" />

      <section className="ds-section">
        <h2 className="ds-section__title">Line Height</h2>
        <p className="ds-section__subtitle">
          Tres alturas de linha para diferentes contextos: tight para
          titulos, normal para corpo e relaxed para textos longos.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-20)" }}>
          {typo.lineHeights.map((lh, i) => (
            <div
              key={lh.token}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-24)",
                ...(i < typo.lineHeights.length - 1 && {
                  borderBottom: "1px solid var(--background-border)",
                  paddingBottom: "var(--spacing-16)",
                }),
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--spacing-12)",
                    marginBottom: "var(--spacing-8)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--font-size-20)",
                      fontWeight: "var(--font-weight-bold)",
                      color: "var(--text-01)",
                    }}
                  >
                    {lh.label}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--font-size-16)",
                      color: "var(--text-02)",
                    }}
                  >
                    {lh.value}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "var(--font-size-16)",
                    lineHeight: lh.value,
                    color: "var(--text-01)",
                    maxWidth: 520,
                  }}
                >
                  O Pitaco e a plataforma onde voce da seu pitaco nos jogos.
                  Acompanhe odds, monte suas apostas e sinta a emoçao do esporte.
                </p>
              </div>
              <code
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: "var(--font-size-14)",
                  color: "var(--text-02)",
                  whiteSpace: "nowrap",
                  paddingTop: "var(--spacing-4)",
                }}
              >
                {lh.token}
              </code>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}

function SpacingTab() {
  const spacings = useMemo(
    () =>
      SPACING_STEPS.map((step) => {
        const raw = getCssVar(`spacing-${step}`);
        return {
          step,
          px: parseInt(raw) || parseInt(step),
          token: `$spacing-${step}`,
        };
      }),
    [],
  );

  const maxPx = spacings[spacings.length - 1].px;

  return (
    <section className="ds-section">
      <h2 className="ds-section__title">Spacing</h2>
      <p className="ds-section__subtitle">
        Escala de espaçamento de 2px a 160px. Cada step e um token
        reutilizavel que garante consistencia entre codigo e design.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
        {spacings.map((s, i) => (
          <div
            key={s.step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-16)",
              ...(i < spacings.length - 1 && {
                borderBottom: "1px solid var(--background-border)",
                paddingBottom: "var(--spacing-12)",
              }),
            }}
          >
            <code
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: "var(--font-size-14)",
                color: "var(--text-02)",
                whiteSpace: "nowrap",
                width: 56,
                textAlign: "left",
                flexShrink: 0,
              }}
            >
              {s.px}px
            </code>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: `${(s.px / maxPx) * 100}%`,
                  minWidth: 2,
                  height: 16,
                  borderRadius: "var(--spacing-4)",
                  background:
                    "linear-gradient(135deg, var(--border-gradient-02), var(--border-gradient-01))",
                  transition: "width 0.3s",
                }}
              />
            </div>

            <code
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: "var(--font-size-14)",
                color: "var(--text-02)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s.token}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}

function TokensTab() {
  const { groups, scaleMap } = useMemo(() => {
    const allDefs = [
      { title: "Background", defs: BACKGROUND_DEFS },
      { title: "Layer", defs: LAYER_DEFS },
      { title: "Border", defs: BORDER_DEFS },
      { title: "Text", defs: TEXT_DEFS },
      { title: "Button", defs: BUTTON_DEFS },
    ];

    const flatDefs = allDefs.flatMap((g) => g.defs);
    const resolved = resolveSemanticTokens(flatDefs);

    let idx = 0;
    const groups = allDefs.map((g) => {
      const tokens: TokenRow[] = resolved.slice(idx, idx + g.defs.length);
      idx += g.defs.length;
      return { title: g.title, tokens };
    });

    const scaleMap = buildScaleMap(
      Object.entries(PRIMITIVE_STEPS) as [string, string[]][],
    );

    return { groups, scaleMap };
  }, []);

  return (
    <section className="ds-section">
      <h2 className="ds-section__title">Tokens</h2>
      <p className="ds-section__subtitle">
        Tokens semanticos com variantes Light e Dark. Cada token referencia
        as primitivas e pode ser usado diretamente via CSS variable.
      </p>

      {groups.map((g) => (
        <TokenTable
          key={g.title}
          title={g.title}
          tokens={g.tokens}
          scaleMap={scaleMap}
        />
      ))}
    </section>
  );
}

/* ==========================================================
   PAGE
   ========================================================== */

export default function DesignSystem() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<TabId>("colors");

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="ds-page">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--spacing-32)",
        }}
      >
        <div>
          <img src={theme === "dark" ? logoPitacoWhite : logoPitacoBlack} alt="Pitaco" style={{ height: 56 }} />
          <p
            style={{
              fontSize: "var(--font-size-14)",
              color: "var(--text-02)",
              marginTop: "var(--spacing-4)",
            }}
          >
            Design System
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <TabBar tabs={DS_TABS} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as TabId)} />

      {activeTab === "colors" && <ColorsTab />}
      {activeTab === "typography" && <TypographyTab />}
      {activeTab === "spacing" && <SpacingTab />}
      {activeTab === "tokens" && <TokensTab />}
    </div>
  );
}
