import { ReactNode } from "react";
import "./assets/dashboard_map_layout.scss";

interface Props {
  readonly children: ReactNode;
  readonly headerComponent?: ReactNode;
  readonly sidebarComponent: ReactNode;
}

export default function DashboardMapLayout({
  children,
  headerComponent,
  sidebarComponent,
}: Props) {
  return (
    <div className="dashboard_map_layout">
      {headerComponent && (
        <div className="dashboard_map_header">{headerComponent}</div>
      )}
      <div className="dashboard_map_content">
        <div className="dashboard_map_body">{children}</div>
        <div className="dashboard_map_sidebar mt-4">{sidebarComponent}</div>
      </div>
    </div>
  );
}
