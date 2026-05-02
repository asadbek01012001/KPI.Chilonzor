import "./assets/indicators_tab_layout.scss";

import { useNavigate, useParams } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly directions: any[];
}

export default function IndicatorsTabLayout({ children, directions }: Props) {
  const { tab = "2bf2251b-b58b-4d4a-96b9-451af302b7d4" } = useParams();
  const navigate = useNavigate();
  return (
    <div className="indicators_tab_layout">
      <div className="indicators_tab_sidebar">
        <div className="indicators_tab_sidebar_content">
          {directions &&
            directions.map((item: any) => {
              return (
                <div
                  className={`d-flex align-items-center gap-2 py-3 px-3 my-1 indicators_tab_sidebar_item ${tab === item.id ? "active_sidebar_item" : ""}`}
                  onClick={() => navigate(`/dashboard/indicators/${item.id}`)}
                >
                  <div>
                    <div className="indicators_sidebar_item_circle" />
                  </div>
                  <span className="indicators_sidebar_item_title">
                    {item.name}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
      <div className="indicators_tab_body">
        <div className="indicators_tab_body_content">{children}</div>
      </div>
    </div>
  );
}
