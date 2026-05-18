import "./assets/header.scss";

import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function HeaderWrapper({ children }: Props) {
  return <div className="header_wrapper">{children}</div>;
}
