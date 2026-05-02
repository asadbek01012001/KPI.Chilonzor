import "./assets/header_button.scss";

import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly bg_color?: string;
  readonly onClick?: () => void;
}

export default function HeaderButton({ children, bg_color, onClick }: Props) {
  return (
    <button
      className="header_button"
      style={{
        backgroundColor: bg_color,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
