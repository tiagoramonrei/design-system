import "./ButtonOddEscadinha.css";

export type ButtonOddEscadinhaBgColor = "color01" | "color02" | "selected";

export interface ButtonOddEscadinhaProps {
  className?: string;
  bgColor?: ButtonOddEscadinhaBgColor;
  oddLabel?: string;
  onClick?: () => void;
}

export default function ButtonOddEscadinha({
  className,
  bgColor = "color01",
  oddLabel = "Até 2.88x",
  onClick,
}: ButtonOddEscadinhaProps) {
  const label = bgColor === "selected" ? "Adicionado" : "Adicionar";

  const cls = [
    "button-odd-escadinha",
    bgColor === "color02" && "button-odd-escadinha--color02",
    bgColor === "selected" && "button-odd-escadinha--selected",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} onClick={onClick}>
      <div className="button-odd-escadinha__txt">
        <span>{label}</span>
        <span>{oddLabel}</span>
      </div>
    </button>
  );
}
