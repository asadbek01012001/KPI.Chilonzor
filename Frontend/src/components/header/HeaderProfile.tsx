import "./assets/header_profile.scss";

import ProfileIcon from "../icons/ProfileIcon";
import HeaderButton from "./HeaderButton";

export default function HeaderProfile() {
  return (
    <div className="header_profile_warpper">
      <HeaderButton>
        <ProfileIcon />
      </HeaderButton>
      <div className="header_profile_info">
        <span className="header_profile_full_name">
          Идоралараро тезкор штаб
        </span>
        {/* <span className="header_profile_minitary_rank">Mayor</span> */}
      </div>
    </div>
  );
}
