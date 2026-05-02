import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function TabLayout({ children }: Props) {
  return <div className="tab_layout h-100">{children}</div>;
}
