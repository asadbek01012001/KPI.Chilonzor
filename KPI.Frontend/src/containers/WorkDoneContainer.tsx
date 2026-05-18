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
import Loading from "../components/ui/Loading";
import { showToast } from "../components/ui/Toast";
import { useTranslation } from "react-i18next";

export default function WorkDoneContainer() {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate,   setEndDate]   = useState<Date | null>(new Date());
  const [mode, setMode]           = useState<"oneDay" | "timePeriod">("timePeriod");

  const [regions,    setRegions]    = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [isExcelOpen,  setIsExcelOpen]  = useState(false);
  const [isExporting,  setIsExporting]  = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const { tab = "2bf2251b-b58b-4d4a-96b9-451af302b7d4" } = useParams<{ tab?: string }>();

  const { WorkDoneApi }       = useWorkDoneContext();
  const { RegionApi }         = useRegionContext();
  const { IndicatorValueApi } = useIndicatorValueContext();

  const fromDate = moment(startDate).format("YYYY-MM-DD");
  const toDate   = mode === "oneDay"
    ? fromDate
    : moment(endDate).format("YYYY-MM-DD");

  const fetchTable = () => {
    setLoadingTable(true);
    WorkDoneApi.getByDirection(tab, { from: fromDate, to: toDate })
      .then((res) => setIndicators(res))
      .catch(console.log)
      .finally(() => setLoadingTable(false));
  };

  useEffect(() => {
    fetchTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WorkDoneApi, tab, startDate, endDate, mode]);

  useEffect(() => {
    RegionApi.getAll()
      .then((res) => setRegions(res))
      .catch(console.log);
  }, [RegionApi]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await WorkDoneApi.exportExcel(tab, { from: fromDate, to: toDate });
      showToast("Excel muvaffaqiyatli yuklandi", "success");
    } catch {
      showToast("Excel yuklab olishda xatolik", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("reports.delete") + "?")) {
      try {
        await IndicatorValueApi.removeByDate(fromDate);
        showToast("Ma'lumotlar muvaffaqiyatli o'chirildi", "success");
        fetchTable();
      } catch {
        showToast("O'chirishda xatolik", "error");
      }
    }
  };

  return (
    <>
      <TabPage
        headerCompoonent={
          <div className="d-flex justify-content-between align-items-center h-100">
            {/* Chap: Excel tugmalari */}
            <div className="d-flex gap-2">
              <AppButton
                variant="secondary"
                label={`"Excel" дан юклаш`}
                onClick={() => setIsExcelOpen(true)}
              />
              <AppButton
                variant="secondary"
                label={isExporting ? "Yuklanmoqda..." : `"Excel" га юклаш`}
                onClick={handleExport}
                disabled={isExporting}
              />
            </div>

            {/* O'ng: mode tugmalari + date picker(lar) */}
            <div className="d-flex gap-2 align-items-center">
              {/* Mode tugmalari */}
              <div className="d-flex gap-1">
                <AppButton
                  variant={mode === "oneDay" ? "primary" : "secondary"}
                  label={t("reports.oneDay")}
                  onClick={() => setMode("oneDay")}
                />
                <AppButton
                  variant={mode === "timePeriod" ? "primary" : "secondary"}
                  label={t("reports.timePeriod")}
                  onClick={() => setMode("timePeriod")}
                />
                {mode === "oneDay" && (
                  <AppButton
                    variant="secondary"
                    label={t("reports.delete")}
                    onClick={handleDelete}
                    className="ms-1"
                  />
                )}
              </div>

              {/* Bir kunlik: bitta date picker */}
              {mode === "oneDay" ? (
                <DatePicker
                  placeholder="Sana"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              ) : (
                /* Vaqt oralig'i: ikkita date picker */
                <>
                  <DatePicker
                    placeholder={t("dashboard.startDate")}
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                  <DatePicker
                    placeholder={t("dashboard.endDate")}
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </>
              )}
            </div>
          </div>
        }
      >
        {loadingTable ? (
          <Loading />
        ) : (
          <WorkDoneBaseTable
            directions={indicators}
            tableData={regions}
            mode={mode}
            onCellChange={(indicator_id, region_id, score, value) => {
              const json: any = {
                indicator_id,
                direction_id: tab,
                region_id,
                score,
                value:  value ?? 0,
                date:   fromDate,
              };

              IndicatorValueApi.create(json)
                .then(() => {
                  const next  = [...indicators];
                  const iIdx  = next.findIndex((i: any) => i.indicator_id === indicator_id);
                  if (iIdx === -1) return;
                  const rIdx  = next[iIdx].regions.findIndex((r: any) => r.region_id === region_id);
                  if (rIdx === -1) return;
                  next[iIdx].regions[rIdx].value = value;
                  setIndicators(next);
                })
                .catch(console.log);
            }}
          />
        )}
      </TabPage>

      {isExcelOpen && (
        <ExcelReader
          onClose={() => setIsExcelOpen(false)}
          onSaved={() => {
            WorkDoneApi.getByDirection(tab, { from: fromDate, to: toDate })
              .then((res) => setIndicators(res))
              .catch(console.log);
          }}
        />
      )}
    </>
  );
}
