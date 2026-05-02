import React, { ReactNode } from "react";
import "./assets/input.scss";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  containerClass?: string;
  readonly width?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  containerClass = "",
  width,
  ...props
}) => {
  const hasIconClass = icon ? "uz-custom-input-group--has-icon" : "";

  return (
    <div
      className={`uz-custom-input-group ${hasIconClass} ${containerClass}`}
      style={{
        width: `${width}px`,
      }}
    >
      {label && <label className="uz-custom-input-group__label">{label}</label>}
      <div className="uz-custom-input-group__wrapper">
        <input className="uz-custom-input-group__field" {...props} />
        {icon && (
          <span className="uz-custom-input-group__icon-right">{icon}</span>
        )}
      </div>
    </div>
  );
};
