import "./assets/app_layout.scss";

import { ReactNode } from "react";

interface Props {
  readonly sidebarComponent: ReactNode;
  readonly headerComponent: ReactNode;
  readonly children: ReactNode;
}

export default function AppLayout({
  sidebarComponent,
  headerComponent,
  children,
}: Props) {
  return (
    <div className="app_layout_wrapper">
      <div className="app_layout_sidebar">{sidebarComponent}</div>
      <div className="app-layout_pages">
        <div className="app_layout_pages_header">{headerComponent}</div>
        <div className="app_layout_pages_body">{children}</div>
      </div>
    </div>
  );
}
