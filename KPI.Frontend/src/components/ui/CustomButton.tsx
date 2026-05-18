import React, { ReactNode } from "react";
import "./assets/custom_button.scss";

interface AppButtonProps {
  variant: "primary" | "secondary";
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  variant,
  label,
  icon,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`app-btn app-btn--${variant} ${className}`}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{label}</span>
    </button>
  );
};

export default AppButton;
