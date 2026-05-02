import "./assets/header_actions.scss";
import "./assets/header_actions_spacer.scss";


import { useState } from "react";

import MoonIcon from "../icons/MoonIcon";
import SunIcon from "../icons/SunIcon";
import HeaderInput from "./HeaderInput";
import HeaderButton from "./HeaderButton";
import HeaderSelectLanguage from "./HeaderSelectLanguage";
import HeaderNotification from "./HeaderNotification";
import HeaderSort from "./HeaderSorting";

export default function HeaderActions() {
  const [themeType, setThemeType] = useState<"dark" | "moon">("dark");

  return (
    <div className="header_actions_wrapper">
      <HeaderInput />
      <HeaderButton
        bg_color={themeType === "dark" ? "#2473BD" : "#322B3D"}
        onClick={() => setThemeType("dark")}
      >
        <SunIcon color={themeType === "moon" ? "#2473BD" : "#fff"} />
      </HeaderButton>
      <HeaderButton
        bg_color={themeType === "moon" ? "#2473BD" : "#322B3D"}
        onClick={() => setThemeType("moon")}
      >
        <MoonIcon color={themeType === "dark" ? "#2473BD" : "#fff"} />
      </HeaderButton>
      <HeaderSelectLanguage />
      <HeaderNotification />

      <div className="header_actions_spacer"></div>

      <HeaderSort />
    </div>
  );
}
