import { ReactNode } from "react";

import "./assets/sidebar_wrapper.scss";
import SidebarLogoutButton from "./SidebaLogoutButton";
import LanguageThemeSwitcher from "../ui/LanguageThemeSwitcher";

interface Props {
  readonly children: ReactNode;
}

export default function SidebarWrapper({ children }: Props) {
  return (
    <div className="sidebar_wrapper">
      <div className="sidebar_wrapper_header">
        <img
          src={require("./assets/images/logo.png")}
          alt="Logo"
          className="mt-3"
          width="70%"
        />
      </div>
      <div className="sidebar_wrapper_body">{children}</div>
      <div className="sidebar_wrapper_footer">
        <LanguageThemeSwitcher />
        <SidebarLogoutButton />
      </div>
    </div>
  );
}
