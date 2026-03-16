import { type CSSProperties } from "react";

interface ColorStep {
  step: string;
  hex: string;
  cssVar?: string;
}

interface ColorScaleProps {
  name: string;
  steps: ColorStep[];
}

function contrastText(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#000000" : "#FFFFFF";
}

export default function ColorScale({ name, steps }: ColorScaleProps) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{name}</span>
      <div style={styles.swatches}>
        {steps.map((s) => (
          <div key={s.step} style={styles.swatchCol}>
            <div
              style={{
                ...styles.swatch,
                backgroundColor: s.hex,
                color: contrastText(s.hex),
              }}
            >
              <span style={styles.stepNum}>{s.step}</span>
            </div>
            <span style={styles.hex}>{s.hex}</span>
            {s.cssVar && <span style={styles.varName}>{s.cssVar}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--spacing-20)",
    marginBottom: "var(--spacing-32)",
  },
  label: {
    width: 100,
    flexShrink: 0,
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--font-size-16)",
    paddingTop: "var(--spacing-16)",
    color: "var(--text-01)",
  },
  swatches: {
    display: "flex",
    gap: "var(--spacing-8)",
    flexWrap: "nowrap",
    overflowX: "auto",
    paddingBottom: "var(--spacing-8)",
  },
  swatchCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--spacing-4)",
    flexShrink: 0,
  },
  swatch: {
    width: 80,
    height: 56,
    borderRadius: "var(--spacing-12)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: "var(--spacing-8)",
    border: "1px solid color-mix(in srgb, var(--lightdark-600) 16%, transparent)",
  },
  stepNum: {
    fontSize: "var(--font-size-12)",
    fontWeight: "var(--font-weight-bold)",
    opacity: 0.85,
  },
  hex: {
    fontSize: "var(--font-size-10)",
    fontFamily: "var(--mono-font)",
    color: "var(--text-02)",
  },
  varName: {
    fontSize: "var(--font-size-10)",
    fontFamily: "var(--mono-font)",
    color: "var(--text-02)",
    opacity: 0.6,
  },
};
