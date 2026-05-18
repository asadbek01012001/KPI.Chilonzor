import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import AppContainer from "./AppContainer";
import UsersContainer from "./UsersContainer";
import AuthContainer from "./AuthContainer";
import ReportsContainer from "./ReportsContainer";
import DashboardContainer from "./DashboardContainer";
import CrimesContainer from "./CrimesContainer";
import Emergency102Container from "./Emergency102Container";
import IndicatorsContainer from "./IndicatorsContainer";
import WorkDoneContainer from "./WorkDoneContainer";

export default function RootContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/auth");
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthContainer />} />
      <Route path="/dashboard" element={<AppContainer />}>
        <Route path="statistics/:tab?" element={<DashboardContainer />} />
        <Route path="reports" element={<ReportsContainer />} />
        <Route path="crimes" element={<CrimesContainer />} />
        <Route path="emergency102" element={<Emergency102Container />} />
        <Route path="indicators/:tab?" element={<IndicatorsContainer />} />
        <Route path="work_done/:tab?" element={<WorkDoneContainer />} />
        <Route path="users" element={<UsersContainer />} />
      </Route>
    </Routes>
  );
}
