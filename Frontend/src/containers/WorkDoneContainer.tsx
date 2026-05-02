import { useParams } from "react-router-dom";
import { DatePicker } from "../components/form/DatePickerField";
import { useWorkDoneContext } from "../api/work-done/WorkDoneApiContext";
import { useEffect, useState } from "react";
import { useIndicatorValueContext } from "../api/indicator-values/IndicatorValueApiContext";
import { useRegionContext } from "../api/regions/RegionApiContext";
import { WorkDoneBaseTable } from "../components/tables/WorkDoneBaseTable";

import moment from "moment";
import TabPage from "../components/tabs/TabPage";
import AppButton from "../components/ui/CustomButton";
import ExcelReader from "../components/work-done/ExcelReader";
import { showToast } from "../components/ui/Toast";

export default function WorkDoneContainer() {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState<Date | null>(
    new Date(2026, 0, 19),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [regions, setRegions] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { tab = "2bf2251b-b58b-4d4a-96b9-451af302b7d4" } = useParams<{
    tab?: string;
  }>();

  const { WorkDoneApi } = useWorkDoneContext();
  const { RegionApi } = useRegionContext();
  const { IndicatorValueApi } = useIndicatorValueContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    WorkDoneApi.getByDirection(tab, dateRange)
      .then((res) => setIndicators(res))
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WorkDoneApi, tab, startDate, endDate]);

  useEffect(() => {
    RegionApi.getAll()
      .then((res) => setRegions(res))
      .catch(console.log);
  }, [RegionApi]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await WorkDoneApi.exportExcel(tab, dateRange);
      showToast("Excel muvaffaqiyatli yuklandi", "success");
    } catch {
      showToast("Excel yuklab olishda xatolik", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <TabPage
        headerCompoonent={
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <AppButton
                variant="secondary"
                label={`"Excel" дан юклаш`}
                className="px-4"
                onClick={() => setIsExcelOpen(true)}
              />
              <AppButton
                variant="secondary"
                label={isExporting ? "Yuklanmoqda..." : `"Excel" га юклаш`}
                className="px-4"
                onClick={handleExport}
                disabled={isExporting}
              />
            </div>
            <div className="d-flex gap-2">
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
        <WorkDoneBaseTable
          directions={indicators}
          tableData={regions}
          onCellChange={(indicator_id, region_id, score, value) => {
            const json: any = {
              indicator_id,
              direction_id: tab,
              region_id,
              score,
              value: value || 0,
              date: today,
            };

            IndicatorValueApi.create(json)
              .then(() => {
                const next = [...indicators];
                const iIdx = next.findIndex(
                  (i) => i.indicator_id === indicator_id,
                );
                if (iIdx === -1) return;
                const rIdx = next[iIdx].regions.findIndex(
                  (r: any) => r.region_id === region_id,
                );
                if (rIdx === -1) return;
                next[iIdx].regions[rIdx].value = value;
                setIndicators(next);
              })
              .catch(console.log);
          }}
        />
      </TabPage>

      {isExcelOpen && (
        <ExcelReader
          onClose={() => setIsExcelOpen(false)}
          onSaved={() => {
            WorkDoneApi.getByDirection(tab, dateRange)
              .then((res) => setIndicators(res))
              .catch(console.log);
          }}
        />
      )}
    </>
  );
}
