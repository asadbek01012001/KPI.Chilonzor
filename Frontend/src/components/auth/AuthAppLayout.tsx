import "./assets/auth_app_layout.scss";

import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function AuthAppLayout({ children }: Props) {
  return (
    <div className="auth_app_layout">
      <div className="auth_app_layout_body">{children}</div>
    </div>
  );
}
