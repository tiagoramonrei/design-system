import { type CSSProperties } from "react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      style={{
        ...styles.button,
        background: isDark ? "var(--lightdark-700)" : "var(--lightdark-50)",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        style={{
          ...styles.thumb,
          transform: isDark ? "translateX(var(--spacing-24))" : "translateX(0)",
          background: isDark ? "var(--lightdark-0)" : "var(--lightdark-900)",
        }}
      />
      <span style={{ ...styles.icon, left: "var(--spacing-8)", opacity: isDark ? 0.4 : 1 }}>
        &#9728;
      </span>
      <span style={{ ...styles.icon, right: "var(--spacing-8)", opacity: isDark ? 1 : 0.4 }}>
        &#9789;
      </span>
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  button: {
    position: "relative",
    width: 56,
    height: 32,
    borderRadius: "var(--spacing-16)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.25s",
    flexShrink: 0,
  },
  thumb: {
    position: "absolute",
    top: "var(--spacing-4)",
    left: "var(--spacing-4)",
    width: 24,
    height: 24,
    borderRadius: "var(--spacing-12)",
    transition: "transform 0.25s, background 0.25s",
  },
  icon: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "var(--font-size-14)",
    transition: "opacity 0.25s",
    pointerEvents: "none",
  },
};
