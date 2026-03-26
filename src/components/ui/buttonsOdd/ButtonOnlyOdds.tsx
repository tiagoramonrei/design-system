import "./ButtonOnlyOdds.css";

export type ButtonOnlyOddsBgColor = "color01" | "color02" | "selected";

export interface ButtonOnlyOddsProps {
  className?: string;
  bgColor?: ButtonOnlyOddsBgColor;
  boost?: boolean;
  previousOddValue?: string;
  oddValue?: string;
  onClick?: () => void;
}

const ArrowFowardIcon = () => (
  <svg className="button-only-odds__icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6.75 8L8.75 6L6.75 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.25 8.5L5.75 6L3.25 3.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ButtonOnlyOdds({
  className,
  bgColor = "color01",
  boost = true,
  previousOddValue = "3.87x",
  oddValue = "4.50x",
  onClick,
}: ButtonOnlyOddsProps) {
  const cls = [
    "button-only-odds",
    bgColor === "color02" && "button-only-odds--color02",
    bgColor === "selected" && "button-only-odds--selected",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const boostCls = [
    "button-only-odds__boost",
    boost && "button-only-odds__boost--active",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} onClick={onClick}>
      <div className="button-only-odds__numbers">
        <div className={boostCls}>
          {boost ? (
            <>
              <span className="button-only-odds__old-value">{previousOddValue}</span>
              <ArrowFowardIcon />
              <span className="button-only-odds__value">{oddValue}</span>
            </>
          ) : (
            <span className="button-only-odds__value">{oddValue}</span>
          )}
        </div>
      </div>
    </button>
  );
}
