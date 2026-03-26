import type { ReactNode } from "react";
import "./Button.css";

export type ButtonType = "primary" | "secondary" | "flat" | "promo-ativa";
export type ButtonSize = "40" | "32";

export interface ButtonProps {
  className?: string;
  type?: ButtonType;
  size?: ButtonSize;
  arrow?: boolean;
  icon?: boolean;
  iconEsquerda?: ReactNode;
  iconDireita?: ReactNode;
  label?: string;
  promoLabel?: string;
  promoValue?: string;
  onClick?: () => void;
}

const ArrowIcon = () => (
  <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.66668 6L8.00001 9.33333L11.3333 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DefaultIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
  </svg>
);

export default function Button({
  className,
  type = "primary",
  size = "40",
  arrow = false,
  icon = false,
  iconEsquerda,
  iconDireita,
  label = "Label",
  promoLabel = "Progresso",
  promoValue = "R$0 de R$100",
  onClick,
}: ButtonProps) {
  const cls = [
    "btn",
    `btn--${type}`,
    `btn--${size}`,
    arrow && "btn--has-arrow",
    icon && "btn--has-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (type === "promo-ativa") {
    return (
      <button className={cls} onClick={onClick}>
        <div className="btn__promo-inner">
          {icon && (
            <span className="btn__icon">
              {iconEsquerda ?? <DefaultIcon />}
            </span>
          )}
          <span>{label}</span>
        </div>
        <div className="btn__promo-msg">
          <span className="btn__promo-msg-label">{promoLabel}</span>
          <span className="btn__promo-msg-value">{promoValue}</span>
        </div>
      </button>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {icon && (
        <span className="btn__icon">
          {iconEsquerda ?? <DefaultIcon />}
        </span>
      )}
      <span>{label}</span>
      {arrow && (
        <span className="btn__icon">
          {iconDireita ?? <ArrowIcon />}
        </span>
      )}
    </button>
  );
}
