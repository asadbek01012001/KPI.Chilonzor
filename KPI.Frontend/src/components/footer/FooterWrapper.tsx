import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function FooterWrapper({ children }: Props) {
  return <div>{children}</div>;
}
