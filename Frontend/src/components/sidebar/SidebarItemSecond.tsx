import "./assets/sidebar_item_second.scss";
import { useNavigate } from "react-router-dom";

interface Props {
  readonly children?: React.ReactNode;
  readonly tab?: string | number;
  readonly activeTab?: string | number;
}

export default function SidebarItemSecond({ children, tab, activeTab }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className={`sidebar_item_second ${tab === activeTab ? "active" : ""}`}
      onClick={() => navigate(`/dashboard/work_done/${tab}`)}
    >
      <div className="sidebar_item_secund_custom_circle">
        <div className="custom_circle" />
      </div>
      <span>{children}</span>
    </div>
  );
}
