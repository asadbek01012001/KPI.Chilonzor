import React, { useRef, useEffect, TextareaHTMLAttributes } from "react";
import "./assets/textarea.scss";

interface AutoResizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClass?: string;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  label,
  containerClass = "",
  value,
  onChange,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Avval balandlikni nolga tushiramiz (scrollHeight'ni aniq hisoblash uchun)
      textarea.style.height = "auto";
      // Keyin ichidagi kontentga qarab yangi balandlik beramiz
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Qiymat o'zgarganda balandlikni yangilash
  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className={`uz-custom-textarea-group ${containerClass}`}>
      {label && (
        <label className="uz-custom-textarea-group__label">{label}</label>
      )}
      <textarea
        ref={textareaRef}
        className="uz-custom-textarea-group__field"
        rows={1} // Eng kamida 1 qator
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e);
          adjustHeight();
        }}
        {...props}
      />
    </div>
  );
};
