import "./assets/app_layout.scss";

import { ReactNode, useState } from "react";

interface Props {
  readonly sidebarComponent: ReactNode;
  readonly children: ReactNode;
}

export default function AppLayout({ sidebarComponent, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app_layout_wrapper">
      <div className={`app_layout_sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
        {sidebarComponent}
      </div>

      <div
        className={`sidebar-overlay${sidebarOpen ? " sidebar-overlay--active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-layout_pages">
        <button
          className="sidebar-menu-btn"
          onClick={() => setSidebarOpen((s) => !s)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="app_layout_pages_body">{children}</div>
      </div>
    </div>
  );
}
