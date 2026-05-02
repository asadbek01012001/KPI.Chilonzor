import { useCallback, useState } from "react";
import { DatePicker } from "../form/DatePickerField";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTabLayout from "./DashboardTabLayout";
import AppButton from "../ui/CustomButton";
import DashboardRegionsTab from "./DashboardRegionsTab";
import DashboardOrgansTab from "./DashboardOrgansTab";
import DashboardDirectionsTab from "./DashboardDirectionsTab";
import Dashboard102Tab from "./Dashboard102Tab";
import DashboardCrimesTab from "./DashboardCrimesTab";

export default function DashboardTab() {
  const startDayFilter = new Date(2026, 0, 19);
  const todayForFilter = new Date();

  const [startDate, setStartDate] = useState<Date | null>(startDayFilter);
  const [endDate, setEndDate] = useState<Date | null>(todayForFilter);

  const navigate = useNavigate();

  const { tab = "regions" } = useParams();

  const activeTabButton = useCallback(
    (_tab: string) => {
      return _tab === tab ? "primary" : "secondary";
    },
    [tab],
  );

  return (
    <DashboardTabLayout
      contentClassName={`${tab === "organs" ? "overflow-y-auto" : ""}`}
      headerComponent={
        <div className="d-flex gap-2 justify-content-between">
          <div className="d-flex align-items-center">
            <AppButton
              variant={activeTabButton("regions")}
              label="Маҳаллалар"
              className="px-5 app-btn__first"
              onClick={() => navigate("/dashboard/statistics/regions")}
            />
            <AppButton
              variant={activeTabButton("organs")}
              label="ИИБ"
              className="px-5 app-btn__middle"
              onClick={() => navigate("/dashboard/statistics/organs")}
            />
            <AppButton
              variant={activeTabButton("directions")}
              label="Йўналишлар"
              className="px-5 app-btn__middle"
              onClick={() => navigate("/dashboard/statistics/directions")}
            />
            <AppButton
              variant={activeTabButton("102")}
              label="102"
              className="px-5 app-btn__middle"
              onClick={() => navigate("/dashboard/statistics/102")}
            />
            <AppButton
              variant={activeTabButton("crimes")}
              label="Жиноятлар"
              className="px-5 app-btn__last"
              onClick={() => navigate("/dashboard/statistics/crimes")}
            />
          </div>
          <div className="d-flex gap-2 align-items-center">
            <DatePicker
              placeholder="Бошланғич сана"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              placeholder="Охирги сана"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </div>
      }
    >
      {Boolean(tab === "regions") && (
        <DashboardRegionsTab startDate={startDate} endDate={endDate} />
      )}
      {Boolean(tab === "organs") && (
        <DashboardOrgansTab startDate={startDate} endDate={endDate} />
      )}
      {Boolean(tab === "directions") && (
        <DashboardDirectionsTab startDate={startDate} endDate={endDate} />
      )}
      {Boolean(tab === "crimes") && (
        <DashboardCrimesTab startDate={startDate} endDate={endDate} />
      )}
      {Boolean(tab === "102") && (
        <Dashboard102Tab startDate={startDate} endDate={endDate} />
      )}
    </DashboardTabLayout>
  );
}
