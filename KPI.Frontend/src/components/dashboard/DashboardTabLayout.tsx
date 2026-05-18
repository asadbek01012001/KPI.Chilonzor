import { ReactNode } from "react";

import cx from "classnames";

import "./assets/dashboard_tab_layout.scss";

interface Props {
  readonly children: ReactNode;
  readonly headerComponent: ReactNode;
  readonly contentClassName?: string;
}

export default function DashboardTabLayout({
  children,
  headerComponent,
  contentClassName,
}: Props) {
  return (
    <div className="dashboard_tab_layout p-2">
      <div className="dashboard_tab_header">{headerComponent}</div>
      <div className={cx("dashboard_tab_body", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
