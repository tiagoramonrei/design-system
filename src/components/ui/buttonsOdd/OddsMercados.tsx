import { useState } from "react";
import ButtonOnlyOdds from "./ButtonOnlyOdds";
import ButtonOddEscadinha from "./ButtonOddEscadinha";
import "./OddsMercados.css";

export type OddsMercadosType =
  | "1x2"
  | "1x2-tradicional"
  | "duplaChance"
  | "sim/nao"
  | "overUnder"
  | "combinada"
  | "escadinha";

export interface OddsMercadosProps {
  className?: string;
  type?: OddsMercadosType;
  oddValue?: string;
  totalSelections?: number;
  interactive?: boolean;
}

interface MarketOption {
  team: string;
  odd: string;
}

const ChevronDownIcon = () => (
  <svg className="odds-mercados__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.66668 6L8.00001 9.33333L11.3333 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function getOptions(type: OddsMercadosType, oddValue: string): MarketOption[] | null {
  switch (type) {
    case "1x2-tradicional":
      return [
        { team: "Time Casa", odd: oddValue },
        { team: "Empate", odd: oddValue },
        { team: "Time Visitante", odd: oddValue },
      ];
    case "1x2":
      return [
        { team: "Time Casa", odd: oddValue },
        { team: "Time Visitante", odd: oddValue },
      ];
    case "duplaChance":
      return [
        { team: "Casa ou Empate", odd: oddValue },
        { team: "Casa ou Fora", odd: oddValue },
        { team: "Fora ou Empate", odd: oddValue },
      ];
    case "sim/nao":
      return [
        { team: "Sim", odd: oddValue },
        { team: "Não", odd: oddValue },
      ];
    case "overUnder":
      return [
        { team: "Menos de 2.5", odd: oddValue },
        { team: "Mais de 2.5", odd: oddValue },
      ];
    default:
      return null;
  }
}

export default function OddsMercados({
  className,
  type = "1x2-tradicional",
  oddValue = "1.78x",
  totalSelections = 4,
  interactive = false,
}: OddsMercadosProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isComposed = type === "combinada" || type === "escadinha";

  const cls = [
    "odds-mercados",
    isComposed && "odds-mercados--composed",
    type === "combinada" && "odds-mercados--combinada",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (type === "escadinha") {
    const escBg = interactive && selectedIndex === 0 ? "selected" : "color01";
    return (
      <div className={cls}>
        <ButtonOddEscadinha
          bgColor={escBg}
          onClick={interactive ? () => setSelectedIndex(selectedIndex === 0 ? null : 0) : undefined}
        />
      </div>
    );
  }

  if (type === "combinada") {
    const combBg = interactive && selectedIndex === 0 ? "selected" : "color01";
    return (
      <div className={cls}>
        <div className="odds-mercados__ver-todos">
          <span className="odds-mercados__ver-todos-text">
            Ver todos ({totalSelections})
          </span>
          <ChevronDownIcon />
        </div>
        <ButtonOnlyOdds
          bgColor={combBg}
          boost={false}
          oddValue={oddValue}
          onClick={interactive ? () => setSelectedIndex(selectedIndex === 0 ? null : 0) : undefined}
        />
      </div>
    );
  }

  const options = getOptions(type, oddValue);

  const handleClick = (index: number) => {
    if (!interactive) return;
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className={cls}>
      {options?.map((opt, i) => (
        <button
          key={opt.team}
          className={`odds-mercados__btn${interactive && selectedIndex === i ? " odds-mercados__btn--selected" : ""}`}
          onClick={() => handleClick(i)}
        >
          <div className="odds-mercados__numbers">
            <span className="odds-mercados__team">{opt.team}</span>
            <span className="odds-mercados__value">{opt.odd}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
