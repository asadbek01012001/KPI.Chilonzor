import "./assets/button_control.scss";

import { ReactNode } from "react";

import cx from "classnames";

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function Button({ children, className }: Props) {
  return <button className={cx("custom_button", className)}>{children}</button>;
}
