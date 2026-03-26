import "./ButtonOddDefault.css";

export type ButtonOddDefaultBgColor = "color01" | "color02" | "selected";

export interface ButtonOddDefaultProps {
  className?: string;
  bgColor?: ButtonOddDefaultBgColor;
  teamName?: string;
  oddValue?: string;
  onClick?: () => void;
}

export default function ButtonOddDefault({
  className,
  bgColor = "color01",
  teamName = "Real Madrid",
  oddValue = "1.78x",
  onClick,
}: ButtonOddDefaultProps) {
  const cls = [
    "button-odd-default",
    bgColor === "color02" && "button-odd-default--color02",
    bgColor === "selected" && "button-odd-default--selected",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} onClick={onClick}>
      <div className="button-odd-default__numbers">
        <span className="button-odd-default__team">{teamName}</span>
        <span className="button-odd-default__value">{oddValue}</span>
      </div>
    </button>
  );
}
