import { useState, useCallback } from "react";
import { DatePicker } from "../components/form/DatePickerField";
import Emergency102TableWrapper from "../components/emergency102/Emergency102TableWrapper";
import Emergency102ExcelReader from "../components/emergency102/Emergency102ExcelReader";

import TabPage from "../components/tabs/TabPage";
import AppButton from "../components/ui/CustomButton";

export default function Emergency102Container() {
  const startDayFilter = new Date(2026, 0, 19);
  const todayForFilter = new Date();

  const [startDate, setStartDate] = useState<Date | null>(startDayFilter);
  const [endDate, setEndDate] = useState<Date | null>(todayForFilter);
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <TabPage
        headerCompoonent={
          <div className="d-flex justify-content-between align-items-center">
            <AppButton
              variant="secondary"
              label={`"Excel" дан юклаш`}
              className="px-4"
              onClick={() => setIsExcelOpen(true)}
            />
            <div className="d-flex gap-2">
              <DatePicker placeholder="Бошланғич сана" value={startDate} onChange={(date) => setStartDate(date)} />
              <DatePicker placeholder="Охирги сана" value={endDate} onChange={(date) => setEndDate(date)} />
            </div>
          </div>
        }
      >
        <Emergency102TableWrapper key={refreshKey} startDate={startDate} endDate={endDate} />
      </TabPage>

      {isExcelOpen && (
        <Emergency102ExcelReader
          onClose={() => setIsExcelOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
