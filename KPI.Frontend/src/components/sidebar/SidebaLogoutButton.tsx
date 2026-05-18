import "./assets/sidebar_logout_button.scss";

import LogoutIcon from "../icons/LogoutIcon";
import { useNavigate } from "react-router-dom";

export default function SidebarLogoutButton() {
  const navigate = useNavigate();
  return (
    <div className="sidebar_logout_wrapper">
      <button
        className="sidebar_logout_button"
        onClick={() => navigate("/auth")}
      >
        <LogoutIcon />
        <span className="sidebar_logout_button_label">Чиқиш</span>
      </button>
    </div>
  );
}
