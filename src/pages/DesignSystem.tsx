import { useState, useEffect, useMemo } from "react";
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
import {
  ButtonOddDefault,
  ButtonOnlyOdds,
  ButtonOddEscadinha,
  ButtonBlock,
  OddsMercados,
} from "../components/ui/buttonsOdd";
import { Button } from "../components/ui/buttons";

type TabId = "colors" | "typography" | "spacing" | "tokens" | "components";

const DS_TABS = [
  { id: "colors" as const, label: "Colors" },
  { id: "typography" as const, label: "Typography" },
  { id: "spacing" as const, label: "Spacing" },
  { id: "tokens" as const, label: "Tokens" },
  { id: "components" as const, label: "Componentes" },
];

const COMPONENT_LIST = [
  { id: "button-odds", label: "Button Odds" },
  { id: "buttons", label: "Buttons" },
] as const;

type ComponentId = (typeof COMPONENT_LIST)[number]["id"];

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
  "orange": ["100", "200", "300", "400", "500"],
  "pink": ["100", "200", "300", "400", "500"],
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
  { token: "$layer-gradient-03", role: "Gradiente secundario de camada." },
  { token: "$layer-gradient-04", role: "Gradiente secundario de camada." },
];

const BORDER_DEFS = [
  { token: "$border-01", role: "Cor de borda ou divisor." },
  { token: "$border-02", role: "Cor de borda ou divisor." },
  { token: "$border-03", role: "Cor de borda ou divisor." },
  { token: "$border-gradient-01", role: "Gradiente de borda ou divisor." },
  { token: "$border-gradient-02", role: "Gradiente de borda ou divisor." },
];

const TEXT_DEFS = [
  { token: "$text-01", role: "Cor primaria de texto." },
  { token: "$text-02", role: "Cor secundaria de texto." },
  { token: "$text-03", role: "Cor de destaque." },
  { token: "$text-inverse", role: "Texto em camadas de alto contraste." },
  { token: "$text-on-color-white", role: "Texto branco sobre cor." },
  { token: "$text-on-color-black", role: "Texto preto sobre cor." },
];

const FEEDBACK_DEFS = [
  { token: "$feedback-success-bg", role: "Fundo base do feedback de sucesso." },
  { token: "$feedback-success-gradient-01", role: "Gradiente do feedback de sucesso." },
  { token: "$feedback-success-gradient-02", role: "Gradiente do feedback de sucesso." },
  { token: "$feedback-success-text", role: "Texto do feedback de sucesso." },
  { token: "$feedback-success-icon", role: "Icone do feedback de sucesso." },
  { token: "$feedback-error-bg", role: "Fundo base do feedback de erro." },
  { token: "$feedback-error-gradient-01", role: "Gradiente do feedback de erro." },
  { token: "$feedback-error-gradient-02", role: "Gradiente do feedback de erro." },
  { token: "$feedback-error-text", role: "Texto do feedback de erro." },
  { token: "$feedback-error-icon", role: "Icone do feedback de erro." },
  { token: "$feedback-warning-bg", role: "Fundo base do feedback de atencao." },
  { token: "$feedback-warning-gradient-01", role: "Gradiente do feedback de atencao." },
  { token: "$feedback-warning-gradient-02", role: "Gradiente do feedback de atencao." },
  { token: "$feedback-warning-text", role: "Texto do feedback de atencao." },
  { token: "$feedback-warning-icon", role: "Icone do feedback de atencao." },
];

const BUTTON_DEFS = [
  { token: "$button-primary-gradient-01", role: "Cor do botao primario." },
  { token: "$button-primary-gradient-02", role: "Cor do botao primario." },
  { token: "$button-secondary-gradient-01", role: "Cor do botao secundario." },
  { token: "$button-secondary-gradient-02", role: "Cor do botao secundario." },
  { token: "$button-odds-01", role: "Cor do botao de odds." },
  { token: "$button-odds-02", role: "Cor do botao de odds." },
  { token: "$button-odds-selected-01", role: "Cor selecionada do $button-odds." },
  { token: "$button-odds-selected-02", role: "Cor selecionada do $button-odds." },
];

/* ==========================================================
   TYPOGRAPHY DEFINITIONS
   Structure only — values come from CSS at runtime.
   ========================================================== */

const FONT_SIZE_STEPS = ["80", "72", "64", "56", "48", "40", "32", "28", "24", "20", "16", "14", "12", "10", "8"];

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

const SPACING_STEPS = ["2", "4", "8", "12", "16", "20", "24", "28", "32", "40", "48", "56", "64", "80", "96", "120", "160"];

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
    orange: buildScale("orange", PRIMITIVE_STEPS["orange"]),
    pink: buildScale("pink", PRIMITIVE_STEPS["pink"]),
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
          como odds selecionadas. Lime, Cyan, Orange e Pink com 5 steps cada.
        </p>
        <ColorScale name="Lime" steps={scales.lime} />
        <ColorScale name="Cyan" steps={scales.cyan} />
        <ColorScale name="Orange" steps={scales.orange} />
        <ColorScale name="Pink" steps={scales.pink} />
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
  const allDefs = [
    { title: "Background", defs: BACKGROUND_DEFS },
    { title: "Layer", defs: LAYER_DEFS },
    { title: "Border", defs: BORDER_DEFS },
    { title: "Text", defs: TEXT_DEFS },
    { title: "Feedback", defs: FEEDBACK_DEFS },
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
   COMPONENTS TAB
   ========================================================== */

function ButtonOddsContent() {
  const h3Style = { fontSize: "var(--font-size-16)", fontWeight: "var(--font-weight-bold)", color: "var(--text-01)", marginBottom: "var(--spacing-12)" } as const;
  const labelStyle = { fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-bold)", color: "var(--text-02)", marginBottom: "var(--spacing-8)" } as const;
  const containerStyle = { background: "var(--layer-03)", padding: "var(--spacing-24)", borderRadius: "var(--spacing-12)" } as const;
  const badgeStyle = { fontSize: "var(--font-size-10)", color: "var(--text-02)", marginTop: "var(--spacing-4)", display: "block", textAlign: "center", fontFamily: "var(--mono-font)" } as const;
  const itemStyle = { display: "flex", flexDirection: "column", alignItems: "center" } as const;

  return (
    <>
      {/* ========== Seção 1: Botões de Odd Individual ========== */}
      <section className="ds-section">
        <h2 className="ds-section__title">Botões de Odd Individual</h2>
        <p className="ds-section__subtitle">
          Botões atômicos para exibição de odds. Quatro formatos: odd default,
          only odds, escadinha e lock.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-32)" }}>
          {/* Odd Default */}
          <div>
            <h3 style={h3Style}>Odd Default</h3>
            <div style={{ ...containerStyle, display: "flex", gap: "var(--spacing-16)", flexWrap: "wrap" }}>
              <div style={itemStyle}>
                <ButtonOddDefault bgColor="color01" />
                <span style={badgeStyle}>color01</span>
              </div>
              <div style={itemStyle}>
                <ButtonOddDefault bgColor="color02" />
                <span style={badgeStyle}>color02</span>
              </div>
              <div style={itemStyle}>
                <ButtonOddDefault bgColor="selected" />
                <span style={badgeStyle}>selected</span>
              </div>
            </div>
          </div>

          {/* Only Odds */}
          <div>
            <h3 style={h3Style}>Only Odds</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div>
                <p style={labelStyle}>Com boost</p>
                <div style={{ ...containerStyle, display: "flex", gap: "var(--spacing-16)", flexWrap: "wrap" }}>
                  <div style={itemStyle}>
                    <ButtonOnlyOdds bgColor="color01" boost />
                    <span style={badgeStyle}>color01</span>
                  </div>
                  <div style={itemStyle}>
                    <ButtonOnlyOdds bgColor="color02" boost />
                    <span style={badgeStyle}>color02</span>
                  </div>
                  <div style={itemStyle}>
                    <ButtonOnlyOdds bgColor="selected" boost />
                    <span style={badgeStyle}>selected</span>
                  </div>
                </div>
              </div>

              <div>
                <p style={labelStyle}>Sem boost</p>
                <div style={{ ...containerStyle, display: "flex", gap: "var(--spacing-16)", flexWrap: "wrap" }}>
                  <div style={itemStyle}>
                    <ButtonOnlyOdds bgColor="color01" boost={false} />
                    <span style={badgeStyle}>color01</span>
                  </div>
                  <div style={itemStyle}>
                    <ButtonOnlyOdds bgColor="color02" boost={false} />
                    <span style={badgeStyle}>color02</span>
                  </div>
                  <div style={itemStyle}>
                    <ButtonOnlyOdds bgColor="selected" boost={false} />
                    <span style={badgeStyle}>selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Odd Escadinha */}
          <div>
            <h3 style={h3Style}>Odd Escadinha</h3>
            <div style={{ ...containerStyle, display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-16)" }}>
                <ButtonOddEscadinha bgColor="color01" />
                <span style={{ ...badgeStyle, marginTop: 0 }}>color01</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-16)" }}>
                <ButtonOddEscadinha bgColor="color02" />
                <span style={{ ...badgeStyle, marginTop: 0 }}>color02</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-16)" }}>
                <ButtonOddEscadinha bgColor="selected" />
                <span style={{ ...badgeStyle, marginTop: 0 }}>selected</span>
              </div>
            </div>
          </div>

          {/* Lock */}
          <div>
            <h3 style={h3Style}>Lock</h3>
            <div style={{ ...containerStyle, display: "flex", gap: "var(--spacing-16)", flexWrap: "wrap" }}>
              <div style={itemStyle}>
                <ButtonBlock bgColor="color01" />
                <span style={badgeStyle}>color01</span>
              </div>
              <div style={itemStyle}>
                <ButtonBlock bgColor="color02" />
                <span style={badgeStyle}>color02</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="ds-divider" />

      {/* ========== Seção 2: Mercados ========== */}
      <section className="ds-section">
        <h2 className="ds-section__title">Mercados</h2>
        <p className="ds-section__subtitle">
          Composições de botões de odd para exibição de mercados de apostas.
          Clique nos botões para ver o estado selecionado.
        </p>

        <div>
          <h3 style={h3Style}>Tipos de mercado</h3>
          <div style={{ ...containerStyle, display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
            <div>
              <p style={labelStyle}>1x2 Tradicional</p>
              <OddsMercados type="1x2-tradicional" interactive />
            </div>
            <div>
              <p style={labelStyle}>1x2</p>
              <OddsMercados type="1x2" interactive />
            </div>
            <div>
              <p style={labelStyle}>Dupla Chance</p>
              <OddsMercados type="duplaChance" interactive />
            </div>
            <div>
              <p style={labelStyle}>Sim / Não</p>
              <OddsMercados type="sim/nao" interactive />
            </div>
            <div>
              <p style={labelStyle}>Over / Under</p>
              <OddsMercados type="overUnder" interactive />
            </div>
            <div>
              <p style={labelStyle}>Combinada</p>
              <OddsMercados type="combinada" oddValue="4.50x" totalSelections={4} interactive />
            </div>
            <div>
              <p style={labelStyle}>Escadinha</p>
              <OddsMercados type="escadinha" interactive />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ButtonsContent() {
  const h3Style = { fontSize: "var(--font-size-16)", fontWeight: "var(--font-weight-bold)", color: "var(--text-01)", marginBottom: "var(--spacing-12)" } as const;
  const labelStyle = { fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-bold)", color: "var(--text-02)", marginBottom: "var(--spacing-8)" } as const;
  const containerStyle = { background: "var(--layer-01)", padding: "var(--spacing-24)", borderRadius: "var(--spacing-12)" } as const;
  const rowStyle = { display: "flex", gap: "var(--spacing-24)", flexWrap: "wrap", alignItems: "flex-end" } as const;
  const badgeStyle = { fontSize: "var(--font-size-10)", color: "var(--text-02)", marginTop: "var(--spacing-4)", display: "block", textAlign: "center", fontFamily: "var(--mono-font)" } as const;
  const itemStyle = { display: "flex", flexDirection: "column", alignItems: "center" } as const;

  return (
    <>
      {/* Seção 1: Sem ícone */}
      <section className="ds-section">
        <h2 className="ds-section__title">Botões</h2>
        <p className="ds-section__subtitle">
          Botão genérico reutilizável com 4 tipos visuais, 2 tamanhos,
          suporte a ícone à esquerda e seta à direita.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-32)" }}>
          <div>
            <h3 style={h3Style}>Sem ícone, sem arrow</h3>
            <div style={{ ...containerStyle, display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div>
                <p style={labelStyle}>Primary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="primary" size="40" /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="primary" size="32" /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Secondary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="secondary" size="40" /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="secondary" size="32" /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Flat</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="flat" size="40" /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="flat" size="32" /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={h3Style}>Sem ícone, com arrow</h3>
            <div style={{ ...containerStyle, display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div>
                <p style={labelStyle}>Primary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="primary" size="40" arrow /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="primary" size="32" arrow /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Secondary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="secondary" size="40" arrow /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="secondary" size="32" arrow /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Flat</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="flat" size="40" arrow /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="flat" size="32" arrow /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 style={h3Style}>Com ícone e arrow</h3>
            <div style={{ ...containerStyle, display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div>
                <p style={labelStyle}>Primary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="primary" size="40" icon arrow /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="primary" size="32" icon arrow /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Secondary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="secondary" size="40" icon arrow /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="secondary" size="32" icon arrow /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Flat</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="flat" size="40" icon arrow /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="flat" size="32" icon arrow /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={h3Style}>Com ícone, sem arrow</h3>
            <div style={{ ...containerStyle, display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div>
                <p style={labelStyle}>Primary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="primary" size="40" icon /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="primary" size="32" icon /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Secondary</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="secondary" size="40" icon /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="secondary" size="32" icon /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Flat</p>
                <div style={rowStyle}>
                  <div style={itemStyle}><Button type="flat" size="40" icon /><span style={badgeStyle}>size 40</span></div>
                  <div style={itemStyle}><Button type="flat" size="32" icon /><span style={badgeStyle}>size 32</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="ds-divider" />

      {/* Promo Ativa */}
      <section className="ds-section">
        <h2 className="ds-section__title">Promo Ativa</h2>
        <p className="ds-section__subtitle">
          Botão promocional com gradiente laranja/rosa, seção interna
          com gradiente primary e área de mensagem.
        </p>

        <div style={{ ...containerStyle, display: "flex", gap: "var(--spacing-24)", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={itemStyle}>
            <Button type="promo-ativa" size="40" icon />
            <span style={badgeStyle}>size 40</span>
          </div>
          <div style={itemStyle}>
            <Button type="promo-ativa" size="32" icon />
            <span style={badgeStyle}>size 32</span>
          </div>
        </div>
      </section>
    </>
  );
}

function ComponentsTab() {
  const [activeComponent, setActiveComponent] = useState<ComponentId>("button-odds");

  return (
    <div style={{ display: "flex", gap: "var(--spacing-48)", alignItems: "flex-start" }}>
      <nav style={{
        position: "sticky",
        top: 140,
        width: 200,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid var(--border-02)",
      }}>
        {COMPONENT_LIST.map((comp) => {
          const isActive = activeComponent === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setActiveComponent(comp.id)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                borderLeft: isActive ? "2px solid var(--layer-gradient-01)" : "2px solid transparent",
                marginLeft: -1,
                padding: "var(--spacing-8) var(--spacing-16)",
                fontSize: "var(--font-size-14)",
                fontWeight: isActive ? "var(--font-weight-bold)" : "var(--font-weight-regular)",
                color: isActive ? "var(--text-01)" : "var(--text-02)",
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "color 0.15s",
              }}
            >
              {comp.label}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1, minWidth: 0 }}>
        {activeComponent === "button-odds" && <ButtonOddsContent />}
        {activeComponent === "buttons" && <ButtonsContent />}
      </div>
    </div>
  );
}

/* ==========================================================
   PAGE
   ========================================================== */

export default function DesignSystem() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      {/* Mobile restriction */}
      <div className="ds-only-desktop">
        <div className="ds-only-desktop__container">
          <div className="ds-only-desktop__brand">
            <img src={theme === "dark" ? logoPitacoWhite : logoPitacoBlack} alt="Pitaco" style={{ height: 56 }} />
            <p className="ds-only-desktop__subtitle">Design System</p>
          </div>
          <div className="ds-only-desktop__message">
            <p>Essa página foi feita apenas para ser visualizada apenas na versão desktop.</p>
            <p>Mude a resolução para poder visualizar esse Design System.</p>
          </div>
        </div>
      </div>

      {/* Desktop content */}
      <div className={`ds-sticky-header ds-desktop-only${scrolled ? " ds-sticky-header--scrolled" : ""}`}>
        <div className="ds-sticky-header__inner">
          <header className="ds-sticky-header__logo"
          >
            <div>
              <img src={theme === "dark" ? logoPitacoWhite : logoPitacoBlack} alt="Pitaco" className="ds-sticky-header__logo-img" />
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
        </div>
      </div>

      <div className="ds-page ds-page--with-sticky-header ds-desktop-only">
        {activeTab === "colors" && <ColorsTab />}
        {activeTab === "typography" && <TypographyTab />}
        {activeTab === "spacing" && <SpacingTab />}
        {activeTab === "tokens" && <TokensTab />}
        {activeTab === "components" && <ComponentsTab />}
      </div>
    </>
  );
}
