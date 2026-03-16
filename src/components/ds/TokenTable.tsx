import { type CSSProperties } from "react";

export interface TokenRow {
  token: string;
  role: string;
  lightValue: string;
  darkValue: string;
}

interface TokenTableProps {
  title: string;
  tokens: TokenRow[];
  scaleMap?: Record<string, string>;
}

function Preview({ color }: { color: string }) {
  const isGradient = color.includes("→");
  if (isGradient) {
    const [c1, c2] = color.split("→").map((s) => s.trim());
    return (
      <div
        style={{
          ...styles.preview,
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
        }}
      />
    );
  }
  return <div style={{ ...styles.preview, backgroundColor: color }} />;
}

function ValueCell({
  value,
  scaleMap,
}: {
  value: string;
  scaleMap?: Record<string, string>;
}) {
  const ref = scaleMap?.[value.toUpperCase()] ?? null;
  return (
    <div style={styles.valueCol}>
      <span style={styles.valueHex}>{value}</span>
      {ref && <span style={styles.valueRef}>{ref}</span>}
    </div>
  );
}

export default function TokenTable({ title, tokens, scaleMap }: TokenTableProps) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.table}>
        <div style={styles.headerRow}>
          <span style={{ ...styles.cell, ...styles.headerCell, flex: 1 }}>
            Token
          </span>
          <span
            style={{
              ...styles.cell,
              ...styles.headerCell,
              width: 198,
              flexShrink: 0,
            }}
          >
            Light
          </span>
          <span
            style={{
              ...styles.cell,
              ...styles.headerCell,
              width: 198,
              flexShrink: 0,
            }}
          >
            Dark
          </span>
        </div>

        {tokens.map((t) => (
          <div key={t.token} style={styles.row}>
            <div style={{ ...styles.cell, flex: 1, flexDirection: "column", alignItems: "flex-start", gap: "var(--spacing-2)" }}>
              <code style={styles.tokenCode}>{t.token}</code>
              <span style={styles.roleText}>{t.role}</span>
            </div>
            <div
              style={{
                ...styles.cell,
                width: 48,
                flexShrink: 0,
                justifyContent: "center",
                paddingRight: 0,
              }}
            >
              <Preview color={t.lightValue} />
            </div>
            <div style={{ ...styles.cell, width: 150, flexShrink: 0, paddingLeft: "var(--spacing-8)" }}>
              <ValueCell value={t.lightValue} scaleMap={scaleMap} />
            </div>
            <div
              style={{
                ...styles.cell,
                width: 48,
                flexShrink: 0,
                justifyContent: "center",
                paddingRight: 0,
              }}
            >
              <Preview color={t.darkValue} />
            </div>
            <div style={{ ...styles.cell, width: 150, flexShrink: 0, paddingLeft: "var(--spacing-8)" }}>
              <ValueCell value={t.darkValue} scaleMap={scaleMap} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    marginBottom: "var(--spacing-56)",
    overflowX: "auto",
  },
  title: {
    fontSize: "var(--font-size-24)",
    fontWeight: "var(--font-weight-bold)",
    marginBottom: "var(--spacing-16)",
    color: "var(--text-01)",
  },
  table: {
    border: "1px solid var(--background-border)",
    borderRadius: "var(--spacing-12)",
    overflow: "hidden",
    minWidth: 640,
  },
  headerRow: {
    display: "flex",
    borderBottom: "1px solid var(--background-border)",
    background: "var(--layer-02)",
  },
  headerCell: {
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--font-size-14)",
    textTransform: "uppercase" as const,
    color: "var(--text-02)",
  },
  row: {
    display: "flex",
    borderBottom: "1px solid var(--background-border)",
    transition: "background 0.15s",
  },
  cell: {
    display: "flex",
    alignItems: "center",
    padding: "var(--spacing-16)",
    fontSize: "var(--font-size-14)",
    minWidth: 0,
  },
  tokenCode: {
    fontSize: "var(--font-size-14)",
    fontFamily: "var(--mono-font)",
    whiteSpace: "nowrap" as const,
    color: "var(--text-01)",
    fontWeight: "var(--font-weight-bold)",
  },
  roleText: {
    fontSize: "var(--font-size-12)",
    color: "var(--text-02)",
    lineHeight: "var(--line-height-normal)",
  },
  valueCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-2)",
  },
  valueHex: {
    fontFamily: "var(--mono-font)",
    fontSize: "var(--font-size-14)",
    color: "var(--text-01)",
  },
  valueRef: {
    fontFamily: "var(--mono-font)",
    fontSize: "var(--font-size-10)",
    color: "var(--text-02)",
    opacity: 0.7,
    whiteSpace: "nowrap" as const,
  },
  preview: {
    width: 32,
    height: 32,
    borderRadius: "var(--spacing-8)",
    border: "1px solid rgba(128,128,128,0.2)",
    flexShrink: 0,
  },
};
