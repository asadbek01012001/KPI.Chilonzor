import React, { SelectHTMLAttributes, ReactNode } from "react";
import ChevronDown from "../icons/ChevronDown";
import "./assets/select.scss";

interface Option {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    icon?: ReactNode;
    options: Option[];
    containerClass?: string;
    width?: string;
    error?: string;
    placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    icon,
    options,
    containerClass = "",
    width,
    error,
    placeholder,
    value,
    onChange,
    disabled,
    ...props
}) => {
    const hasIconClass = icon ? "uz-custom-select-group--has-icon" : "";
    const hasErrorClass = error ? "uz-custom-select-group--error" : "";
    const isDisabledClass = disabled ? "uz-custom-select-group--disabled" : "";

    return (
        <div
            className={`uz-custom-select-group ${hasIconClass} ${hasErrorClass} ${isDisabledClass} ${containerClass}`}
            style={{
                width: width ? `${width}px` : "100%",
            }}
        >
            {label && (
                <label className="uz-custom-select-group__label">
                    {label}
                </label>
            )}

            <div className="uz-custom-select-group__wrapper">
                <select
                    className="uz-custom-select-group__field"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="uz-custom-select-group__icons">
                    {icon && (
                        <span className="uz-custom-select-group__icon-left">{icon}</span>
                    )}
                    <ChevronDown className="uz-custom-select-group__arrow" />
                </div>
            </div>

            {error && (
                <span className="uz-custom-select-group__error">{error}</span>
            )}
        </div>
    );
};