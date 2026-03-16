export interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid var(--background-border)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              borderBottom: "2px solid transparent",
              outline: "none",
              cursor: "pointer",
              padding: "var(--spacing-12) var(--spacing-24)",
              fontSize: "var(--font-size-16)",
              fontFamily: "inherit",
              fontWeight: isActive ? "var(--font-weight-bold)" : "var(--font-weight-medium)",
              color: isActive ? "var(--text-01)" : "var(--text-02)",
              marginBottom: -1,
              transition: "color 0.15s",
            }}
          >
            {tab.label}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: "var(--spacing-24)",
                  right: "var(--spacing-24)",
                  height: 2,
                  background: "linear-gradient(to right, var(--border-gradient-01), var(--border-gradient-02))",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
