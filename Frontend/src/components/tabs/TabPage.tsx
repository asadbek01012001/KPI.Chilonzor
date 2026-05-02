import { ReactNode } from "react";
import "./assets/tab_page.scss";

import cx from "classnames";

interface Props {
  readonly headerCompoonent?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly headerClassName?: string;
}

export default function TabPage({
  headerClassName,
  headerCompoonent,
  className,
  children,
}: Props) {
  return (
    <div className={cx("tab_page_warpper", className)}>
      <div className={cx("tab_page_header", headerClassName)}>
        {headerCompoonent}
      </div>
      <div className={cx("tab_page_body", className)}>{children}</div>
    </div>
  );
}
