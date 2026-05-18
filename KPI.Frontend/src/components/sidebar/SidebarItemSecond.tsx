import "./assets/sidebar_item_second.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getAppSection } from "../../utils/getAppSection";

interface Props {
  readonly children?: React.ReactNode;
  readonly tab?: string | number;
  readonly activeTab?: string | number;
  readonly link?: string;
}

export default function SidebarItemSecond({ children, tab, activeTab, link }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = link
    ? getAppSection(location.pathname) === link
    : tab === activeTab;

  const handleClick = () => {
    if (link) {
      navigate(link);
    } else {
      navigate(`/dashboard/work_done/${tab}`);
    }
  };

  return (
    <div
      className={`sidebar_item_second ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <div className="sidebar_item_secund_custom_circle">
        <div className="custom_circle" />
      </div>
      <span>{children}</span>
    </div>
  );
}
