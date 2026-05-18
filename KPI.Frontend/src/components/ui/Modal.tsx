import React, { ReactNode } from "react";
import "./assets/modal.scss";

export const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface Props {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="eup-overlay" onClick={onClose}>
      <div className="eup-modal" onClick={(e) => e.stopPropagation()}>
        {title !== undefined && title !== "" && (
          <div className="eup-header">
            <h2 className="eup-title">{title}</h2>
            <button className="eup-close" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="eup-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
export { Modal };
