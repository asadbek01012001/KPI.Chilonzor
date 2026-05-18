import "./assets/sidebar_item.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { getAppSection } from "../../utils/getAppSection";
import { ReactNode, useMemo } from "react";

import cx from "classnames";

interface Props {
  readonly children?: ReactNode;
  readonly icon?: ReactNode;
  readonly link: string;
  readonly title?: string;
  readonly activeLinks?: string[];
}

export default function SidebarItem({ icon, children, link, title, activeLinks }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeLink = useMemo(
    () => getAppSection(location.pathname),
    [location.pathname],
  );

  const isActive =
    activeLink === link ||
    (activeLinks ? activeLinks.includes(activeLink) : false);

  return (
    <div className="sidebar_item_wrapper">
      <div
        className={cx("sidebar_item", {
          sidebar_item__active: isActive,
        })}
        onClick={() => navigate(link)}
      >
        {Boolean(icon) && <div className="sidebar_item_icon">{icon}</div>}
        <div className="sidebar _item_title">{title}</div>
      </div>
      {Boolean(children && isActive) && (
        <div className="sidebar_item_children">{children}</div>
      )}
    </div>
  );
}
